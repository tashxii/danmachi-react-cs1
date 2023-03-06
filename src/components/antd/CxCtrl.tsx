import React from 'react'
import { Input, Select, Radio, Checkbox, InputNumber, Typography } from "antd"
import { CsCheckBoxItem, CsItemBase, CsPasswordItem, CsRadioBoxItem, CsSelectBoxItem, CsTextAreaItem, CsInputTextItem } from '../../framework/cs'
import { CxCheckBox, CxLabel, CxPasswordBox, CxProps, CxRadioBox, CxSelectBox, CxTextArea, CxInputText } from '../../framework/cx/CxCtrl'
import { CsInputNumberItem } from '../../framework/cs/CsItem'
const { Text } = Typography
class AxProps<I extends CsInputTextItem | CsInputNumberItem | CsCheckBoxItem |
    CsPasswordItem | CsRadioBoxItem | CsSelectBoxItem | CsTextAreaItem> extends CxProps<I> {
    item: I = {} as I
}

export const AxLabel: React.FC<{ label: string }> = (props) => {
    return (
        <div><Text style={{ color: "#1867dcce" }}>{props.label}</Text></div>
    )
}

export const AxInputText: React.FC<CxProps<CsInputTextItem>> = (props) => {
    const { item } = props
    return (
        <>
            <AxLabel label={item.label}></AxLabel>
            <Input value={item.value} defaultValue={item.value} readOnly={item.readonly}
                onChange={(e) => { item.setValue(e.target.value) }} />
        </>
    )
}

export const AxInputNumber: React.FC<CxProps<CsInputNumberItem>> = (props) => {
    const { item } = props
    return (
        <>
            <AxLabel label={item.label}></AxLabel>
            <InputNumber value={item.value} defaultValue={item.value} readOnly={item.readonly}
                onChange={(value: number | null) => { if (value) { item.setValue(value) } }} />
        </>
    )
}

export const AxPasswordBox: React.FC<CxProps<CsPasswordItem>> = (props) => {
    const { item } = props
    return (
        <>
            <AxLabel label={item.label}></AxLabel>
            <Input.Password value={item.value} defaultValue={item.value} readOnly={item.readonly}
                onChange={(e) => { item.setValue(e.target.value) }} />
        </>
    )
}

export const AxTextArea: React.FC<CxProps<CsTextAreaItem>> = (props) => {
    const { item } = props
    return (
        <>
            <AxLabel label={item.label}></AxLabel>
            <Input.TextArea value={item.value} defaultValue={item.value} readOnly={item.readonly}
                onChange={(e) => { item.setValue(e.target.value) }} />
        </>
    )
}

export const AxSelectBox: React.FC<CxProps<CsSelectBoxItem>> = (props) => {
    const { item } = props
    return (
        <>
            <AxLabel label={item.label}></AxLabel>
            <Select
                value={item.value}
                defaultValue={item.selected}
                aria-readonly={item.readonly}
                onChange={(value: string) => { item.setValue(value) }}
            >
                {item.options.map(o => {
                    return (<Select.Option key={o[item.valueKey]} value={o[item.valueKey]}>{o[item.labelKey]}</Select.Option>)
                })}
            </Select>
        </>
    )
}

export const AxRadioBox: React.FC<CxProps<CsRadioBoxItem>> = (props) => {
    const { item } = props
    return (
        <>
            <AxLabel label={item.label} ></AxLabel>
            <Radio.Group
                value={item.value}
                aria-readonly={item.readonly}
                onChange={(e) => { item.setValue(e.target.value) }}
            >
                {item.options.map(o => {
                    return (<Radio key={o[item.valueKey]} value={o[item.valueKey]}>{o[item.labelKey]}</Radio>)
                })}
            </Radio.Group>
        </>
    )
}

export const AxCheckBox: React.FC<CxProps<CsCheckBoxItem>> = (props) => {
    const { item } = props
    return (
        <>
            <AxLabel label={item.label} ></AxLabel>
            <Checkbox value={item.value} checked={item.value} onChange={(e) => item.setValue(e.target.checked)} />
        </>
    )
}
