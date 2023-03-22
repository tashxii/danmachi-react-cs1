import { StateResult, RW, useCsItem } from "./CsHooks";
import { StringValidationRule } from "./CsItem";
import { CsInputDateItem } from "./CsItemAdvanced";

export function useCsInputDateItem(label: string,
  state: StateResult<string>,
  rule: StringValidationRule,
  readonly: RW = RW.Editable,
): CsInputDateItem {
  return useCsItem(CsInputDateItem, label, state, rule, undefined, readonly);
}