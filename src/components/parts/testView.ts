import {
  stringRule, RW, useCsInputTextItem, useCsSelectBoxItem,
  useCsCheckBoxItem, numberRule, useCsInputNumberItem,
  useCsRadioBoxItem, useCsTextAreaItem, selectOptionStrings,
  useCsMultiCheckBoxItem, useCsInputPassword, stringArrayRule,
  CsInputNumberItem, CsCheckBoxItem, CsInputPassword,
  CsRadioBoxItem, CsSelectBoxItem, CsTextAreaItem,
  useCsInputDateItem, useCsInputNumberRangeItem, useRangeInit,
  useInit, CsInputTextItem, useCsRIValidationEvent, useCsZodValidationEvent
} from "../../framework/logics";
import { CsMultiCheckBoxItem } from "../../framework/logics";
import { CsInputDateItem, CsInputNumberRangeItem } from "../../framework/logics";
import { CsView, useCsView } from "../../framework/logics";

export default interface TestView extends CsView {
  nameItem: CsInputTextItem
  password: CsInputPassword
  adminCheck: CsCheckBoxItem
  genderSelect: CsSelectBoxItem
  contactWay: CsRadioBoxItem
  age: CsInputNumberItem
  snsWay: CsMultiCheckBoxItem
  memo: CsTextAreaItem
  birth: CsInputDateItem
  budget: CsInputNumberRangeItem
  other1: CsInputTextItem
  other2: CsInputTextItem
  other3: CsInputTextItem
  otherA: CsInputTextItem
}

export function useTestView(): TestView {
  const view = useCsView<TestView>({
    nameItem: useCsInputTextItem("名前", useInit(""), stringRule(true, 3, 30)),
    password: useCsInputPassword("パスワード", useInit(""), stringRule(true, 8, 16)),
    adminCheck: useCsCheckBoxItem("管理者権限", useInit(false), "付与する"),
    genderSelect: useCsSelectBoxItem("性別", useInit(""), stringRule(true),
      selectOptionStrings(["男性", "女性", "未回答"])),
    contactWay: useCsRadioBoxItem("連絡方法", useInit(""), stringRule(true),
      selectOptionStrings(["メール", "電話", "訪問"])),
    age: useCsInputNumberItem("年齢", useInit(), numberRule(true, 18, 70)),
    memo: useCsTextAreaItem("メモ", useInit(""), stringRule(true, 1, 4000)),
    snsWay: useCsMultiCheckBoxItem("SNS連絡手段", useInit(["SMS", "Twitter"]), stringArrayRule(true),
      selectOptionStrings(["SMS", "Line", "Twitter", "Facebook"])),
    birth: useCsInputDateItem("生年月日", useInit(), stringRule(true)),
    budget: useCsInputNumberRangeItem("予算範囲", useRangeInit<number>(), numberRule(false, 1, 10)),
    other1: useCsInputTextItem("ほか１", useInit("ほか１"), stringRule(false, 1, 10)),
    other2: useCsInputTextItem("ほか２", useInit("ほか２"), stringRule(false, 1, 10)),
    other3: useCsInputTextItem("ほか３", useInit("ほか３"), stringRule(false, 1, 10)),
    otherA: useCsInputTextItem("ほか亜", useInit("ほかあ"), stringRule(false, 1, 10), RW.Readonly),
    readonly: false,
  })
  return view
}

export interface TestZodView extends CsView {
  nameItem: CsInputTextItem
  password: CsInputPassword
  adminCheck: CsCheckBoxItem
  genderSelect: CsSelectBoxItem
  contactWay: CsRadioBoxItem
  age: CsInputNumberItem
  snsWay: CsMultiCheckBoxItem
  memo: CsTextAreaItem
  birth: CsInputDateItem
  budget: CsInputNumberRangeItem
  other1: CsInputTextItem
  other2: CsInputTextItem
  other3: CsInputTextItem
  otherA: CsInputTextItem
}

export function useTestZodView(): TestZodView {
  const view = useCsView<TestZodView>({
    nameItem: useCsInputTextItem("名前", useInit(""), stringRule(true, 3, 30)),
    password: useCsInputPassword("パスワード", useInit(""), stringRule(true, 8, 16)),
    adminCheck: useCsCheckBoxItem("管理者権限", useInit(false), "付与する"),
    genderSelect: useCsSelectBoxItem("性別", useInit(""), stringRule(true),
      selectOptionStrings(["男性", "女性", "未回答"])),
    contactWay: useCsRadioBoxItem("連絡方法", useInit(""), stringRule(true),
      selectOptionStrings(["メール", "電話", "訪問"])),
    age: useCsInputNumberItem("年齢", useInit(), numberRule(true, 18, 70)),
    memo: useCsTextAreaItem("メモ", useInit(""), stringRule(true, 1, 4000)),
    snsWay: useCsMultiCheckBoxItem("SNS連絡手段", useInit(["SMS", "Twitter"]), stringArrayRule(true),
      selectOptionStrings(["SMS", "Line", "Twitter", "Facebook"])),
    birth: useCsInputDateItem("生年月日", useInit(), stringRule(true)),
    budget: useCsInputNumberRangeItem("予算範囲", useRangeInit<number>(), numberRule(false, 1, 10)),
    other1: useCsInputTextItem("ほか１", useInit("ほか１"), stringRule(false, 1, 10)),
    other2: useCsInputTextItem("ほか２", useInit("ほか２"), stringRule(false, 1, 10)),
    other3: useCsInputTextItem("ほか３", useInit("ほか３"), stringRule(false, 1, 10)),
    otherA: useCsInputTextItem("ほか亜", useInit("ほかあ"), stringRule(false, 1, 10), RW.Readonly),
    readonly: false,
  }, useCsZodValidationEvent)
  return view
}


