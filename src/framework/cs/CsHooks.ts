import { Dispatch, SetStateAction } from "react"

import { BooleanValidateOption, CsCheckBoxItem, CsHasOptionsItem, CsInputNumberItem, CsInputTextItem, CsItem, CsMultiCheckBoxItem, CsPasswordItem, CsRadioBoxItem, CsSelectBoxItem, CsTextAreaItem, NumberValidateOption, StringArrayValidationOption, StringValidateOption, ValidateOption } from "./CsItem"

export type StateResultOptional<T> = [val: T | undefined, setVal: Dispatch<SetStateAction<T | undefined>>]
export type StateResultRequired<T> = [val: T, setVal: Dispatch<SetStateAction<T>>]
export type StateResult<T> = StateResultRequired<T> | StateResultOptional<T>


export function strValOpt(required: boolean, min?: number, max?: number, email?: boolean, regExp?: string) {
    const valOpt = new StringValidateOption()
    valOpt.setRequired(required)
    if (min && max) valOpt.setLength(min, max)
    if (email) valOpt.setEmail(true)
    if (regExp) valOpt.setRegExp(regExp)
    return valOpt
}

export function numValOpt(required: boolean, min?: number, max?: number) {
    const valOpt = new NumberValidateOption()
    valOpt.setRequired(required)
    if (min && max) valOpt.setRange(min, max)
    return valOpt
}

export function boolValOpt(required: boolean): ValidateOption<boolean> {
    return new BooleanValidateOption().setRequired(required)
}

export function strArrValOpt(required: boolean): ValidateOption<string[]> {
    return new StringArrayValidationOption().setRequired(required)
}

class SelectOptions {
    options: any[]
    valueKey: string = "value"
    labelKey: string = "label"
    constructor(options: any[], valueKey: string = "value", labelKey: string = "label") {
        this.options = options
        this.valueKey = valueKey
        this.labelKey = labelKey
    }
}
export function selectOpt(options: any[], valueKey: string = "value", labelKey: string = "label")
    : SelectOptions {
    return new SelectOptions(options, valueKey, labelKey)
}

export function selectOptStr(options: string[]) {
    return new SelectOptions(options.map((o) => ({ value: o, label: o })))
}

export enum RW {
    Readonly,
    Editable,
}

export function useCsItem<T, I extends CsItem<T>>(
    type: { new(): I }, label: string,
    state: StateResult<T>,
    valOpt?: ValidateOption<T>,
    selOpt?: SelectOptions | undefined,
    readonly: RW = RW.Editable,
): I {
    const item = new type()
    item.label = label
    item.setState(state)
    if (valOpt) item.setValidateOption(valOpt)
    if (selOpt) {
        if (item instanceof CsHasOptionsItem<T>) {
            const hasOptItem = item as CsHasOptionsItem<T>
            hasOptItem.setOptions(selOpt.options, selOpt.valueKey, selOpt.valueKey)
        }
    }
    item.readonly = (readonly === RW.Readonly)
    return item
}

export function useCsInputTextItem(label: string,
    state: StateResult<string>,
    valOpt: StringValidateOption,
    readonly: RW = RW.Editable,
): CsInputTextItem {
    return useCsItem(CsInputTextItem, label, state, valOpt, undefined, readonly);
}

export function useCsInputNumberItem(label: string,
    state: StateResult<number>,
    valOpt: NumberValidateOption,
    readonly: RW = RW.Editable,
): CsInputNumberItem {
    return useCsItem(CsInputNumberItem, label, state, valOpt, undefined, readonly);
}

export function useCsPasswordItem(label: string,
    state: StateResult<string>,
    valOpt: StringValidateOption,
    readonly: RW = RW.Editable,
): CsPasswordItem {
    return useCsItem(CsPasswordItem, label, state, valOpt, undefined, readonly);
}

export function useCsTextAreaItem(label: string,
    state: StateResult<string>,
    valOpt: StringValidateOption,
    readonly: RW = RW.Editable,
): CsTextAreaItem {
    return useCsItem(CsTextAreaItem, label, state, valOpt, undefined, readonly);
}

export function useCsCheckBoxItem(label: string,
    state: StateResult<boolean>,
    checkBoxText: string, readonly: RW = RW.Editable,
): CsCheckBoxItem {
    const item = useCsItem(CsCheckBoxItem, label, state, undefined, undefined, readonly);
    item.setCheckBoxText(checkBoxText)
    return item
}

export function useCsSelectBoxItem(label: string,
    state: StateResult<string>,
    valOpt: StringValidateOption, selOpt: SelectOptions | undefined,
    readonly: RW = RW.Editable,
): CsSelectBoxItem {
    return useCsItem(CsSelectBoxItem, label, state, valOpt, selOpt, readonly);
}

export function useCsRadioBoxItem(label: string,
    state: StateResult<string>,
    valOpt: StringValidateOption, selOpt: SelectOptions | undefined,
    readonly: RW = RW.Editable,
): CsRadioBoxItem {
    return useCsItem(CsRadioBoxItem, label, state, valOpt, selOpt, readonly);
}

export function useCsMultiCheckBoxItem(label: string,
    state: StateResult<string[]>,
    valOpt: StringArrayValidationOption,
    selOpt: SelectOptions | undefined,
    readonly: RW = RW.Editable,
): CsMultiCheckBoxItem {
    return useCsItem(CsMultiCheckBoxItem, label, state, valOpt, selOpt, readonly);
}
