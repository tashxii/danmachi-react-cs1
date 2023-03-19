import { CsItem, CsItemBase, NumberValidationRule, StringArrayValidationRule, StringValidationRule } from "./CsItem"
import { stringField, useValidation } from "../validation"
import FieldConstraint from "../validation/field/FieldConstraint"
import StringFieldConstraint from "../validation/field/StringFieldConstraint"
import NumberFieldConstraint, { numberField } from "../validation/field/NumberFieldConstraint"
import { CsValidationEvent } from "./CsEvent"
import StringArrayFieldConstraint, { stringArrayField } from "../validation/field/StringArrayFieldConstraint"

export default abstract class CsView {
  readonly: boolean = false
  validateFieldMap?: Map<string, string | number | string[] | undefined>
  validateEvent?: CsValidationEvent

  static createValidationSchema<T extends CsView>(instance: T) {
    const validationMap = new Map<string, StringFieldConstraint | NumberFieldConstraint | StringArrayFieldConstraint | FieldConstraint<boolean>>()
    const keys = Object.keys(instance)
    const validateFieldMap = new Map<string, string | number | string[] | undefined>()
    instance.validateFieldMap = validateFieldMap
    keys.forEach(key => {
      const item = instance[key as keyof T]
      if (!(item instanceof CsItem)) return
      item.parentView = instance
      if (item instanceof CsItem<string>) {
        const csItem = item as CsItem<string>
        const value = csItem.value;
        const rule = csItem.ValidationRule
        if (rule instanceof StringValidationRule) {
          const sRule = rule as StringValidationRule
          const sf = stringField();
          if (sRule.required) sf.required(csItem.label + "は必須です。値を設定してください")
          if (sRule.min) sf.minLength(sRule.min, csItem.label + "が短すぎます。 " + sRule.min + "文字より長い文字列を入力してください")
          if (sRule.max) sf.maxLength(sRule.max, csItem.label + "が長すぎます。 " + sRule.max + "文字より短い文字列を入力してください")
          if (sRule.email) sf.email(csItem.label + "は、正しいメールアドレスの形式で入力してください")
          validationMap.set(key, sf)
          validateFieldMap.set(key, value)
        }
      }
      if (item instanceof CsItem<number>) {
        const csItem = item as CsItem<number>
        const value = csItem.value;
        const rule = csItem.ValidationRule
        if (rule instanceof NumberValidationRule) {
          const nRule = rule as NumberValidationRule
          const nf = numberField();
          if (nRule.required) nf.required(csItem.label + "は必須です。値を設定してください")
          if (nRule.min) nf.min(nRule.min, csItem.label + "が小さすぎます。 " + nRule.min + "より大きい数を入力してください")
          if (nRule.max) nf.max(nRule.max, csItem.label + "が大きすぎます。 " + nRule.max + "より小さい数を入力してください")
          validationMap.set(key, nf)
          validateFieldMap.set(key, value)
        }
      }
      if (item instanceof CsItem<string[]>) {
        const csItem = item as CsItem<string[]>
        const value = csItem.value;
        const rule = csItem.ValidationRule
        if (rule instanceof StringArrayValidationRule) {
          const saRule = rule as StringArrayValidationRule
          const saf = stringArrayField();
          if (saRule.required) saf.required(csItem.label + "は必須です。1つ以上の値を入力してください")
          validationMap.set(key, saf)
          validateFieldMap.set(key, value)
        }
      }
    })
    const validationSchemaObj = Object.fromEntries(validationMap)
    return validationSchemaObj
  }
}


export function useCsView<T extends CsView>(
  instance: T
): T {
  const validationSchemaObj = CsView.createValidationSchema<T>(instance)
  Object.keys(instance).forEach(k => {
    const v = instance[k as keyof T]
    if (v instanceof CsItemBase) {
      v.key = k
    }
  })
  const { error, validator, resetError, handleSubmit } = useValidation(validationSchemaObj)
  instance.validateEvent = new CsValidationEvent(error, validator, resetError, handleSubmit)
  return instance
}
