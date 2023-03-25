import dayjs from "dayjs";
import { useMemo, useState } from "react";
import { CsInputTextItem } from "../../framework/logics";
import { CsInputNumberItem, CsCheckBoxItem, CsInputPassword, CsRadioBoxItem, CsSelectBoxItem, CsTextAreaItem } from "../../framework/logics";
import { useCsInputDateItem, useCsInputNumberRangeItem, useRangeInit } from "../../framework/logics";
import {
  stringRule, RW, useCsInputTextItem, useCsSelectBoxItem,
  useCsCheckBoxItem, numberRule, useCsInputNumberItem,
  useCsRadioBoxItem, useCsTextAreaItem, selectOptionStrings,
  useCsMultiCheckBoxItem, useCsInputPassword, stringArrayRule, useInit
} from "../../framework/logics";
import { CsMultiCheckBoxItem } from "../../framework/logics";
import { CsInputDateItem, CsInputNumberRangeItem } from "../../framework/logics";
import { CsRIView, CsZodView, useCsRIView, useCsZodView } from "../../framework/logics";

export default interface TestView extends CsRIView {
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
  console.log("call useTestView")
  const view = useCsRIView<TestView>({
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

export interface TestZodView extends CsZodView {
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
  console.log("call useTestZodView")
  const view = useCsZodView<TestZodView>({
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
    birth: useCsInputDateItem("生年月日", useInit(dayjs().toString()), stringRule(true)),
    budget: useCsInputNumberRangeItem("予算範囲", useRangeInit<number>(), numberRule(false, 1, 10)),
    other1: useCsInputTextItem("ほか１", useInit("ほか１"), stringRule(false, 1, 10)),
    other2: useCsInputTextItem("ほか２", useInit("ほか２"), stringRule(false, 1, 10)),
    other3: useCsInputTextItem("ほか３", useInit("ほか３"), stringRule(false, 1, 10)),
    otherA: useCsInputTextItem("ほか亜", useInit("ほかあ"), stringRule(false, 1, 10), RW.Readonly),
    readonly: false,
  })
  return view
}


