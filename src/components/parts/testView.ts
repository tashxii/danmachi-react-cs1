import {
  stringRule, RW, useCsInputTextItem, useCsSelectBoxItem,
  useCsCheckBoxItem, numberRule, useCsInputNumberItem,
  useCsRadioBoxItem, useCsTextAreaItem, selectOptionStrings,
  useCsMultiCheckBoxItem, useCsInputPassword, stringArrayRule,
  CsInputNumberItem, CsCheckBoxItem, CsInputPasswordItem,
  CsRadioBoxItem, CsSelectBoxItem, CsTextAreaItem,
  useCsInputDateItem, useCsInputNumberRangeItem, useRangeInit,
  useInit, CsInputTextItem, useCsZodValidationEvent, useCsYupValidationEvent
} from "../../framework/logics";
import { CsMultiCheckBoxItem } from "../../framework/logics";
import { CsInputDateItem, CsInputNumberRangeItem } from "../../framework/logics";
import { CsView, useCsView } from "../../framework/logics";

export default interface TestView extends CsView {
  nameItem: CsInputTextItem
  password: CsInputPasswordItem
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
  })
  return view
}

export interface TestZodView extends CsView {
  znameItem: CsInputTextItem
  zpassword: CsInputPasswordItem
  zadminCheck: CsCheckBoxItem
  zgenderSelect: CsSelectBoxItem
  zcontactWay: CsRadioBoxItem
  zage: CsInputNumberItem
  zsnsWay: CsMultiCheckBoxItem
  zmemo: CsTextAreaItem
  zbirth: CsInputDateItem
  zbudget: CsInputNumberRangeItem
  zother1: CsInputTextItem
  zother2: CsInputTextItem
  zother3: CsInputTextItem
  zotherA: CsInputTextItem
}

export function useTestZodView(): TestZodView {
  const view = useCsView<TestZodView>({
    znameItem: useCsInputTextItem("名前", useInit(""), stringRule(true, 3, 30)),
    zpassword: useCsInputPassword("パスワード", useInit(""), stringRule(true, 8, 16)),
    zadminCheck: useCsCheckBoxItem("管理者権限", useInit(false), "付与する"),
    zgenderSelect: useCsSelectBoxItem("性別", useInit(""), stringRule(true),
      selectOptionStrings(["男性", "女性", "未回答"])),
    zcontactWay: useCsRadioBoxItem("連絡方法", useInit(""), stringRule(true),
      selectOptionStrings(["メール", "電話", "訪問"])),
    zage: useCsInputNumberItem("年齢", useInit(), numberRule(true, 18, 70)),
    zmemo: useCsTextAreaItem("メモ", useInit(""), stringRule(true, 1, 4000)),
    zsnsWay: useCsMultiCheckBoxItem("SNS連絡手段", useInit(["SMS", "Twitter"]), stringArrayRule(true),
      selectOptionStrings(["SMS", "Line", "Twitter", "Facebook"])),
    zbirth: useCsInputDateItem("生年月日", useInit(), stringRule(true)),
    zbudget: useCsInputNumberRangeItem("予算範囲", useRangeInit<number>(), numberRule(false, 1, 10)),
    zother1: useCsInputTextItem("ほか１", useInit("ほか１"), stringRule(false, 1, 10)),
    zother2: useCsInputTextItem("ほか２", useInit("ほか２"), stringRule(false, 1, 10)),
    zother3: useCsInputTextItem("ほか３", useInit("ほか３"), stringRule(false, 1, 10)),
    zotherA: useCsInputTextItem("ほか亜", useInit("ほかあ"), stringRule(false, 1, 10), RW.Readonly),
  }, useCsZodValidationEvent)
  return view
}

export interface TestYupView extends CsView {
  ynameItem: CsInputTextItem
  ypassword: CsInputPasswordItem
  yadminCheck: CsCheckBoxItem
  ygenderSelect: CsSelectBoxItem
  ycontactWay: CsRadioBoxItem
  yage: CsInputNumberItem
  ysnsWay: CsMultiCheckBoxItem
  ymemo: CsTextAreaItem
  ybirth: CsInputDateItem
  ybudget: CsInputNumberRangeItem
  yother1: CsInputTextItem
  yother2: CsInputTextItem
  yother3: CsInputTextItem
  yotherA: CsInputTextItem
}

export function useTestYupView(): TestYupView {
  const view = useCsView<TestYupView>({
    ynameItem: useCsInputTextItem("名前", useInit(""), stringRule(true, 3, 30)),
    ypassword: useCsInputPassword("パスワード", useInit(""), stringRule(true, 8, 16)),
    yadminCheck: useCsCheckBoxItem("管理者権限", useInit(false), "付与する"),
    ygenderSelect: useCsSelectBoxItem("性別", useInit(""), stringRule(true),
      selectOptionStrings(["男性", "女性", "未回答"])),
    ycontactWay: useCsRadioBoxItem("連絡方法", useInit(""), stringRule(true),
      selectOptionStrings(["メール", "電話", "訪問"])),
    yage: useCsInputNumberItem("年齢", useInit(), numberRule(true, 18, 70)),
    ymemo: useCsTextAreaItem("メモ", useInit(""), stringRule(true, 1, 4000)),
    ysnsWay: useCsMultiCheckBoxItem("SNS連絡手段", useInit(["SMS", "Twitter"]), stringArrayRule(true),
      selectOptionStrings(["SMS", "Line", "Twitter", "Facebook"])),
    ybirth: useCsInputDateItem("生年月日", useInit(), stringRule(true)),
    ybudget: useCsInputNumberRangeItem("予算範囲", useRangeInit<number>(), numberRule(false, 1, 10)),
    yother1: useCsInputTextItem("ほか１", useInit("ほか１"), stringRule(false, 1, 10)),
    yother2: useCsInputTextItem("ほか２", useInit("ほか２"), stringRule(false, 1, 10)),
    yother3: useCsInputTextItem("ほか３", useInit("ほか３"), stringRule(false, 1, 10)),
    yotherA: useCsInputTextItem("ほか亜", useInit("ほかあ"), stringRule(false, 1, 10), RW.Readonly),
  }, useCsYupValidationEvent)
  return view
}

