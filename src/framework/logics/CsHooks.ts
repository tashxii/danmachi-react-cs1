import { Dispatch, SetStateAction, useState } from "react"

import { BooleanValidationRule, CsCheckBoxItem, CsHasOptionsItem, CsInputNumberItem, CsInputTextItem, CsItem, CsMultiCheckBoxItem, CsInputPasswordItem, CsRadioBoxItem, CsSelectBoxItem, CsSelectNumberBoxItem, CsTextAreaItem, NumberValidationRule, StringArrayValidationRule, StringValidationRule, ValidationRule, NumberArrayValidationRule } from "./CsItem"

export type StateResultOptional<T> = [val: T | undefined, setVal: Dispatch<SetStateAction<T | undefined>>]
export type StateResultRequired<T> = [val: T, setVal: Dispatch<SetStateAction<T>>]
export type StateResult<T> = StateResultOptional<T>

export function useInit<T>(value?: T) {
  const state = useState<T | undefined>(value)
  return state
}

export function stringRule(required: boolean, min?: number, max?: number, customRuleName?: string) {
  const rule = new StringValidationRule()
  rule.setRequired(required)
  if (min || max) rule.setLength(min, max)
  if (customRuleName) rule.setCustomRuleName(customRuleName)
  return rule
}

export function numberRule(required: boolean, min?: number, max?: number, customRuleName?: string) {
  const rule = new NumberValidationRule()
  rule.setRequired(required)
  if (min || max) rule.setRange(min, max)
  if (customRuleName) rule.setCustomRuleName(customRuleName)
  return rule
}

export function stringArrayRule(required: boolean, customRuleName?: string) {
  const rule = new StringArrayValidationRule()
  rule.setRequired(required)
  if (customRuleName) rule.setCustomRuleName(customRuleName)
  return rule
}

export function numberArrayRule(required: boolean, customRuleName?: string) {
  const rule = new NumberArrayValidationRule()
  rule.setRequired(required)
  if (customRuleName) rule.setCustomRuleName(customRuleName)
  return rule
}

export function booleanRule(required: boolean, customRuleName?: string) {
  const rule = new BooleanValidationRule()
  rule.setRequired(required)
  if (customRuleName) rule.setCustomRuleName(customRuleName)
  return rule
}

export class SelectOptions {
  options: any[]
  optionValueKey: string = "value"
  optionLabelKey: string = "label"
  constructor(options: any[], optionValueKey: string = "value", optionLabelKey: string = "label") {
    this.options = options
    this.optionValueKey = optionValueKey
    this.optionLabelKey = optionLabelKey
  }
}

export function selectOptions(options: any[], optionValueKey: string = "value", optionLabelKey: string = "label")
  : SelectOptions {
  return new SelectOptions(options, optionValueKey, optionLabelKey)
}

export function selectOptionStrings(options: string[]) {
  return new SelectOptions(options.map((o) => ({ value: o, label: o })))
}

export function selectOptionNumbers(options: number[]) {
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
  item.setValidation(useState<string>(""))
  if (rule) item.setValidationRule(rule)
  if (selOpt) {
    if (item instanceof CsHasOptionsItem) {
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
): CsInputPasswordItem {
  return useCsItem(CsInputPasswordItem, label, state, rule, undefined, readonly);
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
  return useCsItem(CsSelectNumberBoxItem, label, state, rule, selOpt, readonly);
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
