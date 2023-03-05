import { Dispatch, SetStateAction } from "react"

export abstract class CsItemBase {
    label: string = ""
    readonly: boolean = false
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

export abstract class CsItem<T> extends CsItemBase {
    value: T = {} as T
    setValue: Dispatch<SetStateAction<T>> = {} as Dispatch<SetStateAction<T>>
    validateOption: ValidateOption<T> = new ValidateOption<T>()
    init(label: string, readonly: boolean = false) {
        this.label = label
        this.readonly = readonly
        return this
    }
    setState(state: [val: T, setVal: Dispatch<SetStateAction<T>>]) {
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
}

export class CsInputNumberItem extends CsItem<number> {
}
export class CsPasswordItem extends CsItem<string> {
}

export class CsTextAreaItem extends CsItem<string> {
}

export class CsCheckBoxItem extends CsItem<boolean> {
}

export class CsSelectBoxItem extends CsItem<string> {
    options: any[] = []
    valueKey: string = "value"
    labelKey: string = "label"
    selected?: string
    setOptionStrings(options: string[], selected?: string): CsSelectBoxItem {
        this.options = options.map((o) => ({ value: o, label: o }))
        this.selected = selected
        return this
    }
    setOptions(options: any[], valueKey: string, labelKey: string, selected?: string): CsSelectBoxItem {
        this.options = options
        this.valueKey = valueKey
        this.labelKey = labelKey
        this.selected = selected
        return this
    }
    isSelected(): boolean {
        return (this.selected !== undefined)
    }
}

export class CsRadioBoxItem extends CsItem<string> {
    options: any[] = []
    valueKey: string = "value"
    labelKey: string = "label"
    selected?: string
    setOptionStrings(options: string[], selected?: string): CsRadioBoxItem {
        this.options = options.map((o) => ({ value: o, label: o }))
        this.selected = selected
        return this
    }
    setOptions(options: any[], valueKey: string, labelKey: string, selected?: string): CsRadioBoxItem {
        this.options = options
        this.valueKey = valueKey
        this.labelKey = labelKey
        this.selected = selected
        return this
    }
    isSelected(): boolean {
        return (this.selected !== undefined)
    }
}
