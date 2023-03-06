import { Dispatch, SetStateAction } from "react"

import { BooleanValidateOption, CsCheckBoxItem, CsInputNumberItem, CsInputTextItem, CsItem, CsPasswordItem, CsRadioBoxItem, CsSelectBoxItem, CsTextAreaItem, NumberValidateOption, StringValidateOption, ValidateOption } from "./CsItem"

export function strValOpt(required: boolean, min?: number, max?: number, email?: boolean, regExp?: string): StringValidateOption {
    const valOpt = new StringValidateOption()
    valOpt.setRequired(required)
    if (min && max) valOpt.setLength(min, max)
    if (email) valOpt.setEmail(true)
    if (regExp) valOpt.setRegExp(regExp)
    return valOpt
}

export function numValOpt(required: boolean, min?: number, max?: number): NumberValidateOption {
    const valOpt = new NumberValidateOption()
    valOpt.setRequired(required)
    if (min && max) valOpt.setRange(min, max)
    return valOpt
}

export function boolValOpt(required: boolean) {
    return new BooleanValidateOption().setRequired(required)
}

class SelectOptions {
    options: any[]
    valueKey: string = "value"
    labelKey: string = "label"
    selected?: string
    constructor(options: any[], valueKey: string = "value", labelKey: string = "label", selected?: string) {
        this.options = options
        this.valueKey = valueKey
        this.labelKey = labelKey
        this.selected = selected
    }
}
export function selectOpt(options: any[], valueKey: string = "value", labelKey: string = "label", selected?: string)
    : SelectOptions {
    return new SelectOptions(options, valueKey, labelKey, selected)
}
class SelectOptionStrings {
    options: string[] = []
    selected?: string
    constructor(options: any[], selected?: string) {
        this.options = options
        this.selected = selected
    }
}

export function selectOptStr(options: string[], selected?: string) {
    return new SelectOptionStrings(options, selected)
}

export enum RW {
    Readonly,
    Editable,
}
export function useCsItem<T, I extends CsItem<T>>(
    type: { new(): I }, label: string,
    state: [val: T, setVal: Dispatch<SetStateAction<T>>],
    valOpt: ValidateOption<T>,
    selOpt?: SelectOptions | SelectOptionStrings | undefined,
    readonly: RW = RW.Editable,
): I {
    const item = new type()
    item.label = label
    item.setState(state)
    item.setValidateOption(valOpt)
    if (selOpt) {
        console.log(selOpt)
        if (item instanceof CsRadioBoxItem) {
            const radio = item as CsRadioBoxItem
            console.warn(radio)
            if (selOpt instanceof SelectOptions) {
                radio.setOptions(selOpt.options, selOpt.valueKey, selOpt.valueKey)
            } else if (selOpt instanceof SelectOptionStrings) {
                radio.setOptionStrings(selOpt.options)
            }
            console.warn(radio)
        }
        if (item instanceof CsSelectBoxItem) {
            const select = item as CsSelectBoxItem
            console.warn(select, selOpt)
            if (selOpt instanceof SelectOptions) {
                console.error("here")
                select.setOptions(selOpt.options, selOpt.valueKey, selOpt.valueKey, selOpt.selected)
            } else if (selOpt instanceof SelectOptionStrings) {
                console.error("here")
                select.setOptionStrings(selOpt.options, selOpt.selected)
            }
            console.warn(select, selOpt)
        }
    }
    item.readonly = (readonly === RW.Readonly)
    return item
}

export function useCsInputTextItem(label: string,
    state: [val: string, setVal: Dispatch<SetStateAction<string>>],
    valOpt: ValidateOption<string>,
    readonly: RW = RW.Editable,
): CsInputTextItem {
    return useCsItem(CsInputTextItem, label, state, valOpt, undefined, readonly);
}

export function useCsInputNumberItem(label: string,
    state: [val: number, setVal: Dispatch<SetStateAction<number>>],
    valOpt: ValidateOption<number>,
    readonly: RW = RW.Editable,
): CsInputNumberItem {
    return useCsItem(CsInputNumberItem, label, state, valOpt, undefined, readonly);
}

export function useCsPasswordItem(label: string,
    state: [val: string, setVal: Dispatch<SetStateAction<string>>],
    valOpt: ValidateOption<string>,
    readonly: RW = RW.Editable,
): CsPasswordItem {
    return useCsItem(CsPasswordItem, label, state, valOpt, undefined, readonly);
}

export function useCsTextAreaItem(label: string,
    state: [val: string, setVal: Dispatch<SetStateAction<string>>],
    valOpt: ValidateOption<string>,
    readonly: RW = RW.Editable,
): CsTextAreaItem {
    return useCsItem(CsTextAreaItem, label, state, valOpt, undefined, readonly);
}

export function useCsCheckBoxItem(label: string,
    state: [val: boolean, setVal: Dispatch<SetStateAction<boolean>>],
    valOpt: ValidateOption<boolean>,
    readonly: RW = RW.Editable,
): CsCheckBoxItem {
    return useCsItem(CsCheckBoxItem, label, state, valOpt, undefined, readonly);
}

export function useCsSelectBoxItem(label: string,
    state: [val: string, setVal: Dispatch<SetStateAction<string>>],
    valOpt: ValidateOption<string>, selOpt: SelectOptions | SelectOptionStrings | undefined,
    readonly: RW = RW.Editable,
): CsSelectBoxItem {
    return useCsItem(CsSelectBoxItem, label, state, valOpt, selOpt, readonly);
}

export function useCsRadioBoxItem(label: string,
    state: [val: string, setVal: Dispatch<SetStateAction<string>>],
    valOpt: ValidateOption<string>, selOpt: SelectOptions | SelectOptionStrings | undefined,
    readonly: RW = RW.Editable,
): CsRadioBoxItem {
    return useCsItem(CsRadioBoxItem, label, state, valOpt, selOpt, readonly);
}
