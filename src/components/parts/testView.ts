import React, { useState } from "react";
import { CsCallback, CsEffect, CsItemBase, CsInputTextItem, CsView } from "../../framework/cs";
import { CsCheckBoxItem, CsPasswordItem, CsRadioBoxItem, CsSelectBoxItem, CsTextAreaItem } from "../../framework/cs";
import { strValOpt, boolValOpt, RW, useCsInputTextItem, useCsSelectBoxItem, useCsCheckBoxItem, numValOpt, useCsInputNumberItem, useCsRadioBoxItem, useCsTextAreaItem } from "../../framework/cs/CsHooks";
import { CsInputNumberItem } from "../../framework/cs/CsItem";
import { useInitView } from "../../framework/cs/CsView";

export default interface TestView extends CsView {
    nameItem: CsInputTextItem
    password: CsPasswordItem
    adminCheck: CsCheckBoxItem
    genderSelect: CsSelectBoxItem
    contactWay: CsRadioBoxItem
    age: CsInputNumberItem
    memo: CsTextAreaItem
    other1: CsInputTextItem
    other2: CsInputTextItem
    other3: CsInputTextItem
    other4: CsInputTextItem
    other5: CsInputTextItem
    other6: CsInputTextItem
    other7: CsInputTextItem
    other8: CsInputTextItem
    other9: CsInputTextItem
}

export function useTestView(): TestView {
    const testView: TestView = {
        nameItem: useCsInputTextItem("名前", useState(""), strValOpt(true, 1, 30)),
        password: useCsInputTextItem("パスワード", useState(""), strValOpt(true, 1, 16)),
        adminCheck: useCsCheckBoxItem("管理者権限", useState(false), boolValOpt(true)),
        genderSelect: useCsSelectBoxItem("性別", useState("未回答"), strValOpt(true), { options: ["男性", "女性", "未回答"] }),
        contactWay: useCsRadioBoxItem("連絡方法", useState("メール"), strValOpt(true), { options: ["メール", "電話", "訪問"] }),
        age: useCsInputNumberItem("年齢", useState(20), numValOpt(true, 18, 70)),
        memo: useCsTextAreaItem("メモ", useState(""), strValOpt(true, 1, 4000)),
        other1: useCsInputTextItem("ほか１", useState("ほか１"), strValOpt(false, 1, 30)),
        other2: useCsInputTextItem("ほか２", useState("ほか２"), strValOpt(false, 1, 30)),
        other3: useCsInputTextItem("ほか３", useState("ほか３"), strValOpt(false, 1, 30)),
        other4: useCsInputTextItem("ほか４", useState("ほか４"), strValOpt(false, 1, 30)),
        other5: useCsInputTextItem("ほか５", useState("ほか５"), strValOpt(false, 1, 30)),
        other6: useCsInputTextItem("ほか６", useState("ほか６"), strValOpt(false, 1, 30)),
        other7: useCsInputTextItem("ほか７", useState("ほか７"), strValOpt(false, 1, 30)),
        other8: useCsInputTextItem("ほか８", useState("ほか８"), strValOpt(false, 1, 30)),
        other9: useCsInputTextItem("ほか９", useState("ほか９"), strValOpt(false, 1, 30)),
        readonly: false
    }
    const view = useInitView<TestView>(
        testView
    )
    return view
}

export type TestViewItems = Extract<TestView, CsItemBase>
