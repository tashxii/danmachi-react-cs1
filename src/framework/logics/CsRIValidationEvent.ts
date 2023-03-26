import { stringField, numberField, stringArrayField, useValidation } from "../validation"
import FieldConstraint from "../validation/field/FieldConstraint"
import NumberFieldConstraint from "../validation/field/NumberFieldConstraint"
import StringArrayFieldConstraint from "../validation/field/StringArrayFieldConstraint"
import StringFieldConstraint from "../validation/field/StringFieldConstraint"
import { AvailableFiledType, ConstraintValidators, ValidationError } from "../validation/Validation"
import { CsItem, CsStringItem, StringValidationRule, CsNumberItem, NumberValidationRule, CsStringArrayItem, StringArrayValidationRule, CsItemBase, CsStringOptionsItem, CsNumberOptionsItem, CsStringArrayOptionsItem } from "./CsItem"
import { CsNumberRangeItem } from "./CsItemAdvanced"
import { CsValidationEvent, CsView } from "./CsView"

const createValidationSchema = <T extends CsView>(instance: T) => {
  const validationMap = new Map<string, StringFieldConstraint | NumberFieldConstraint | StringArrayFieldConstraint | FieldConstraint<boolean>>()
  const validateFieldMap = new Map<string, string | number | string[] | undefined>()
  const keys = Object.keys(instance)
  keys.forEach(key => {
    const item = instance[key as keyof T]
    if (!(item instanceof CsItem)) return
    if (item.validationRule) {
      if (item instanceof CsStringItem) {
        createStringConstraint(item, key, validationMap)
      }
      if (item instanceof CsNumberItem) {
        createNumberConstraint(item, key, validationMap)
      }
      if (item instanceof CsStringArrayItem) {
        createStringArrayConstraint(item, key, validationMap)
      }
      if (item instanceof CsStringOptionsItem) {
        createStringConstraint(item, key, validationMap)
      }
      if (item instanceof CsNumberOptionsItem) {
        createNumberConstraint(item, key, validationMap)
      }
      if (item instanceof CsStringArrayOptionsItem) {
        createStringArrayConstraint(item, key, validationMap)
      }
      if (item instanceof CsNumberRangeItem) {
        createNumberConstraint(item, key, validationMap)
      }
      validateFieldMap.set(key, item.value)
    }
  })
  const validationSchemaObj = Object.fromEntries(validationMap)
  return { validationSchemaObj, validateFieldMap }
}

const createStringConstraint = (
  item: CsItem<string>, key: string,
  validationMap = new Map<string, StringFieldConstraint | NumberFieldConstraint | StringArrayFieldConstraint | FieldConstraint<boolean>>()
) => {
  if (item.validationRule instanceof StringValidationRule) {
    const sRule = item.validationRule as StringValidationRule
    const sf = stringField()
    if (sRule.required)
      sf.required(item.label + "は必須です。値を設定してください")
    if (sRule.min !== undefined)
      sf.minLength(sRule.min, item.label + "が短すぎます。 " + sRule.min + "文字より長い文字列を入力してください")
    if (sRule.max !== undefined)
      sf.maxLength(sRule.max, item.label + "が長すぎます。 " + sRule.max + "文字より短い文字列を入力してください")
    if (sRule.email)
      sf.email(item.label + "は、正しいメールアドレスの形式で入力してください")
    validationMap.set(key, sf)
  }
}

const createNumberConstraint = (
  item: CsItem<number>, key: string,
  validationMap = new Map<string, StringFieldConstraint | NumberFieldConstraint | StringArrayFieldConstraint | FieldConstraint<boolean>>()
) => {
  if (item.validationRule instanceof NumberValidationRule) {
    const nRule = item.validationRule as NumberValidationRule
    const nf = numberField()
    if (nRule.required)
      nf.required(item.label + "は必須です。値を設定してください")
    if (nRule.min !== undefined)
      nf.min(nRule.min, item.label + "が小さすぎます。 " + nRule.min + "より大きい数を入力してください")
    if (nRule.max !== undefined)
      nf.max(nRule.max, item.label + "が大きすぎます。 " + nRule.max + "より小さい数を入力してください")
    validationMap.set(key, nf)
  }
}

const createStringArrayConstraint = (
  item: CsItem<string[]>, key: string,
  validationMap = new Map<string, StringFieldConstraint | NumberFieldConstraint | StringArrayFieldConstraint | FieldConstraint<boolean>>()
) => {
  if (item.validationRule instanceof StringArrayValidationRule) {
    const saRule = item.validationRule as StringArrayValidationRule
    const saf = stringArrayField()
    if (saRule.required)
      saf.required(item.label + "は必須です。1つ以上の値を入力してください")
    validationMap.set(key, saf)
  }
}

export type ValidationCallback = (event: React.FormEvent<HTMLFormElement>) => void

export class CsRIValidationEvent extends CsValidationEvent {
  parentView: CsView
  validationError: ValidationError<AvailableFiledType>
  validator: ConstraintValidators<AvailableFiledType>
  resetErrorInner: (name?: string) => void
  validateFieldMap: Map<string, string | number | string[] | undefined>

  private handleSubmit: (value: AvailableFiledType, callback: ValidationCallback, onError?: ValidationCallback) => ValidationCallback
  constructor(
    view: CsView,
    validateFieldMap: Map<string, string | number | string[] | undefined>,
    error: ValidationError<AvailableFiledType>,
    validator: ConstraintValidators<AvailableFiledType>,
    resetError: (name?: string) => void,
    handleSubmit: (value: AvailableFiledType, callback: ValidationCallback, onError?: ValidationCallback) => ValidationCallback
  ) {
    super()
    this.parentView = view
    this.validateFieldMap = validateFieldMap
    this.validationError = error
    this.validator = validator
    this.resetErrorInner = resetError
    this.handleSubmit = handleSubmit
  }

  /** Form でのサブミットを使用する際に利用する。Formを使う意味はほとんどなく、
   *  XxButtonを使用してればOnClickまえに検証が行えるため、非推奨 */
  onHandleSubmit = (
    view: CsView,
    callback: ValidationCallback,
    onError?: ValidationCallback)
    : ValidationCallback => {
    const validationEvent = view.validationEvent as CsRIValidationEvent
    const value = Object.fromEntries(validationEvent.validateFieldMap)
    const result = this.handleSubmit(value, callback, onError)
    return result
  }

  /** XxButtonから呼び出すためのバリデーションメソッド
   *  エラーがあったか、なかったかをbooleanとして返す */
  onValidateHasError = (): boolean => {
    const value = Object.fromEntries(this.validateFieldMap)
    return this.validator.validateAll(value)
  }

  onValidateItemHasError = <T>(newValue: T | undefined, item: CsItem<T>) => {
    const validator = this.validator.constraint[item.key]
    const hasError = validator.validate(newValue)
    if (!hasError) {
      this.resetError(item.key)
    }
    return hasError
  }

  validationErrorMessage(item: CsItem<unknown>): string {
    return this.validationError[item.key] ?? ""
  }

  resetError = (name?: string) => {
    this.resetErrorInner(name)
  }
}

export const useCsRIValidationEvent = <T extends CsView>(
  instance: T
) => {
  const { validationSchemaObj, validateFieldMap } = createValidationSchema<T>(instance)
  const { error, validator, resetError, handleSubmit } = useValidation(validationSchemaObj)
  const validationEvent = new CsRIValidationEvent(instance, validateFieldMap, error, validator, resetError, handleSubmit)
  return validationEvent
}


