import { Dispatch, SetStateAction, useState } from "react"

export abstract class CsItemBase {
    readonly: boolean = false
}


export default abstract class CsItem<T> extends CsItemBase {
    value: T = {} as T
    setValue: Dispatch<SetStateAction<T>> = {} as Dispatch<SetStateAction<T>>
    validateOption: ValidateOption = new ValidateOption()
    constructor() {
        super()
    }
    set(state: [val: T, setVal: Dispatch<SetStateAction<T>>]) {
        this.value = state[0]
        this.setValue = state[1]
        return this
    }
}

export class ValidateOption {
    isRequired: boolean = false
    min: number = 0
    max: number = 0
    isEmail: boolean = false
    regExp: string | null = null
}

export class CsTextBoxItem extends CsItem<string> {
    constructor() {
        super()
    }
    static Default = {} as CsTextBoxItem
    static New() {
        return new CsTextBoxItem()
    }
}

export class CsPasswordBoxItem extends CsItem<string> {
    constructor() {
        super()
    }
    static Default = {} as CsPasswordBoxItem
    static New() {
        return new CsPasswordBoxItem()
    }
}

export class CsTextAreaItem extends CsItem<string> {
    constructor() {
        super()
    }
    static Default = {} as CsTextAreaItem
    static New() {
        return new CsTextAreaItem()
    }
}

export class CsCheckBoxItem extends CsItem<boolean> {
    text: string
    constructor(text: string) {
        super()
        this.text = text
    }
    static Default = {} as CsCheckBoxItem
    static New(text: string) {
        return new CsCheckBoxItem(text)
    }
}

export class CsSelectBoxItem extends CsItem<string> {
    options: string[]
    selected?: string
    constructor(options: string[], selected?: string) {
        super()
        this.selected = selected
        this.options = options
    }

    setOptions(options: string[]): void {
        this.options = options
        this.selected = undefined
    }

    isSelected(): boolean {
        return (this.isSelected !== undefined)
    }
    static Default = {} as CsSelectBoxItem
    static New(options: string[], selected?: string) {
        return new CsSelectBoxItem(options, selected)
    }
}

export class CsRadioBoxItem extends CsItem<string> {
    name: string
    options: string[]
    selected?: string
    constructor(name: string, options: string[], selected?: string) {
        super()
        this.name = name
        this.selected = selected
        this.options = options
    }

    setOptions(options: string[]): void {
        this.options = options
        this.selected = undefined
    }

    isSelected(): boolean {
        return (this.isSelected !== undefined)
    }
    static Default = {} as CsRadioBoxItem

    static New(name: string, options: string[], selected?: string) {
        return new CsRadioBoxItem(name, options, selected)
    }
}
