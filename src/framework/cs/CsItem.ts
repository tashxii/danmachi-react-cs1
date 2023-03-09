import { Dispatch, SetStateAction } from "react"
import { StateResult } from "./CsHooks"
import CsView from "./CsView"

export abstract class CsItemBase {
    label: string = ""
    readonly: boolean = false
    parentView?: CsView = undefined
}

export class ValidateOption<T> {
    required: boolean = false
    setRequired(required: boolean = true) {
        this.required = required
        return this
    }
}

export class BooleanValidateOption extends ValidateOption<boolean> {
}

export class NumberValidateOption extends ValidateOption<number> {
    min: number = 0
    max: number = 0
    setRange(min: number, max: number): NumberValidateOption {
        this.min = min
        this.max = max
        return this
    }
}

export class StringValidateOption extends ValidateOption<string> {
    min: number = 0
    max: number = 0
    email: boolean = false
    regExp: string | null = null
    setLength(min: number, max: number) {
        this.min = min
        this.max = max
        return this
    }
    setRegExp(regExp: string) {
        this.regExp = regExp
        return this
    }
    setEmail(b: boolean = true) {
        this.email = b
        return this
    }
}
export class StringArrayValidationOption extends ValidateOption<string[]> {
}

export type SetValueType<T> = Dispatch<SetStateAction<T | undefined>> | Dispatch<SetStateAction<T>>
export type ValueType<T> = T | undefined
export abstract class CsItem<T> extends CsItemBase {
    value: ValueType<T> = undefined
    setValue: SetValueType<T> = {} as SetValueType<T>
    validateOption: ValidateOption<T> = new ValidateOption<T>()
    init(label: string, readonly: boolean = false) {
        this.label = label
        this.readonly = readonly
        return this
    }
    setState(state: StateResult<T>) {
        this.value = state[0]
        this.setValue = state[1]
        return this
    }
    setValidateOption<T>(valOpt: ValidateOption<T>) {
        this.validateOption = valOpt
        return this
    }
}

export class CsInputTextItem extends CsItem<string> {
    //Genericで一致した場合に型互換とみなされ混同回避のための識別子
    private identifier?: CsInputTextItem
}

export class CsInputNumberItem extends CsItem<number> {
    //Genericで一致した場合に型互換とみなされ混同回避のための識別子
    private identifier?: CsInputNumberItem
}

export class CsPasswordItem extends CsItem<string> {
    //Genericで一致した場合に型互換とみなされ混同回避のための識別子
    private identifier?: CsPasswordItem
}

export class CsTextAreaItem extends CsItem<string> {
    //Genericで一致した場合に型互換とみなされ混同回避のための識別子
    private identifier?: CsTextAreaItem
}

export class CsCheckBoxItem extends CsItem<boolean> {
    //Genericで一致した場合に型互換とみなされ混同回避のための識別子
    private identifier?: CsCheckBoxItem
    checkBoxText: string = ""
    setCheckBoxText(checkBoxText: string) {
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
    setOptions(options: any[], valueKey: string, labelKey: string) {
        this.options = options
        this.valueKey = valueKey
        this.labelKey = labelKey
        return this
    }
}
export class CsMultiCheckBoxItem extends CsHasOptionsItem<string[]> {
    //Genericで一致した場合に型互換とみなされ混同回避のための識別子
    private identifier?: CsMultiCheckBoxItem
    getCheckedValues(): string[] {
        return this.value ?? []
    }
    getCheckedOption(): any[] {
        return this.options.filter((o => this.value?.includes(o[this.valueKey])))
    }
}

export class CsSelectBoxItem extends CsHasOptionsItem<string> {
    //Genericで一致した場合に型互換とみなされ混同回避のための識別子
    private identifier?: CsSelectBoxItem
    isSelected(): boolean {
        return (this.value !== undefined)
    }
    getSelectedOption(): any {
        return this.options.find(o => o[this.valueKey] === this.value)
    }
}

export class CsRadioBoxItem extends CsHasOptionsItem<string> {
    //Genericで一致した場合に型互換とみなされ混同回避のための識別子
    private identifier?: CsRadioBoxItem
    isSelected(): boolean {
        return (this.value !== undefined)
    }
    getSelectedOption(): any {
        return this.options.find(o => o[this.valueKey] === this.value)
    }
}
