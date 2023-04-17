import {
  CsItem, CsStringItem, StringValidationRule,
  CsNumberArrayItem, NumberValidationRule, CsNumberItem,
  CsStringArrayItem, StringArrayValidationRule, CsView,
  CsValidationEvent, CsNumberOptionsItem, CsNumberRangeItem,
  CsStringArrayOptionsItem, CsStringOptionsItem
} from ".."
import * as yup from "yup"
import { AnyObject, ArraySchema, NumberSchema, ObjectSchema, StringSchema, ValidationError } from "yup"


type ValueTypeYup = StringSchema<string | undefined, AnyObject, undefined, "">
  | NumberSchema<number | undefined, AnyObject, undefined, "">
  | ArraySchema<(string | undefined)[] | undefined, AnyObject, "", "">
  | ArraySchema<(number | undefined)[] | undefined, AnyObject, undefined, "">

const createValidationSchema = <T extends CsView>(instance: T) => {
  const validateFieldMap = new Map<string, any>()
  const validationMap = new Map<string, ValueTypeYup>()
  const keys = Object.keys(instance)
  keys.forEach(key => {
    const item = instance[key as keyof T]
    if (!(item instanceof CsItem)) return
    if (item instanceof CsStringItem) {
      createStringConstraint(item, key, validationMap)
    }
    if (item instanceof CsNumberArrayItem) {
      createNumberArrayConstraint(item, key, validationMap)
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
      createNumberArrayConstraint(item, key, validationMap)
    }
    validateFieldMap.set(key, item.value)
    return
  })
  const validationSchemaDefObj = Object.fromEntries(validationMap)
  const validationSchemaObj = yup.object().shape(validationSchemaDefObj)
  return { validationSchemaObj, validateFieldMap }
}

const createStringConstraint = (
  item: CsItem<string>, key: string, validationMap: Map<string, ValueTypeYup>
) => {
  if (item.validationRule instanceof StringValidationRule) {
    const sRule = item.validationRule as StringValidationRule
    let sy = (sRule.required)
      ? yup.string().required(item.label + "は必須です。値を設定してください")
      : yup.string().optional()
    const min = sRule.min ?? ((sRule.required) ? 1 : undefined)
    if (min !== undefined) {
      const message = (min === 1 && sRule.required)
        ? item.label + "は必須です。値を設定してください"
        : item.label + "が短すぎます。 " + sRule.min + "文字より長い文字列を入力してください"
      sy = sy.min(min, message)
    }
    if (sRule.max !== undefined) {
      sy = sy.max(sRule.max, item.label + "が長すぎます。 " + sRule.max + "文字より短い文字列を入力してください")
    }
    if (sRule.email) {
      sy = sy.email(item.label + "は、正しいメールアドレスの形式で入力してください")
    }
    validationMap.set(key, sy)
  }
}

const createNumberConstraint = (
  item: CsItem<number>, key: string, validationMap: Map<string, ValueTypeYup>
) => {
  if (item.validationRule instanceof NumberValidationRule) {
    const nRule = item.validationRule as NumberValidationRule
    let ny = (nRule.required)
      ? yup.number().required(item.label + "は必須です。値を設定してください")
      : yup.number().optional()
    if (nRule.min !== undefined) {
      ny = ny.min(nRule.min, item.label + "が小さすぎます。 " + nRule.min + "より大きい数を入力してください")
    }
    if (nRule.max !== undefined) {
      ny = ny.max(nRule.max, item.label + "が大きすぎます。 " + nRule.max + "より小さい数を入力してください")
    }
    validationMap.set(key, ny)
  }
}

const createStringArrayConstraint = (
  item: CsItem<string[]>, key: string, validationMap: Map<string, ValueTypeYup>
) => {
  if (item.validationRule instanceof StringArrayValidationRule) {
    const saRule = item.validationRule as StringArrayValidationRule
    const say = (saRule.required)
      ? yup.array().of(yup.string()).min(1, item.label + "は必須です。1つ以上の値を入力してください")
      : yup.array().of(yup.string().optional())
    validationMap.set(key, say)
  }
}

