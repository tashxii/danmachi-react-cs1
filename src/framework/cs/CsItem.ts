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
}

export class NumberValidationRule extends ValidationRule<number> {
  min: number = 0
  max: number = 0
  setRange = (min: number, max: number): NumberValidationRule => {
    this.min = min
    this.max = max
    return this
  }
}

export class StringValidationRule extends ValidationRule<string> {
  min: number = 0
  max: number = 0
  email: boolean = false
  regExp: string | null = null
  setLength = (min: number, max: number) => {
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
}

export type SetValueTypeRequired<T> = Dispatch<SetStateAction<T>>
export type SetValueTypeOptional<T> = Dispatch<SetStateAction<T | undefined>>
export type ValueType<T> = T | undefined

export abstract class CsItem<T> extends CsItemBase {
  value: ValueType<T> = undefined
  private setValueReq?: SetValueTypeRequired<T>
  private setValueOpt?: SetValueTypeOptional<T>
  ValidationRule: ValidationRule<T> = new ValidationRule<T>()

  init = (label: string, readonly: boolean = false) => {
    this.label = label
    this.setReadonly(readonly)
    return this
  }

  setState = (state: StateResult<T>) => {
    this.value = state[0]
    if (this.value !== undefined) {
      this.setValueReq = state[1] as SetValueTypeRequired<T>
    } else {
      this.setValueOpt = state[1] as SetValueTypeOptional<T>
    }
    return this
  }

  setValue = (value?: SetStateAction<T>) => {
    if (this.setValueOpt) {
      this.setValueOpt(value as SetStateAction<T | undefined>)
      return
    }
    if (this.setValueReq) {
      if (value !== undefined) {
        this.setValueReq(value);
        return
      }
      throw new Error("undefined cannot be passed to setState, only allowed when you specify any inital value for useState(initialValue).")
    }
    throw new Error("setState must be called before using setValue")
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

export class CsPasswordItem extends CsItem<string> {
  //Genericの型変数だけで一致した場合でも、同一型とみなされるための回避用の識別子
  private identifier?: CsPasswordItem
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
  valueKey: string = "value"
  labelKey: string = "label"
  setOptions = (options: any[], valueKey: string, labelKey: string) => {
    this.options = options
    this.valueKey = valueKey
    this.labelKey = labelKey
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
    return this.options.filter((o => this.value?.includes(o[this.valueKey])))
  }
}

export class CsSelectBoxItem<T extends string | number = string> extends CsHasOptionsItem<T> {
  //Genericの型変数だけで一致した場合でも、同一型とみなされるための回避用の識別子
  private identifier?: CsSelectBoxItem<T>
  isSelected(): boolean {
    return (this.value !== undefined)
  }
  getSelectedOption(): any {
    return this.options.find(o => o[this.valueKey] === this.value)
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
    return this.options.find(o => o[this.valueKey] === this.value)
  }
}
