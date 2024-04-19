import { Dispatch, SetStateAction } from "react"
import { CsView, StateResultRequired } from "."
import { StateResult } from "."

export abstract class CsItemBase {
  label: string = ""
  key: string = ""
  private readonly: boolean = false
  parentView?: CsView
  isReadonly() {
    return (this.readonly) ? this.readonly : this.parentView?.readonly ?? false
  }
  setReadonly = (value: boolean) => {
    this.readonly = value
  }
}
type CustomValidator<T> = (newValue: T | undefined, item: CsItem<T>) => boolean

type CustomValidateMessage<T> = ((label: string, value: T, item: CsItem<T>) => string) | string

export class CustomValidationRule<T> {
  validator: CustomValidator<T>
  message: CustomValidateMessage<T>
  constructor(validator: CustomValidator<T>, message: CustomValidateMessage<T>) {
    this.validator = validator
    this.message = message
  }
}

export type CustomValidationRules = { [key: string]: CustomValidationRule<string> | CustomValidationRule<number> | CustomValidationRule<boolean> | CustomValidationRule<string[]> | CustomValidationRule<number[]> }

export const createRegExpValidator = (pattern: RegExp): CustomValidator<string> => {
  return (newValue: string | undefined, item: CsItem<string>) => pattern.test(newValue ?? "")
}

export const customValidationRule = <T>(validator: CustomValidator<T>, message: CustomValidateMessage<T>) => {
  return new CustomValidationRule(validator, message)
}

// eslint-disable-next-line
export class ValidationRule<T> {
  required: boolean = false
  customRuleName?: string
  setRequired = (required: boolean = true) => {
    this.required = required
    return this
  }
  setCustomRuleName = (name: string) => {
    this.customRuleName = name
    return this
  }
}

export class BooleanValidationRule extends ValidationRule<boolean> {
  //Genericの型変数だけで一致した場合でも、同一型とみなされるための回避用の識別子
  private identifier?: BooleanValidationRule
}

export class NumberValidationRule extends ValidationRule<number> {
  //Genericの型変数だけで一致した場合でも、同一型とみなされるための回避用の識別子
  private identifier?: NumberValidationRule
  min: number | undefined
  max: number | undefined
  setRange = (
    min: number | undefined = Number.MAX_SAFE_INTEGER,
    max: number | undefined = Number.MAX_SAFE_INTEGER
  ) => {
    this.min = min
    this.max = max
    return this
  }
}

export class StringValidationRule extends ValidationRule<string> {
  //Genericの型変数だけで一致した場合でも、同一型とみなされるための回避用の識別子
  private identifier?: StringValidationRule
  min: number | undefined
  max: number | undefined
  email: boolean = false
  regExp: string | undefined
  setLength = (
    min: number | undefined = 0,
    max: number | undefined = Number.MAX_SAFE_INTEGER
  ) => {
    this.min = (this.required && min === 0) ? 1 : min
    this.max = max
    return this
  }
  setRegExp = (regExp: string) => {
    this.regExp = regExp
    return this
  }
  setEmail = (b: boolean = true) => {
    this.email = b
    return this
  }
}
export class StringArrayValidationRule extends ValidationRule<string[]> {
  //Genericの型変数だけで一致した場合でも、同一型とみなされるための回避用の識別子
  private identifier?: StringArrayValidationRule
}

export class NumberArrayValidationRule extends ValidationRule<number[]> {
  //Genericの型変数だけで一致した場合でも、同一型とみなされるための回避用の識別子
  private identifier?: NumberArrayValidationRule
}

export type SetValueTypeRequired<T> = Dispatch<SetStateAction<T>>
export type SetValueTypeOptional<T> = Dispatch<SetStateAction<T | undefined>>
export type ValueType<T> = T | undefined

export abstract class CsItem<T> extends CsItemBase {
  value: T | undefined = undefined
  protected setValueOpt: SetValueTypeOptional<T> = {} as SetValueTypeOptional<T>
  validationRule: ValidationRule<T> = new ValidationRule<T>()
  validationMessage?: string
  setValidationMessage?: SetValueTypeRequired<string>
  init = (label: string, readonly: boolean = false) => {
    this.label = label
    this.setReadonly(readonly)
    return this
  }

  setState = (state: StateResult<T>) => {
    this.value = state[0]
    this.setValueOpt = state[1]
    return this
  }

  // vallidationTypeがZodやYupの場合のみ利用。RIでは不要
  setValidation = (state: StateResultRequired<string>) => {
    this.validationMessage = state[0]
    this.setValidationMessage = state[1]
  }

  setValue = (value?: T) => {
    this.setValueOpt(value)
  }

  setValidationRule = <T>(rule: ValidationRule<T>) => {
    this.validationRule = rule
    return this
  }

