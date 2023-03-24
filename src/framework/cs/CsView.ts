import { CsItem, CsItemBase, NumberValidationRule, StringArrayValidationRule, StringValidationRule } from "./CsItem"
import { stringField, useValidation } from "../validation"
import FieldConstraint from "../validation/field/FieldConstraint"
import StringFieldConstraint from "../validation/field/StringFieldConstraint"
import NumberFieldConstraint, { numberField } from "../validation/field/NumberFieldConstraint"
import { CsValidationEvent } from "./CsEvent"
import StringArrayFieldConstraint, { stringArrayField } from "../validation/field/StringArrayFieldConstraint"
import { z, ZodArray, ZodNumber, ZodObject, ZodOptional, ZodString } from "zod"
import { ZodError } from "zod/lib"

export default abstract class CsView {
  readonly: boolean = false
}

export abstract class CsRIView extends CsView {
  validateFieldMap?: Map<string, string | number | string[] | undefined>
  validateEvent?: CsValidationEvent

  static createValidationSchema = <T extends CsView>(instance: T) => {
    const validationMap = new Map<string, StringFieldConstraint | NumberFieldConstraint | StringArrayFieldConstraint | FieldConstraint<boolean>>()
    const validateFieldMap = new Map<string, string | number | string[] | undefined>()
    const keys = Object.keys(instance)
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
    return { validationSchemaObj, validateFieldMap }
  }

}

export const useCsView = <T extends CsRIView>(
  instance: T
) => {
  const { validationSchemaObj, validateFieldMap } = CsRIView.createValidationSchema<T>(instance)
  Object.keys(instance).forEach(k => {
    const v = instance[k as keyof T]
    if (v instanceof CsItemBase) {
      v.key = k
    }
  })
  const { error, validator, resetError, handleSubmit } = useValidation(validationSchemaObj)
  const validateEvent = new CsValidationEvent(error, validator, resetError, handleSubmit)
  instance.validateEvent = validateEvent
  instance.validateFieldMap = validateFieldMap
  return instance
}


export class CsZodValidationEvent {
  validationSchemaObj: ZodObject<{
    [k: string]: z.ZodString | z.ZodNumber | z.ZodArray<z.ZodString, "many"> | z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
  }>
  validateFieldMap: Map<string, string | number | string[] | undefined>
  zodError?: ZodError

  constructor(
    validationSchemaObj: ZodObject<{
      [k: string]: z.ZodString | z.ZodNumber | z.ZodArray<z.ZodString, "many"> | z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    }>,
    validateFieldMap: Map<string, string | number | string[] | undefined>
  ) {
    this.validationSchemaObj = validationSchemaObj
    this.validateFieldMap = validateFieldMap
  }


  onValidateHasError = (view: CsZodView): boolean => {
    const data = Object.fromEntries(view.validationEvent?.validateFieldMap)
    const zodError = this.validationSchemaObj?.safeParse(data)
    return (zodError?.success !== true)
  }

  onItemValidateHasError = <T extends string | number | number[] | string[]>(newValue: T | undefined, item: CsItem<T>) => {
    // const validator = this.validator.constraint[item.key]
    // const hasError = validator.validate(newValue)
    // if (!hasError) {
    //   this.resetError(item.key)
    // }
    // return hasError
    return false
  }

}
export abstract class CsZodView extends CsView {

  validationEvent?: CsZodValidationEvent

  static createValidationSchema<T extends CsZodView>(instance: T) {
    const validateFieldMap = new Map<string, any>()
    const validationMap = new Map<string, ZodString | ZodNumber | ZodArray<ZodString> | ZodOptional<ZodArray<ZodString>>>()
    const keys = Object.keys(instance)
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
          const sz = (sRule.required)
            ? z.string({ required_error: csItem.label + "は必須です。値を設定してください" })
            : z.string()
          if (sRule.min) sz.min(sRule.min, csItem.label + "が短すぎます。 " + sRule.min + "文字より長い文字列を入力してください")
          if (sRule.max) sz.max(sRule.max, csItem.label + "が長すぎます。 " + sRule.max + "文字より短い文字列を入力してください")
          if (sRule.email) sz.email(csItem.label + "は、正しいメールアドレスの形式で入力してください")
          if (!sRule.required) sz.optional();
          validationMap.set(key, sz)
          validateFieldMap.set(key, value)
        }
      }
      if (item instanceof CsItem<number>) {
        const csItem = item as CsItem<number>
        const value = csItem.value;
        const rule = csItem.ValidationRule
        if (rule instanceof NumberValidationRule) {
          const nRule = rule as NumberValidationRule
          const nz = (nRule.required)
            ? z.number({ required_error: csItem.label + "は必須です。値を設定してください" })
            : z.number()
          if (nRule.min) nz.min(nRule.min, csItem.label + "が小さすぎます。 " + nRule.min + "より大きい数を入力してください")
          if (nRule.max) nz.max(nRule.max, csItem.label + "が大きすぎます。 " + nRule.max + "より小さい数を入力してください")
          if (!nRule.required) nz.optional()
          validationMap.set(key, nz)
          validateFieldMap.set(key, value)
        }
      }
      if (item instanceof CsItem<string[]>) {
        const csItem = item as CsItem<string[]>
        const value = csItem.value;
        const rule = csItem.ValidationRule
        if (rule instanceof StringArrayValidationRule) {
          const saRule = rule as StringArrayValidationRule
          const saz = (saRule.required)
            ? z.array(z.string(), { required_error: csItem.label + "は必須です。1つ以上の値を入力してください" })
            : z.array(z.string()).optional()
          validationMap.set(key, saz)
          validateFieldMap.set(key, value)
        }
      }
    })
    const validationSchemaDefObj = Object.fromEntries(validationMap)
    const validationSchemaObj = z.object(validationSchemaDefObj)
    return { validationSchemaObj, validateFieldMap }

  }
}

export const useCsZodView = <T extends CsZodView>(
  instance: T
) => {
  Object.keys(instance).forEach(k => {
    const v = instance[k as keyof T]
    if (v instanceof CsItemBase) {
      v.key = k
      v.parentView = instance as CsView
    }
  })
  const { validationSchemaObj, validateFieldMap } = CsZodView.createValidationSchema(instance)
  instance.validationEvent = new CsZodValidationEvent(validationSchemaObj, validateFieldMap)
}
