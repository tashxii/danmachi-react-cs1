import React, { useState } from "react";
import { useMutation } from "react-query";
import { CsItemBase, CsInputTextItem, CsView } from "../../framework/cs";
import { CsInputNumberItem, CsCheckBoxItem, CsPasswordItem, CsRadioBoxItem, CsSelectBoxItem, CsTextAreaItem } from "../../framework/cs";
import { CsButtonClickEvent, useCsButtonClickEvent } from "../../framework/cs/CsEvent";
import { strValOpt, RW, useCsInputTextItem, useCsSelectBoxItem, useCsCheckBoxItem, numValOpt, useCsInputNumberItem, useCsRadioBoxItem, useCsTextAreaItem, selectOpt, selectOptStr, useCsMultiCheckBoxItem, useCsPasswordItem, strArrValOpt } from "../../framework/cs/CsHooks";
import { CsMultiCheckBoxItem } from "../../framework/cs/CsItem";
import { useCsView } from "../../framework/cs/CsView";

export interface DummyApiRequest { id: number, name: string }
export const dummyApiCall = async (request: DummyApiRequest) => {
    return new Promise((resolve, reject) => {
        setTimeout(
            () => {
                const rand = Math.random()
                console.log(rand)
                if (rand > 0.3) {
                    resolve([{ id: 1, name: "aaa" }, { id: 2, name: "bbb" }, request])
                } else {
                    reject("3割の確立で失敗しました")
                }
            }, 1334) // wait a litle while
    })
}
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
    other6: CsInputTextItem
    other7: CsInputTextItem
    other8: CsInputTextItem
    other9: CsInputTextItem
    otherA: CsInputTextItem
    onTestButtonClick: CsButtonClickEvent<unknown>
}

export function useTestView(): TestView {
    const testView: TestView = {
        nameItem: useCsInputTextItem("名前", useState(""), strValOpt(true, 1, 30)),
        password: useCsPasswordItem("パスワード", useState(""), strValOpt(true, 1, 16)),
        adminCheck: useCsCheckBoxItem("管理者権限", useState(false), "付与する"),
        genderSelect: useCsSelectBoxItem("性別", useState(""), strValOpt(true), selectOptStr(["男性", "女性", "未回答"])),
        contactWay: useCsRadioBoxItem("連絡方法", useState(""), strValOpt(true), selectOptStr(["メール", "電話", "訪問"])),
        age: useCsInputNumberItem("年齢", useState(20), numValOpt(true, 18, 70)),
        memo: useCsTextAreaItem("メモ", useState(""), strValOpt(true, 1, 4000)),
        snsWay: useCsMultiCheckBoxItem("SNS連絡手段", useState(["SMS", "Twitter"]), strArrValOpt(true),
            selectOptStr(["SMS", "Line", "Twitter", "Facebook"])),
        other1: useCsInputTextItem("ほか１", useState("ほか１"), strValOpt(false, 1, 10)),
        other2: useCsInputTextItem("ほか２", useState("ほか２"), strValOpt(false, 1, 10)),
        other3: useCsInputTextItem("ほか３", useState("ほか３"), strValOpt(false, 1, 10)),
        other4: useCsInputTextItem("ほか４", useState("ほか４"), strValOpt(false, 1, 10)),
        other5: useCsInputTextItem("ほか５", useState("ほか５"), strValOpt(false, 1, 10)),
        other6: useCsInputTextItem("ほか６", useState("ほか６"), strValOpt(false, 1, 10)),
        other7: useCsInputTextItem("ほか７", useState("ほか７"), strValOpt(false, 1, 10)),
        other8: useCsInputTextItem("ほか８", useState("ほか８"), strValOpt(false, 1, 10)),
        other9: useCsInputTextItem("ほか９", useState("ほか９"), strValOpt(false, 1, 10), RW.Editable),
        otherA: useCsInputTextItem("ほか亜", useState("ほかあ"), strValOpt(false, 1, 10), RW.Readonly),
        onTestButtonClick: useCsButtonClickEvent(useMutation("dummyApiCall", dummyApiCall)),
        readonly: false,
    }
    const view = useCsView<TestView>(
        testView
    )
    return view
}

export type TestViewItems = Extract<TestView, CsItemBase>
