import React from "react"
import { CsItem, NumberValidateOption, StringArrayValidationOption, StringValidateOption } from "./CsItem"
import { stringField, useValidation } from "../validation"
import FieldConstraint from "../validation/field/FieldConstraint"
import StringFieldConstraint from "../validation/field/StringFieldConstraint"
import NumberFieldConstraint, { numberField } from "../validation/field/NumberFieldConstraint"
import { CsValidationEvent } from "./CsEvent"
import StringArrayFieldConstraint, { stringArrayField } from "../validation/field/StringArrayFieldConstraint"
// import CsEvent, { CsCallback, CsEffect } from "./CsEvent"

export default abstract class CsView {
    readonly: boolean = false
    validateFieldMap?: Map<string, string | number | string[]>
    validateEvent?: CsValidationEvent
    constructor() {
        this.validateFieldMap = new Map<string, string | number | string[]>()
    }
    static createValidationSchema<T extends CsView>(instance: T) {
        const validationMap = new Map<string, StringFieldConstraint | NumberFieldConstraint | StringArrayFieldConstraint | FieldConstraint<boolean>>()
        const keys = Object.keys(instance)
        const validateFieldMap = new Map<string, string | number | string[]>()
        instance.validateFieldMap = validateFieldMap
        keys.forEach(key => {
            const item = instance[key as keyof T]
            if (!(item instanceof CsItem)) return
            item.parentView = instance
            if (item instanceof CsItem<string>) {
                const csItem = item as CsItem<string>
                const value = csItem.value ?? "";
                const valOpt = csItem.validateOption
                if (valOpt instanceof StringValidateOption) {
                    const sValOpt = valOpt as StringValidateOption
                    const sf = stringField();
                    if (sValOpt.required) sf.required(csItem.label + "は必須です。値を入力してください")
                    if (sValOpt.min) sf.minLength(sValOpt.min, csItem.label + "が短すぎます。 " + sValOpt.min + "文字より長い文字列を入力してください")
                    if (sValOpt.max) sf.maxLength(sValOpt.max, csItem.label + "が長すぎます。 " + sValOpt.max + "文字より短い文字列を入力してください")
                    if (sValOpt.email) sf.email(csItem.label + "は、正しいメールアドレスの形式で入力してください")
                    validationMap.set(key, sf)
                    validateFieldMap.set(key, value)
                }
            }
            if (item instanceof CsItem<number>) {
                const csItem = item as CsItem<number>
                const value = csItem.value ?? 0;
                const valOpt = csItem.validateOption
                if (valOpt instanceof NumberValidateOption) {
                    const nValOpt = valOpt as NumberValidateOption
                    const nf = numberField();
                    if (nValOpt.required) nf.required(csItem.label + "は必須です。値を入力してください")
                    if (nValOpt.min) nf.min(nValOpt.min, csItem.label + "が小さすぎます。 " + nValOpt.min + "より大きい数を入力してください")
                    if (nValOpt.max) nf.max(nValOpt.max, csItem.label + "が大きすぎます。 " + nValOpt.max + "より小さい数を入力してください")
                    validationMap.set(key, nf)
                    validateFieldMap.set(key, value)
                }
            }
            if (item instanceof CsItem<string[]>) {
                const csItem = item as CsItem<string[]>
                const value = csItem.value ?? [];
                const valOpt = csItem.validateOption
                if (valOpt instanceof StringArrayValidationOption) {
                    const saValOpt = valOpt as StringArrayValidationOption
                    const saf = stringArrayField();
                    if (saValOpt.required) saf.required(csItem.label + "は必須です。1つ以上の値を入力してください")
                    validationMap.set(key, saf)
                    validateFieldMap.set(key, value)
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
    const { error, validator, resetError, handleSubmit } = useValidation(validationSchemaObj)
    instance.validateEvent = new CsValidationEvent(error, validator, resetError, handleSubmit)
    return instance
}
