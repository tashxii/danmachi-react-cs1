import React from 'react'
import { CsItem, CsCheckBoxItem, CsItemBase, CsPasswordItem, CsRadioBoxItem, CsSelectBoxItem, CsTextAreaItem, CsInputTextItem } from '../cs'
import { CsInputNumberItem } from '../cs/CsItem'

export class CxProps<I extends CsInputNumberItem | CsCheckBoxItem | CsPasswordItem | CsRadioBoxItem | CsSelectBoxItem | CsTextAreaItem | CsInputTextItem> {
    item: I = {} as I
}

export const CxLabel: React.FC<React.LabelHTMLAttributes<HTMLLabelElement>> = (props: React.LabelHTMLAttributes<HTMLLabelElement>) => {
    return (
        <label {...props}>{props.children}</label>
    )
}

export const CxInputText: React.FC<CxProps<CsInputTextItem>> = (props) => {
    const { item } = props
    return (
        <>
            <CxLabel>{item.label}</CxLabel>
            <input className="Input" {...props} readOnly={item.readonly} value={item.value}
                onChange={(e: { target: { value: React.SetStateAction<string> } }) => { item.setValue(e.target.value) }} />
        </>
    )
}

export const CxInputNumber: React.FC<CxProps<CsInputNumberItem>> = (props) => {
    const { item } = props
    return (
        <>
            <CxLabel>{item.label}</CxLabel>
            <input type="number" className="Input" {...props} readOnly={item.readonly} value={item.value}
                onChange={(e) => { item.setValue(Number(e.target.value)) }} />
        </>
    )
}

export const CxPasswordBox: React.FC<CxProps<CsPasswordItem>> = (props) => {
    const { item } = props
    return (
        <>
            <CxLabel>{item.label}</CxLabel>
            <input type="password" className="Input" readOnly={item.readonly} onChange={(e) => { item.setValue(e.target.value) }} />
        </>
    )
}

export const CxTextArea: React.FC<CxProps<CsTextAreaItem>> = (props) => {
    const { item } = props
    return (
        <>
            <CxLabel>{item.label}</CxLabel>
            <textarea className="Input" {...props} readOnly={item.readonly} rows={3} onChange={(e) => { item.setValue(e.target.value) }} />
        </>
    )
}

export const CxSelectBox: React.FC<CxProps<CsSelectBoxItem>> = (props) => {
    const { item } = props
    return (
        <>
            <CxLabel>{item.label}</CxLabel>
            <select className="Select" {...props} onChange={(e) => { item.setValue(e.target.value) }}>
                {item.options.map(o => {
                    return (<option value={o[item.valueKey]}>{o[item.labelKey]}</option>)
                })}
            </select>
        </>
    )
}

export const CxRadioBox: React.FC<CxProps<CsRadioBoxItem>> = (props) => {

    const { item } = props
    return (
        <>
            <CxLabel>{item.label}</CxLabel>
            {item.options.map(o => {
                return (
                    <>
                        <input type="radio" className="Input" id={o[item.valueKey]} name="contact" value={o[item.valueKey]} />
                        <label>{o[item.labelKey]}</label>
                    </>
                )
            }
            )}
        </>
    )
}

//export const CxCheckBox = (props: CxProps<CsCheckBoxItem>): => {
export const CxCheckBox: React.FC<CxProps<CsCheckBoxItem>> = (props) => {

    const { item } = props
    return (
        <>
            <label>{item.label}</label>
            <input type="checkbox" checked={item.value} onChange={(e) => { item.setValue(e.target.checked) }} />
        </>
    )
}
