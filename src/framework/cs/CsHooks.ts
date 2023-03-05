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

class SelectOptions { options: any[] = []; valueKey: string = ""; labelKey: string = "" }
class SelectOptionStrings { options: string[] = [] }


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
    item.setState(state)
    item.setValidateOption(valOpt)
    if (selOpt) {
        if (item instanceof CsRadioBoxItem) {
            const radio = item as CsRadioBoxItem
            if (selOpt instanceof SelectOptions) {
                radio.setOptions(selOpt.options, selOpt.valueKey, selOpt.valueKey)
            } else if (selOpt instanceof SelectOptionStrings) {
                radio.setOptionStrings(selOpt.options)
            }
        }
        if (item instanceof CsSelectBoxItem) {
            const select = item as CsSelectBoxItem
            if (selOpt instanceof SelectOptions) {
                select.setOptions(selOpt.options, selOpt.valueKey, selOpt.valueKey)
            } else if (selOpt instanceof SelectOptionStrings) {
                select.setOptionStrings(selOpt.options)
            }
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
