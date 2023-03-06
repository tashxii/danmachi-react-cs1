import React from "react"
import { CsItem, NumberValidateOption, StringValidateOption } from "./CsItem"
import { stringField, useValidation } from "../validation"
import FieldConstraint from "../validation/field/FieldConstraint"
import StringFieldConstraint from "../validation/field/StringFieldConstraint"
import NumberFieldConstraint, { numberField } from "../validation/field/NumberFieldConstraint"
import { CsValidationEvent } from "./CsEvent"
// import CsEvent, { CsCallback, CsEffect } from "./CsEvent"

export default abstract class CsView {
    readonly: boolean = false
    validateFieldMap?: Map<string, string | number | string[]>
    validateEvent?: CsValidationEvent
    constructor() {
        this.validateFieldMap = new Map<string, string | number | string[]>()
    }
    static createValidationSchema<T extends CsView>(instance: T) {
        const validationMap = new Map<string, StringFieldConstraint | NumberFieldConstraint | FieldConstraint<boolean>>()
        const keys = Object.keys(instance)
        instance.validateFieldMap = new Map<string, string | number | string[]>()
        keys.forEach(key => {
            const item = instance[key as keyof T]
            if (!(item instanceof CsItem)) return
            item.parentView = instance
            if (item instanceof CsItem<string>) {
                const csItem = item as CsItem<string>
                const valOpt = csItem.validateOption
                if (valOpt instanceof StringValidateOption) {
                    const sValOpt = valOpt as StringValidateOption
                    const sf = stringField();
                    if (sValOpt.required) sf.required(csItem.label + "は必須です。値を入力してください")
                    if (sValOpt.min) sf.minLength(sValOpt.min, csItem.label + "が短すぎます。 " + sValOpt.min + "文字より長い文字列を入力してください")
                    if (sValOpt.max) sf.maxLength(sValOpt.max, csItem.label + "が長すぎます。 " + sValOpt.max + "文字より短い文字列を入力してください")
                    if (sValOpt.email) sf.email(csItem.label + "は、正しいメールアドレスの形式で入力してください")
                    validationMap.set(key, sf)
                    instance.validateFieldMap!.set(key, csItem.value)
                }
            }
            if (item instanceof CsItem<number>) {
                const csItem = item as CsItem<number>
                const valOpt = csItem.validateOption
                if (valOpt instanceof NumberValidateOption) {
                    const nValOpt = valOpt as NumberValidateOption
                    const nf = numberField();
                    if (nValOpt.required) nf.required(csItem.label + "は必須です。値を入力してください")
                    if (nValOpt.min) nf.min(nValOpt.min, csItem.label + "が小さすぎます。 " + nValOpt.min + "より大きい数を入力してください")
                    if (nValOpt.max) nf.max(nValOpt.max, csItem.label + "が大きすぎます。 " + nValOpt.max + "より小さい数を入力してください")
                    validationMap.set(key, nf)
                    instance.validateFieldMap!.set(key, csItem.value)
                }
            }
        })
        const validationSchemaObj = Object.fromEntries(validationMap)
        return validationSchemaObj
    }
}


export function useCsView<T extends CsView>(
    instance: T
): T {
    const validationSchemaObj = CsView.createValidationSchema<T>(instance)
    const { error, resetError, handleSubmit } = useValidation(validationSchemaObj)
    instance.validateEvent = new CsValidationEvent(error, resetError, handleSubmit)
    return instance
}
