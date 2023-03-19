import { Dispatch, SetStateAction } from "react"

import { BooleanValidationRule, CsCheckBoxItem, CsHasOptionsItem, CsInputNumberItem, CsInputTextItem, CsItem, CsMultiCheckBoxItem, CsInputPassword, CsRadioBoxItem, CsSelectBoxItem, CsSelectNumberBoxItem, CsTextAreaItem, NumberValidationRule, StringArrayValidationRule, StringValidationRule, ValidationRule } from "./CsItem"

export type StateResultOptional<T> = [val: T | undefined, setVal: Dispatch<SetStateAction<T | undefined>>]
export type StateResultRequired<T> = [val: T, setVal: Dispatch<SetStateAction<T>>]
export type StateResult<T> = StateResultRequired<T> | StateResultOptional<T>


export function stringRule(required: boolean, min?: number, max?: number, email?: boolean, regExp?: string) {
  const rule = new StringValidationRule()
  rule.setRequired(required)
  if (min && max) rule.setLength(min, max)
  if (email) rule.setEmail(true)
  if (regExp) rule.setRegExp(regExp)
  return rule
}

export function numberRule(required: boolean, min?: number, max?: number) {
  const rule = new NumberValidationRule()
  rule.setRequired(required)
  if (min && max) rule.setRange(min, max)
  return rule
}

export function stringArrayRule(required: boolean) {
  const rule = new StringArrayValidationRule()
  rule.setRequired(required)
  return rule
}

export function booleanRule(required: boolean) {
  return new BooleanValidationRule().setRequired(required)
}

class SelectOptions {
  options: any[]
  optionValueKey: string = "value"
  optionLabelKey: string = "label"
  constructor(options: any[], optionValueKey: string = "value", optionLabelKey: string = "label") {
    this.options = options
    this.optionValueKey = optionValueKey
    this.optionLabelKey = optionLabelKey
  }
}

export function options(options: any[], optionValueKey: string = "value", optionLabelKey: string = "label")
  : SelectOptions {
  return new SelectOptions(options, optionValueKey, optionLabelKey)
}

export function optionStrings(options: string[]) {
  return new SelectOptions(options.map((o) => ({ value: o, label: o })))
}

export function optionNumbers(options: number[]) {
  return new SelectOptions(options.map((o) => ({ value: o, label: o })))
}

export enum RW {
  Readonly,
  Editable,
}

export function useCsItem<T, I extends CsItem<T>>(
  type: { new(): I }, label: string,
  state: StateResult<T>,
  rule?: ValidationRule<T>,
  selOpt?: SelectOptions | undefined,
  readonly: RW = RW.Editable,
): I {
  const item = new type()
  item.label = label
  item.setState(state)
  if (rule) item.setValidationRule(rule)
  if (selOpt) {
    if (item instanceof CsHasOptionsItem<T>) {
      const hasOptItem = item as CsHasOptionsItem<T>
      hasOptItem.setOptions(selOpt.options, selOpt.optionValueKey, selOpt.optionLabelKey)
    }
  }
  item.setReadonly((readonly === RW.Readonly))
  return item
}

export function useCsInputTextItem(label: string,
  state: StateResult<string>,
  rule: StringValidationRule,
  readonly: RW = RW.Editable,
): CsInputTextItem {
  return useCsItem(CsInputTextItem, label, state, rule, undefined, readonly);
}

export function useCsInputNumberItem(label: string,
  state: StateResult<number>,
  rule: NumberValidationRule,
  readonly: RW = RW.Editable,
): CsInputNumberItem {
  return useCsItem(CsInputNumberItem, label, state, rule, undefined, readonly);
}

export function useCsInputPassword(label: string,
  state: StateResult<string>,
  rule: StringValidationRule,
  readonly: RW = RW.Editable,
): CsInputPassword {
  return useCsItem(CsInputPassword, label, state, rule, undefined, readonly);
}

export function useCsTextAreaItem(label: string,
  state: StateResult<string>,
  rule: StringValidationRule,
  readonly: RW = RW.Editable,
): CsTextAreaItem {
  return useCsItem(CsTextAreaItem, label, state, rule, undefined, readonly);
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
  rule: StringValidationRule, selOpt: SelectOptions | undefined,
  readonly: RW = RW.Editable,
): CsSelectBoxItem {
  return useCsItem(CsSelectBoxItem, label, state, rule, selOpt, readonly);
}

export function useCsSelectNumberBoxItem(label: string,
  state: StateResult<number>,
  rule: NumberValidationRule, selOpt: SelectOptions | undefined,
  readonly: RW = RW.Editable,
): CsSelectNumberBoxItem {
  return useCsItem(CsSelectBoxItem<number>, label, state, rule, selOpt, readonly);
}

export function useCsRadioBoxItem(label: string,
  state: StateResult<string>,
  rule: StringValidationRule, selOpt: SelectOptions | undefined,
  readonly: RW = RW.Editable,
): CsRadioBoxItem {
  return useCsItem(CsRadioBoxItem, label, state, rule, selOpt, readonly);
}

export function useCsMultiCheckBoxItem(label: string,
  state: StateResult<string[]>,
  rule: StringArrayValidationRule,
  selOpt: SelectOptions | undefined,
  readonly: RW = RW.Editable,
): CsMultiCheckBoxItem {
  return useCsItem(CsMultiCheckBoxItem, label, state, rule, selOpt, readonly);
}
