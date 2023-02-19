import { Dispatch, SetStateAction, useState } from "react"

export abstract class CsItemBase {
    readonly: boolean = false
}

export default abstract class CsItem<T> extends CsItemBase {
    value: T | undefined
    setValue: Dispatch<SetStateAction<T>>
    validateOption: ValidateOption = new ValidateOption()
    constructor(initialValue:T) {
        super()
        const [val, set] = useState(initialValue)
        this.value = val
        this.setValue = set
    }
}

export class ValidateOption {
    isRequired: boolean = false
    min : number = 0
    max : number = 0
    isEmail: boolean = false
    regExp: string | null = null
}

export class CsTextBoxItem extends CsItem<string> {
    constructor(initialValue:string) {
        super(initialValue)
    }
    static Default = {} as CsTextBoxItem
    static New(initialValue:string) {
        return new CsTextBoxItem(initialValue)
    }
}

export class CsPasswordBoxItem extends CsItem<string> {
    constructor(initialValue:string) {
        super(initialValue)
    }
    static Default = {} as CsPasswordBoxItem
    static New(initialValue:string) {
        return new CsPasswordBoxItem(initialValue)
    }
}

export class CsTextAreaItem extends CsItem<string> {
    constructor(initialValue:string) {
        super(initialValue)
    }
    static Default = {} as CsTextAreaItem
    static New(initialValue:string) {
        return new CsTextAreaItem(initialValue)
    }
}

export class CsCheckBoxItem extends CsItem<boolean> {
    text: string
    constructor(initialValue:boolean, text: string) {
        super(initialValue)
        this.text = text
    }
    static Default = {} as CsCheckBoxItem
    static New(initialValue:boolean, text:string) {
        return new CsCheckBoxItem(initialValue, text)
    }
}

export class CsSelectBoxItem extends CsItem<string> {
    options : string[]
    selected? : string
    constructor(initialValue: string, options:string[], selected?: string) {
        super(initialValue)
        this.selected = selected
        this.options = options
    }

    setOptions(options:string[]) :void {
        this.options = options
        this.selected = undefined
    }

    isSelected() : boolean {
        return (this.isSelected !== undefined)
    }
    static Default = {} as CsSelectBoxItem
    static New(initialValue: string, options:string[], selected?: string) {
        return new CsSelectBoxItem(initialValue, options, selected)
    }
}

export class CsRadioBoxItem extends CsItem<string> {
    name: string
    options : string[]
    selected? : string
    constructor(name:string, initialValue: string, options:string[], selected?: string) {
        super(initialValue)
        this.name = name
        this.selected = selected
        this.options = options
    }

    setOptions(options:string[]) :void {
        this.options = options
        this.selected = undefined
    }

    isSelected() : boolean {
        return (this.isSelected !== undefined)
    }
    static Default = {} as CsRadioBoxItem
    static New(name: string, initialValue: string, options:string[], selected?: string) {
        return new CsRadioBoxItem(name, initialValue, options, selected)
    }
}
