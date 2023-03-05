import CsEvent, { CsCallback, CsEffect } from "./CsEvent"
import CsItem, { BooleanValidateOption, CsItemBase, NumberValidateOption, StringValidateOption } from "./CsItem"
import React, { useState } from "react"
import { stringField } from "../validation"
import FieldConstraint from "../validation/field/FieldConstraint"
import StringFieldConstraint from "../validation/field/StringFieldConstraint"
import NumberFieldConstraint, { numberField } from "../validation/field/NumberFieldConstraint"

export default abstract class CsView {
    readonly: boolean = false
    onValidate: Function = () => void
}

export function useCsView<T extends CsView>(
    instance: T
): T {
    const validationObj = new Map<string, StringFieldConstraint | NumberFieldConstraint | FieldConstraint<boolean>>()
    const keys = Object.keys(instance)
    keys.forEach(key => {
        const item = instance[key as keyof T]
        if (!(item instanceof CsItem)) return
        const csItem = item as CsItem
        const valOpt = csItem.validateOption
        if (valOpt instanceof StringValidateOption) {
            const sValOpt = valOpt as StringValidateOption
            const sf = stringField();
            if (sValOpt.required) sf.required(csItem.label + "は必須です。値を入力してください")
            if (sValOpt.min) sf.minLength(sValOpt.min, csItem.label + "が短すぎます。 " + sValOpt.min + "文字より長い文字列を入力してください")
            if (sValOpt.max) sf.maxLength(sValOpt.max, csItem.label + "が長すぎます。 " + sValOpt.max + "文字より短い文字列を入力してください")
            validationObj.set(key, sf)
        } else if (valOpt instanceof NumberValidateOption) {
            const nValOpt = valOpt as NumberValidateOption
            const nf = numberField();
            if (nValOpt.required) nf.required(csItem.label + "は必須です。値を入力してください")
            if (nValOpt.min) nf.min(nValOpt.min, csItem.label + "が小さすぎます。 " + nValOpt.min + "より大きい数を入力してください")
            if (nValOpt.max) nf.max(nValOpt.max, csItem.label + "が大きすぎます。 " + nValOpt.max + "より小さい数を入力してください")
            validationObj.set(key, nf)
        }
    })
    return instance
}