const createNumberArrayConstraint = (
  item: CsItem<number>, key: string, validationMap: Map<string, ValueTypeYup>
) => {
  if (item.validationRule instanceof NumberValidationRule) {
    const nRule = item.validationRule as NumberValidationRule
    let ny = (nRule.required)
      ? yup.number().required(item.label + "は必須です。値を設定してください")
      : yup.number().optional()
    if (nRule.min) {
      ny = ny.min(nRule.min, item.label + "が小さすぎます。 " + nRule.min + "より大きい数を入力してください")
    }
    if (nRule.max) {
      ny = ny.max(nRule.max, item.label + "が大きすぎます。 " + nRule.max + "より小さい数を入力してください")
    }
    const nay = yup.array(ny)
    validationMap.set(key, nay)
  }
}

type YupObject = ObjectSchema<{
  [x: string]: string | number | (string | undefined)[] | (number | undefined)[] | undefined;
}, yup.AnyObject, {
  [x: string]: "" | undefined;
}, "">

export class CsYupValidationEvent extends CsValidationEvent {
  parentView: CsView
  validationSchemaObj: YupObject
  validateFieldMap: Map<string, string | number | string[] | undefined>
  yupError?: ValidationError

  constructor(
    view: CsView,
    validationSchemaObj: YupObject,
    validateFieldMap: Map<string, string | number | string[] | undefined>
  ) {
    super()
    this.parentView = view
    this.validationSchemaObj = validationSchemaObj
    this.validateFieldMap = validateFieldMap
  }

  onValidateHasError = (): boolean => {
    const sourceMap = new Map<string, any>()
    for (const k of this.validateFieldMap.keys()) {
      const value = this.validateFieldMap.get(k)
      const newValue = (value === "") ? undefined : value
      sourceMap.set(k, newValue)
    }
    const data = Object.fromEntries(sourceMap)
    let hasError = false
    try {
      const result = this.validationSchemaObj.validateSync({ ...data }, { abortEarly: false })
      console.warn(result)
    } catch (error) {
      hasError = true
      if (error instanceof ValidationError) {
        this.yupError = error
        for (const item of Object.values(this.parentView)) {
          if (item instanceof CsItem) {
            let message = ""
            message = this.yupError!.inner
              .find(ve => ((ve.path?.split("[")[0] === item.key)))?.message ?? ""
            if (item.setValidationMessage) {
              item.setValidationMessage(message)
            }
          }
        }
      }
    }
    return hasError
  }

  onValidateItemHasError = <T>(newValue: T | undefined, item: CsItem<T>) => {
    const itemSchema = this.validationSchemaObj.pick([item.key])
    let hasError = false
    try {
      const map = new Map<string, T | undefined>()
      map.set(item.key, newValue)
      const data = Object.fromEntries(map)
      itemSchema.validateSync(data)
      if (item.setValidationMessage) {
        item.setValidationMessage("")
      }
    } catch (error) {
      hasError = true
      if (error instanceof ValidationError) {
        const yupError = error as ValidationError
        let message = (yupError.path?.split("[")[0] === item.key) ? yupError.message : ""
        if (Array.isArray(message)) {
          message = message.join(" ")
        }
        if (item.setValidationMessage) {
          item.setValidationMessage(message)
        }
      }
    }
    return hasError
  }

  validationErrorMessage(item: CsItem<unknown>): string {
    return "" //this.yupError?.issues?.find(i => (i.path.includes(item.key)))?.message ?? ""
  }

  resetError = (name?: string) => {
    // Object.values(this.parentView).forEach((item) => {
    //   if (item instanceof CsItem) {
    //     if (item.setValidationMessage) {
    //       if (name === undefined || name === item.key) {
    //         item.setValidationMessage("")
    //       }
    //     }
    //   }
    // })
  }
}

export const useCsYupValidationEvent = <T extends CsView>(
  instance: T
) => {
  const { validationSchemaObj, validateFieldMap } = createValidationSchema(instance)
  const validationEvent = new CsYupValidationEvent(instance, validationSchemaObj, validateFieldMap)
  return validationEvent
}
