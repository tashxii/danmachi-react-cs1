import { useState } from "react";
import { CsItemBase, CsInputTextItem, CsView } from "../../framework/cs";
import { CsInputNumberItem, CsCheckBoxItem, CsPasswordItem, CsRadioBoxItem, CsSelectBoxItem, CsTextAreaItem } from "../../framework/cs";
import { strValOpt, RW, useCsInputTextItem, useCsSelectBoxItem, useCsCheckBoxItem, numValOpt, useCsInputNumberItem, useCsRadioBoxItem, useCsTextAreaItem, selectOpt, selectOptStr, useCsMultiCheckBoxItem, useCsPasswordItem, strArrValOpt } from "../../framework/cs/CsHooks";
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
        nameItem: useCsInputTextItem("名前", useState("a"), strValOpt(true, 1, 30)),
        password: useCsPasswordItem("パスワード", useState("a"), strValOpt(true, 1, 16)),
        adminCheck: useCsCheckBoxItem("管理者権限", useState(true), "付与する"),
        genderSelect: useCsSelectBoxItem("性別", useState("男性"), strValOpt(true), selectOptStr(["男性", "女性", "未回答"])),
        contactWay: useCsRadioBoxItem("連絡方法", useState("メール"), strValOpt(true), selectOptStr(["メール", "電話", "訪問"])),
        age: useCsInputNumberItem("年齢", useState(20), numValOpt(true, 18, 70)),
        memo: useCsTextAreaItem("メモ", useState("aaa"), strValOpt(true, 1, 4000)),
        snsWay: useCsMultiCheckBoxItem("SNS連絡手段", useState(["SMS", "Twitter"]), strArrValOpt(true),
            selectOptStr(["SMS", "Line", "Twitter", "Facebook"])),
        other1: useCsInputTextItem("ほか１", useState("ほか１"), strValOpt(false, 1, 10)),
        other2: useCsInputTextItem("ほか２", useState("ほか２"), strValOpt(false, 1, 10)),
        other3: useCsInputTextItem("ほか３", useState("ほか３"), strValOpt(false, 1, 10)),
        other4: useCsInputTextItem("ほか４", useState("ほか４"), strValOpt(false, 1, 10)),
        other5: useCsInputTextItem("ほか５", useState("ほか５"), strValOpt(false, 1, 10)),
        otherA: useCsInputTextItem("ほか亜", useState("ほかあ"), strValOpt(false, 1, 10), RW.Readonly),
        readonly: false,
    })
    return view
}

export type TestViewItems = Extract<TestView, CsItemBase>


