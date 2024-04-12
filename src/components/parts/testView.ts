import {
  stringRule, RW, useCsInputTextItem, useCsSelectBoxItem,
  useCsCheckBoxItem, numberRule, useCsInputNumberItem,
  useCsRadioBoxItem, useCsTextAreaItem, selectOptionStrings,
  useCsMultiCheckBoxItem, useCsInputPasswordItem, stringArrayRule,
  CsInputNumberItem, CsCheckBoxItem, CsInputPasswordItem,
  CsRadioBoxItem, CsSelectBoxItem, CsTextAreaItem,
  useCsInputDateItem, useCsInputNumberRangeItem, useRangeInit,
  useInit, CsInputTextItem, useCsZodValidationEvent, useCsRIValidationEvent, CustomValidationRules, customValidationRule, createRegExpValidator
} from "../../framework/logics";
import { CsMultiCheckBoxItem } from "../../framework/logics";
import { CsInputDateItem, CsInputNumberRangeItem } from "../../framework/logics";
import { CsView, useCsView } from "../../framework/logics";

export type TestView = CsView & {
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

const globalValidationRules: CustomValidationRules = {
  // regular expression
  nameRule: customValidationRule<string>(
    createRegExpValidator(/^[A-Za-z ]*$/),
    (label) => `${label}は、アルファベットと空白のみ使用可能です。`
  ),
  // complex logic
  passwordRule: customValidationRule<string>(
    (newValue, item) => {
      if (!newValue) {
        return true;
      }
      let count = 0;
      if (/[A-Z]/.test(newValue)) {
        count++;
      }
      if (/[a-z]/.test(newValue)) {
        count++;
      }
      if (/[0-9]/.test(newValue)) {
        count++;
      }
      if (/[!-)+-/:-@[-`{-~]/.test(newValue)) {
        count++;
      }
      return count >= 4;
    },
    (label, newValue, item) => {
      let requireds = ["大文字", "小文字", "数字", "記号"]
      if (/[A-Z]/.test(newValue)) {
        requireds = requireds.filter(e => "大文字" !== e);
      }
      if (/[a-z]/.test(newValue)) {
        requireds = requireds.filter(e => "小文字" !== e);
      }
      if (/[0-9]/.test(newValue)) {
        requireds = requireds.filter(e => "数字" !== e);
      }
      if (/[!-)+-/:-@[-`{-~]/.test(newValue)) {
        requireds = requireds.filter(e => "記号" !== e);
      }
      return `${label}は、${requireds.join("、")}を含めてください`
    }
  ),
}

const testViewValidationRules = {
  // between multiple items
  budgetRule: customValidationRule<number>(
    (_, item) => {
      const view = item.parentView as TestView
      const min = (view.age.value ?? 0) * 1000;
      const range = view.budget.value
      return (range ? range[0] : 0) >= min
    },
    (label, newValue, item) => {
      const view = item.parentView as TestView
      const min = (view.age.value ?? 0) * 1000
      return `予算の最低額は年齢によります。最低${min}です。`
    }
  )
}

export function useTestView(validationTrigger: "onSubmit" | "onBlur"): TestView {
  const view = useCsView({
    nameItem: useCsInputTextItem("名前", useInit(""), stringRule(true, 3, 30, "nameRule")),
    password: useCsInputPasswordItem("パスワード", useInit(""), stringRule(true, 8, 16, "passwordRule")),
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
    budget: useCsInputNumberRangeItem("予算範囲", useRangeInit<number>(), numberRule(false, 1, 100000, "budgetRule")),
    other1: useCsInputTextItem("ほか１", useInit("ほか１"), stringRule(false, 1, 10)),
    other2: useCsInputTextItem("ほか２", useInit("ほか２"), stringRule(false, 1, 10)),
    other3: useCsInputTextItem("ほか３", useInit("ほか３"), stringRule(false, 1, 10)),
    otherA: useCsInputTextItem("ほか亜", useInit("ほかあ"), stringRule(false, 1, 10), RW.Readonly),
  },
    {
      customValidationRules: {
        ...globalValidationRules,
        ...testViewValidationRules
      },
      validationTrigger: validationTrigger,
    },
    useCsRIValidationEvent)
  return view
}

export type TestZodView = CsView & {
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

const testZodViewValidationRules = {
  budgetRule: customValidationRule<number>(
    (_, item) => {
      console.log(item)
      const view = item.parentView as TestZodView
      const min = (view.zage.value ?? 0) * 1000;
      const range = view.zbudget.value
      return (range ? range[0] : 0) >= min
    },
    (label, newValue, item) => {
      const view = item.parentView as TestZodView
      const min = (view.zage.value ?? 0) * 1000
      return `予算の最低額は年齢によります。最低${min}です。`
    }
  )
}
export function useTestZodView(validationTrigger: "onSubmit" | "onBlur"): TestZodView {
  const view = useCsView({
    znameItem: useCsInputTextItem("名前", useInit(""), stringRule(true, 3, 30, "nameRule")),
    zpassword: useCsInputPasswordItem("パスワード", useInit(""), stringRule(true, 8, 16, "passwordRule")),
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
    zbudget: useCsInputNumberRangeItem("予算範囲", useRangeInit<number>(), numberRule(false, 1, 100000, "budgetRule")),
    zother1: useCsInputTextItem("ほか１", useInit("ほか１"), stringRule(false, 1, 10)),
    zother2: useCsInputTextItem("ほか２", useInit("ほか２"), stringRule(false, 1, 10)),
    zother3: useCsInputTextItem("ほか３", useInit("ほか３"), stringRule(false, 1, 10)),
    zotherA: useCsInputTextItem("ほか亜", useInit("ほかあ"), stringRule(false, 1, 10), RW.Readonly),
  },
    {
      customValidationRules: {
        ...globalValidationRules,
        ...testZodViewValidationRules
      },
      validationTrigger,
    },
    useCsZodValidationEvent)
  return view
}

export type TestYupView = CsView & {
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

const testYupViewValidationRules = {
  budgetRule: customValidationRule<number>(
    (_, item) => {
      console.log(item)
      const view = item.parentView as TestYupView
      const min = (view.yage.value ?? 0) * 1000;
      const range = view.ybudget.value
      console.log(view)
      console.log(range)
      return (range ? range[0] : 0) >= min
    },
    (label, newValue, item) => {
      const view = item.parentView as TestYupView
      const min = (view.yage.value ?? 0) * 1000
      return `予算の最低額は年齢によります。最低${min}です。`
    }
  )
}

export function useTestYupView(validationTrigger: "onSubmit" | "onBlur"): TestYupView {
  const view = useCsView({
    ynameItem: useCsInputTextItem("名前", useInit(""), stringRule(true, 3, 30, "nameRule")),
    ypassword: useCsInputPasswordItem("パスワード", useInit(""), stringRule(true, 8, 16, "passwordRule")),
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
    ybudget: useCsInputNumberRangeItem("予算範囲", useRangeInit<number>(), numberRule(false, 1, 100000, "budgetRule")),
    yother1: useCsInputTextItem("ほか１", useInit("ほか１"), stringRule(false, 1, 10)),
    yother2: useCsInputTextItem("ほか２", useInit("ほか２"), stringRule(false, 1, 10)),
    yother3: useCsInputTextItem("ほか３", useInit("ほか３"), stringRule(false, 1, 10)),
    yotherA: useCsInputTextItem("ほか亜", useInit("ほかあ"), stringRule(false, 1, 10), RW.Readonly),
  }, {
    customValidationRules: {
      ...globalValidationRules,
      ...testYupViewValidationRules
    },
    validationTrigger,
  },
  )
  return view
}

