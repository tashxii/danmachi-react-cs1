import React from 'react'
import { Input, Select, Radio, Checkbox } from "antd"
import { CsCheckBoxItem, CsItemBase, CsPasswordItem, CsRadioBoxItem, CsSelectBoxItem, CsTextAreaItem, CsInputTextItem } from '../../framework/cs'
import { CxCheckBox, CxLabel, CxPasswordBox, CxProps, CxRadioBox, CxSelectBox, CxTextArea, CxTextBox } from '../../framework/cx/CxCtrl'

class AntdProps<I extends CsItemBase> extends CxProps<I> {
    item: I = {} as I
}

export const AntdCtrl = <I extends CsItemBase, P extends CxProps<I>>(props: P) => {
    return (<></>)
}

export const AntdLabel: React.FC<{ label: string }> = (props) => {
    return (
        <CxLabel {...{ label: props.label }} />
    )
}

export const AntdTextBox: React.FC<CxProps<CsInputTextItem>> = (props) => {
    const { item } = props
    return (
        <Input onChange={(e) => { item.setValue(e.target.value) }} />
    )
}

export const AntdPasswordBox: React.FC<CxProps<CsPasswordItem>> = (props) => {
    const { item } = props
    return (
        <Input.Password readOnly={item.readonly} onChange={(e) => { item.setValue(e.target.value) }} />
    )
}

export const AntdTextArea: React.FC<CxProps<CsTextAreaItem>> = (props) => {
    const { item } = props
    return (
        <Input.TextArea readOnly={item.readonly} onChange={(e) => { item.setValue(e.target.value) }} />
    )
}

export const AntdSelectBox: React.FC<CxProps<CsSelectBoxItem>> = (props) => {
    const { item } = props
    const selectOptions = item.options.map(o => {
        return { key: o, value: o, label: o }
    })
    return (
        <Select
            value={item.selected}
            aria-readonly={item.readonly}
            onChange={(value: string) => { item.setValue(value) }}
            options={selectOptions} />
    )
}

export const AntdRadioBox: React.FC<CxProps<CsRadioBoxItem>> = (props) => {
    const { item } = props
    const selectOptions = item.options.map(o => {
        return { value: o, label: o }
    })
    return (
        <>
            <AntdLabel label={item.name} ></AntdLabel>
            <Radio.Group
                value={item.selected}
                aria-readonly={item.readonly}
                onChange={(e) => { item.setValue(e.target.value) }}
            >
                {item.options.map(o => {
                    return (<Radio key={o} value={o}>o</Radio>)
                })
                }
            </Radio.Group>
        </>
    )
}

export const AntdCheckBox: React.FC<CxProps<CsCheckBoxItem>> = (props) => {
    const { item } = props
    return (
        <Checkbox checked={item.value} onChange={(e) => item.setValue(e.target.value)} />
    )
}
