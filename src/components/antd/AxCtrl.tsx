import React from 'react'
import { Input, Select, Radio, Checkbox, InputNumber, Typography } from "antd"
import {
    CsCheckBoxItem, CsPasswordItem, CsRadioBoxItem,
    CsSelectBoxItem, CsTextAreaItem, CsInputTextItem
} from '../../framework/cs'
import { CxProps } from '../../framework/cx/CxCtrl'
import { CsInputNumberItem, CsItem, CsItemBase, CsMultiCheckBoxItem } from '../../framework/cs/CsItem'
import "./AxCtrl.css"
import { ValidationError } from '../basics/ValidationError'

const { Text } = Typography
class AxProps<I extends CsInputTextItem | CsInputNumberItem | CsCheckBoxItem |
    CsPasswordItem | CsRadioBoxItem | CsSelectBoxItem |
    CsMultiCheckBoxItem | CsTextAreaItem> extends CxProps<I> {
    item: I = {} as I
}

export const AxLabel: React.FC<{ label: string, color?: string }> = (props: { label: string, color?: string }) => {
    const color = props.color ?? "#1867dcce"
    return (
        <div className="label"><Text style={{ color: color }}>{props.label}</Text></div>
    )
}

const getClassName = (item: CsItemBase, add?: string): string => {
    const names = ["ctrl"]
    if (add) {
        names.push(add)
    }
    if (item.readonly) {
        names.push("readonly")
    }
    return names.join(" ")
}
const getMessageKey = <T,>(item: CsItem<T>): string => {
    if (!item.parentView) return ""
    if (!item.parentView.validateEvent) return ""
    const view = item.parentView
    const keyVals = Object.entries(view)
    for (const v of keyVals) {
        if (v[1] === item) {
            return v[0]
        }
    }
    return ""
}

const getValidateionError = <T,>(item: CsItem<T>): string => {
    const key = getMessageKey<T>(item)
    return item.parentView?.validateEvent?.validationError[key] ?? ""
}

export const AxInputText: React.FC<CxProps<CsInputTextItem>> = (props) => {
    const { item } = props
    console.log(getClassName(item, "fit-content"))
    return (
        <div>
            <AxLabel label={item.label}></AxLabel>
            <Input className={getClassName(item)} value={item.value} defaultValue={item.value} readOnly={item.readonly}
                onChange={(e) => { item.setValue(e.target.value) }} />
            <ValidationError message={getValidateionError<string>(item)} />
        </div>
    )
}

export const AxInputNumber: React.FC<CxProps<CsInputNumberItem>> = (props) => {
    const { item } = props
    return (
        <div>
            <AxLabel label={item.label}></AxLabel>
            <InputNumber className={getClassName(item)} value={item.value} defaultValue={item.value} readOnly={item.readonly}
                onChange={(value: number | null) => { if (value != null) { item.setValue(value) } }} />
            <ValidationError message={getValidateionError<number>(item)} />
        </div>
    )
}

export const AxPasswordBox: React.FC<CxProps<CsPasswordItem>> = (props) => {
    const { item } = props
    return (
        <div>
            <AxLabel label={item.label}></AxLabel>
            <Input.Password className={getClassName(item)} value={item.value} defaultValue={item.value} readOnly={item.readonly}
                onChange={(e) => { item.setValue(e.target.value) }} />
            <ValidationError message={getValidateionError<string>(item)} />
        </div>
    )
}

export const AxTextArea: React.FC<CxProps<CsTextAreaItem>> = (props: CxProps<CsTextAreaItem>) => {
    const { item } = props
    return (
        <div>
            <AxLabel label={item.label}></AxLabel>
            <Input.TextArea className="ctrl textarea" value={item.value} defaultValue={item.value} readOnly={item.readonly}
                onChange={(e) => { item.setValue(e.target.value) }} />
            <ValidationError message={getValidateionError<string>(item)} />
        </div>
    )
}

export const AxSelectBox: React.FC<CxProps<CsSelectBoxItem>> = (props) => {
    const { item } = props
    return (
        <div>
            <AxLabel label={item.label}></AxLabel>
            <Select
                className={getClassName(item, "fit-content")}
                value={item.value}
                defaultValue={item.value}
                aria-readonly={item.readonly}
                onChange={(value: string) => { item.setValue(value) }}
                disabled={item.readonly}
            >
                {item.options.map(o => {
                    return (<Select.Option key={o[item.valueKey]} value={o[item.valueKey]}>{o[item.labelKey]}</Select.Option>)
                })}
            </Select>
            <ValidationError message={getValidateionError<string>(item)} />
        </div >
    )
}

export const AxRadioBox: React.FC<CxProps<CsRadioBoxItem>> = (props) => {
    const { item } = props
    return (
        <div>
            <AxLabel label={item.label} ></AxLabel>
            <Radio.Group
                className={getClassName(item, "fit-content")}
                value={item.value}
                aria-readonly={item.readonly}
                onChange={(e) => { item.setValue(e.target.value) }}
                disabled={item.readonly}
            >
                {item.options.map(o => {
                    return (<Radio key={o[item.valueKey]} value={o[item.valueKey]}>{o[item.labelKey]}</Radio>)
                })}
            </Radio.Group>
            <ValidationError message={getValidateionError<string>(item)} />
        </div>
    )
}

export const AxCheckBox: React.FC<CxProps<CsCheckBoxItem>> = (props) => {
    const { item } = props
    return (
        <div>
            <AxLabel label={item.label} ></AxLabel>
            <Checkbox className={getClassName(item, "fit-content")} value={item.value} checked={item.value}
                onChange={(e) => item.setValue(e.target.checked)} disabled={item.readonly}>
                {item.checkBoxText}
            </Checkbox>
            <ValidationError message={getValidateionError<boolean>(item)} />
        </div>
    )
}

export const AxMultiCheckBox: React.FC<CxProps<CsMultiCheckBoxItem>> = (props) => {
    const { item } = props
    return (
        <>
            <AxLabel label={item.label} ></AxLabel>
            <div>

                <div className={getClassName(item, "fit-content")}>
                    {item.options.map(o => {
                        const value = o[item.valueKey]
                        const text = o[item.labelKey]
                        return (
                            <Checkbox className="checkboxItem" key={value} value={value} checked={item.value.includes(value)}
                                onChange={(e) => {
                                    if (e.target.checked) {
                                        item.setValue(item.value.concat([value]))
                                    } else {
                                        item.setValue(item.value.filter(v => v !== value))
                                    }
                                }}>
                                {text}
                            </Checkbox>
                        )
                    })}
                </div>
                <ValidationError message={getValidateionError<string[]>(item)} />
            </div>
        </>
    )
}