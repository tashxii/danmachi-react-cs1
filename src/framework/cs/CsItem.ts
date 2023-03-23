import { Dispatch, SetStateAction } from "react"
import { StateResult } from "./CsHooks"
import CsView from "./CsView"

export abstract class CsItemBase {
  label: string = ""
  key: string = ""
  private readonly: boolean = false
  parentView?: CsView = undefined
  isReadonly() {
    return (this.readonly) ? this.readonly : this.parentView?.readonly ?? false;
  }
  setReadonly = (value: boolean) => {
    this.readonly = value
  }
}

// eslint-disable-next-line
export class ValidationRule<T> {
  required: boolean = false
  setRequired = (required: boolean = true) => {
    this.required = required
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
  min: number = 0
  max: number = 0
  setRange = (min: number = Number.MAX_SAFE_INTEGER, max: number = Number.MAX_SAFE_INTEGER) => {
    this.min = min
    this.max = max
    return this
  }
}

export class StringValidationRule extends ValidationRule<string> {
  //Genericの型変数だけで一致した場合でも、同一型とみなされるための回避用の識別子
  private identifier?: StringValidationRule
  min: number = 0
  max: number = 0
  email: boolean = false
  regExp: string | null = null
  setLength = (min: number = 0, max: number = Number.MAX_SAFE_INTEGER) => {
    this.min = min
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

export type SetValueTypeRequired<T> = Dispatch<SetStateAction<T>>
export type SetValueTypeOptional<T> = Dispatch<SetStateAction<T | undefined>>
export type ValueType<T> = T | undefined

export abstract class CsItem<T> extends CsItemBase {
  value: T | undefined = undefined
  protected setValueOpt: SetValueTypeOptional<T> = {} as SetValueTypeOptional<T>
  ValidationRule: ValidationRule<T> = new ValidationRule<T>()

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

  setValue = (value?: T) => {
    console.log("setValue", value)
    this.setValueOpt(value)
  }

  setValidationRule = <T>(rule: ValidationRule<T>) => {
    this.ValidationRule = rule
    return this
  }

  get hasValidationError(): boolean {
    return (this.parentView?.validateEvent?.validationError[this.key] !== undefined)
  }

  get validationErrorMessage(): string {
    return this.parentView?.validateEvent?.validationError[this.key] ?? ""
  }
}

export class CsInputTextItem extends CsItem<string> {
  //Genericの型変数だけで一致した場合でも、同一型とみなされるための回避用の識別子
  private identifier?: CsInputTextItem
}

export class CsInputNumberItem extends CsItem<number> {
  //Genericの型変数だけで一致した場合でも、同一型とみなされるための回避用の識別子
  private identifier?: CsInputNumberItem
}

export class CsInputPassword extends CsItem<string> {
  //Genericの型変数だけで一致した場合でも、同一型とみなされるための回避用の識別子
  private identifier?: CsInputPassword
}

export class CsTextAreaItem extends CsItem<string> {
  //Genericの型変数だけで一致した場合でも、同一型とみなされるための回避用の識別子
  private identifier?: CsTextAreaItem
}

export class CsCheckBoxItem extends CsItem<boolean> {
  //Genericの型変数だけで一致した場合でも、同一型とみなされるための回避用の識別子
  private identifier?: CsCheckBoxItem
  checkBoxText: string = ""
  setCheckBoxText = (checkBoxText: string) => {
    this.checkBoxText = checkBoxText
  }
  isChecked(): boolean {
    return this.value ?? false;
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
export class CsMultiCheckBoxItem extends CsHasOptionsItem<string[]> {
  //Genericの型変数だけで一致した場合でも、同一型とみなされるための回避用の識別子
  private identifier?: CsMultiCheckBoxItem
  getCheckedValues(): string[] {
    return this.value ?? []
  }
  getCheckedOption(): any[] {
    return this.options.filter((o => this.value?.includes(o[this.optionValueKey])))
  }
}

export class CsSelectBoxItem<T extends string | number = string> extends CsHasOptionsItem<T> {
  //Genericの型変数だけで一致した場合でも、同一型とみなされるための回避用の識別子
  private identifier?: CsSelectBoxItem<T>
  isSelected(): boolean {
    return (this.value !== undefined)
  }
  getSelectedOption(): any {
    return this.options.find(o => o[this.optionValueKey] === this.value)
  }
}

export type CsSelectNumberBoxItem = CsSelectBoxItem<number>

export class CsRadioBoxItem extends CsHasOptionsItem<string> {
  //Genericの型変数だけで一致した場合でも、同一型とみなされるための回避用の識別子
  private identifier?: CsRadioBoxItem
  isSelected(): boolean {
    return (this.value !== undefined)
  }
  getSelectedOption(): any {
    return this.options.find(o => o[this.optionValueKey] === this.value)
  }
}
