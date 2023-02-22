import React, { useState } from "react";
import { CsCallback, CsEffect, CsItemBase, CsTextBoxItem, CsView } from "../../framework/cs";
import { CsCheckBoxItem, CsPasswordBoxItem, CsRadioBoxItem, CsSelectBoxItem, CsTextAreaItem } from "../../framework/cs";
import { useInitView } from "../../framework/cs/CsView";

export default class TestView extends CsView {
    name = CsTextBoxItem.Default
    password = CsPasswordBoxItem.Default
    adminCheck = CsCheckBoxItem.Default
    genderSelect = CsSelectBoxItem.Default
    contactWay = CsRadioBoxItem.Default
    memo = CsTextAreaItem.Default
    other1 = CsTextBoxItem.Default
    other2 = CsTextBoxItem.Default
    other3 = CsTextBoxItem.Default
    other4 = CsTextBoxItem.Default
    other5 = CsTextBoxItem.Default
    other6 = CsTextBoxItem.Default
    other7 = CsTextBoxItem.Default
    other8 = CsTextBoxItem.Default
    other9 = CsTextBoxItem.Default
    add = CsTextAreaItem.Default
}

export function useTestView(): TestView {
    const items: TestViewItems = { readonly: false } as TestViewItems
    items.adminCheck = CsCheckBoxItem.New("管理者権限")
        .set(useState<boolean>(false))
    items.contactWay = CsRadioBoxItem.New("連絡方法", ["メール", "電話", "訪問"], "メール")
        .set(useState<string>(""))
    items.name = CsTextBoxItem.New()
        .set(useState<string>(""))
    items.genderSelect = CsSelectBoxItem.New(["男性", "女性", "未回答"], "未回答")
        .set(useState<string>(""))
    items.memo = CsTextAreaItem.New().set(useState<string>(""))
    items.other1 = CsTextBoxItem.New().set(useState<string>("1"))
    items.other2 = CsTextBoxItem.New().set(useState<string>("2"))
    items.other3 = CsTextBoxItem.New().set(useState<string>("3"))
    items.other4 = CsTextBoxItem.New().set(useState<string>("4"))
    items.other5 = CsTextBoxItem.New().set(useState<string>("5"))
    items.other6 = CsTextBoxItem.New().set(useState<string>("6"))
    items.other7 = CsTextBoxItem.New().set(useState<string>("7"))
    items.other8 = CsTextBoxItem.New().set(useState<string>("8"))
    items.other9 = CsTextBoxItem.New().set(useState<string>("9"))
    items.add = CsTextAreaItem.New().set(useState<string>("こんにちわ"))
    const view = useInitView<TestView>(
        TestView,
        undefined,
        items,
        undefined,
    )
    return view
}

export type TestViewItems = Extract<TestView, CsItemBase>