  get hasValidationError(): boolean {
    return (this.validationErrorMessage.length > 0)
  }

  get validationErrorMessage(): string {
    if (this.validationMessage) {
      return this.validationMessage
    }
    return this.parentView?.validationEvent?.validationErrorMessage(this) ?? ""
  }

  validate = (newValue: T | undefined) => {
    if (!this.validationRule.required && !newValue) {
      return false
    }
    return this.validateAnytime(newValue)
  }

  validateWhenErrorExists = (newValue: T | undefined) => {
    if (!this.hasValidationError) {
      return false
    }
    return this.validateAnytime(newValue)
  }

  validateAnytime = (newValue: T | undefined) => {
    const validationEvent = this.parentView?.validationEvent
    if (validationEvent) {
      return validationEvent.onValidateItemHasError(newValue, this)
    }
    return false
  }
}

export class CsStringItem extends CsItem<string> {
  private itemIdentifier?: CsStringItem
}

export class CsNumberItem extends CsItem<number> {
  private itemIdentifier?: CsNumberItem
}

export class CsStringArrayItem extends CsItem<string[]> {
  private itemIdentifier?: CsStringArrayItem
}

export class CsNumberArrayItem extends CsItem<number[]> {
  private itemIdentifier?: CsNumberArrayItem
}

export class CsBooleanItem extends CsItem<boolean> {
  private itemIdentifier?: CsBooleanItem
}


export class CsInputTextItem extends CsStringItem {
  //Genericの型変数だけで一致した場合でも、同一型とみなされるための回避用の識別子
  private identifier?: CsInputTextItem
}

export class CsInputNumberItem extends CsNumberItem {
  //Genericの型変数だけで一致した場合でも、同一型とみなされるための回避用の識別子
  private identifier?: CsInputNumberItem
}

export class CsInputPasswordItem extends CsStringItem {
  //Genericの型変数だけで一致した場合でも、同一型とみなされるための回避用の識別子
  private identifier?: CsInputPasswordItem
}

export class CsTextAreaItem extends CsStringItem {
  //Genericの型変数だけで一致した場合でも、同一型とみなされるための回避用の識別子
  private identifier?: CsTextAreaItem
}

export class CsCheckBoxItem extends CsBooleanItem {
  //Genericの型変数だけで一致した場合でも、同一型とみなされるための回避用の識別子
  private identifier?: CsCheckBoxItem
  checkBoxText: string = ""
  setCheckBoxText = (checkBoxText: string) => {
    this.checkBoxText = checkBoxText
  }
  isChecked(): boolean {
    return this.value ?? false
  }
}

export abstract class CsHasOptionsItem<T> extends CsItem<T> {
  options: any[] = []
  optionValueKey: string = "value"
  optionLabelKey: string = "label"
  setOptions = (options: any[], optionValueKey: string, optionLabelKey: string) => {
    this.options = options
    this.optionValueKey = optionValueKey
    this.optionLabelKey = optionLabelKey
    return this
  }
}

export abstract class CsStringArrayOptionsItem extends CsHasOptionsItem<string[]> {
  private itemIdentifier?: CsStringArrayOptionsItem
}

export abstract class CsNumberArrayOptionsItem extends CsHasOptionsItem<string[]> {
  private itemIdentifier?: CsNumberArrayOptionsItem
}

export abstract class CsStringOptionsItem extends CsHasOptionsItem<string> {
  private itemIdentifier?: CsStringOptionsItem
}

export abstract class CsNumberOptionsItem extends CsHasOptionsItem<number> {
  private itemIdentifier?: CsNumberOptionsItem
}

export class CsMultiCheckBoxItem extends CsStringArrayOptionsItem {
  //Genericの型変数だけで一致した場合でも、同一型とみなされるための回避用の識別子
  private identifier?: CsMultiCheckBoxItem
  getCheckedValues(): string[] {
    return this.value ?? []
  }
  getCheckedOption(): any[] {
    return this.options.filter((o => this.value?.includes(o[this.optionValueKey])))
  }
}

export class CsSelectBoxItem extends CsStringOptionsItem {
  //Genericの型変数だけで一致した場合でも、同一型とみなされるための回避用の識別子
  private identifier?: CsSelectBoxItem
}


export class CsSelectNumberBoxItem extends CsNumberOptionsItem {
  //Genericの型変数だけで一致した場合でも、同一型とみなされるための回避用の識別子
  private identifier?: CsSelectNumberBoxItem
}

export class CsRadioBoxItem extends CsStringOptionsItem {
  //Genericの型変数だけで一致した場合でも、同一型とみなされるための回避用の識別子
  private identifier?: CsRadioBoxItem
}
