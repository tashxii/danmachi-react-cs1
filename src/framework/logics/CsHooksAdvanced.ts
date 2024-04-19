import { Dispatch, useState } from "react"
import { StateResult, RW, useCsItem } from "./CsHooks"
import { NumberValidationRule, StringValidationRule } from "./CsItem"
import { CsInputDateItem, CsInputDateRangeItem, CsInputNumberRangeItem } from "./CsItemAdvanced"

export function useRangeInit<T extends number | string>(lower?: T, upper?: T) {
  const state = useState<T[]>([lower as T, upper as T])
  return state as [T[] | undefined, Dispatch<React.SetStateAction<T[] | undefined>>]
}

export function useCsInputDateItem(label: string,
  state: StateResult<string>,
  rule: StringValidationRule,
  readonly: RW = RW.Editable,
): CsInputDateItem {
  return useCsItem(CsInputDateItem, label, state, rule, undefined, readonly)
}

export function useCsInputNumberRangeItem(label: string,
  state: StateResult<number[]>,
  rule: NumberValidationRule,
  readonly: RW = RW.Editable,
): CsInputNumberRangeItem {
  return useCsItem(CsInputNumberRangeItem, label, state, rule, undefined, readonly)
}

export function useCsInputDateRangeItem(label: string,
  state: StateResult<string[]>,
  rule: StringValidationRule,
  readonly: RW = RW.Editable,
): CsInputDateRangeItem {
  return useCsItem(CsInputDateRangeItem, label, state, rule, undefined, readonly)
}
