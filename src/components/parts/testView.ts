import { useState } from "react";
import { CsItemBase, CsInputTextItem, CsView } from "../../framework/cs";
import { CsInputNumberItem, CsCheckBoxItem, CsPasswordItem, CsRadioBoxItem, CsSelectBoxItem, CsTextAreaItem } from "../../framework/cs";
import {
  stringRule, RW, useCsInputTextItem, useCsSelectBoxItem,
  useCsCheckBoxItem, numberRule, useCsInputNumberItem,
  useCsRadioBoxItem, useCsTextAreaItem, optionStrings,
  useCsMultiCheckBoxItem, useCsPasswordItem, stringArrayRule
} from "../../framework/cs/CsHooks";
import { CsMultiCheckBoxItem } from "../../framework/cs/CsItem";
import { useCsView } from "../../framework/cs/CsView";

export default interface TestView extends CsView {
  nameItem: CsInputTextItem
  password: CsPasswordItem
  adminCheck: CsCheckBoxItem
  genderSelect: CsSelectBoxItem
  contactWay: CsRadioBoxItem
  age: CsInputNumberItem
  snsWay: CsMultiCheckBoxItem
  memo: CsTextAreaItem
  other1: CsInputTextItem
  other2: CsInputTextItem
  other3: CsInputTextItem
  other4: CsInputTextItem
  other5: CsInputTextItem
  otherA: CsInputTextItem
}

export function useTestView(): TestView {
  const view = useCsView<TestView>({
    nameItem: useCsInputTextItem("名前", useState(), stringRule(true, 3, 30)),
    password: useCsPasswordItem("パスワード", useState(""), stringRule(true, 8, 16)),
    adminCheck: useCsCheckBoxItem("管理者権限", useState(), "付与する"),
    genderSelect: useCsSelectBoxItem("性別", useState(), stringRule(true, 0, 1),
      optionStrings(["男性", "女性", "未回答"])),
    contactWay: useCsRadioBoxItem("連絡方法", useState(), stringRule(true, 0, 1),
      optionStrings(["メール", "電話", "訪問"])),
    age: useCsInputNumberItem("年齢", useState(20), numberRule(true, 18, 70)),
    memo: useCsTextAreaItem("メモ", useState(""), stringRule(true, 1, 4000)),
    snsWay: useCsMultiCheckBoxItem("SNS連絡手段", useState(["SMS", "Twitter"]), stringArrayRule(true),
      optionStrings(["SMS", "Line", "Twitter", "Facebook"])),
    other1: useCsInputTextItem("ほか１", useState("ほか１"), stringRule(false, 1, 10)),
    other2: useCsInputTextItem("ほか２", useState("ほか２"), stringRule(false, 1, 10)),
    other3: useCsInputTextItem("ほか３", useState("ほか３"), stringRule(false, 1, 10)),
    other4: useCsInputTextItem("ほか４", useState("ほか４"), stringRule(false, 1, 10)),
    other5: useCsInputTextItem("ほか５", useState("ほか５"), stringRule(false, 1, 10)),
    otherA: useCsInputTextItem("ほか亜", useState("ほかあ"), stringRule(false, 1, 10), RW.Readonly),
    readonly: false,
  })
  return view
}

export type TestViewItems = Extract<TestView, CsItemBase>


