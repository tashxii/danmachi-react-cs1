import React from 'react'
import { CsCheckBoxItem, CsItemBase, CsPasswordItem, CsRadioBoxItem, CsSelectBoxItem, CsTextAreaItem, CsInputTextItem } from '../cs'

export class CxProps<I extends CsCheckBoxItem|CsPasswordItem|CsRadioBoxItem|CsSelectBoxItem|CsTextAreaItem|CsInputTextItem> {
    item: I = {} as I
}

export const CxCtrl = <I extends CsItemBase, P extends CxProps<I>>(props: P) => {
    return (<></>)
}

export const CxLabel: React.FC<{ label: string }> = (props : ) => {
    return (<>{props.label}</>)
}

export const CxTextBox: React.FC<CxProps<CsInputTextItem>> = (props) => {
    const { item } = props
    return (
        <input className="Input" {...props} readOnly={item.readonly} value={item.value}
            onChange={(e: { target: { value: React.SetStateAction<string> } }) => { item.setValue(e.target.value) }} />
    )
}

export const CxPasswordBox: React.FC<CxProps<CsPasswordItem>> = (props) => {
    const { item } = props
    return (
        <input type="password" className="Input" readOnly={item.readonly} onChange={(e) => { item.setValue(e.target.value) }} />
    )
}

export const CxTextArea: React.FC<CxProps<CsTextAreaItem>> = (props) => {
    const { item } = props
    return (
        <textarea className="Input" {...props} readOnly={item.readonly} rows={3} onChange={(e) => { item.setValue(e.target.value) }} />
    )
}

export const CxSelectBox: React.FC<CxProps<CsSelectBoxItem>> = (props) => {
    const { item } = props
    return (
        <select className="Select" {...props} onChange={(e) => { item.setValue(e.target.value) }}>
            {item.options.map(o => {
                return (<option value={o}>{o}</option>)
            })}
        </select>
    )
}

export const CxRadioBox: React.FC<CxProps<CsRadioBoxItem>> = (props) => {

    const { item } = props
    return (
        <div>
            {item.options.map(o => {
                return (
                    <>
                        <input type="radio" className="Input" id={o} name="contact" value={o} />
                        <label>{o}</label>
                    </>
                )
            }
            )}
        </div>
    )
}

//export const CxCheckBox = (props: CxProps<CsCheckBoxItem>): => {
export const CxCheckBox: React.FC<CxProps<CsCheckBoxItem>> = (props) => {

    const { item } = props
    return (
        <div>
            <input type="checkbox" checked={item.value} onChange={(e) => { item.setValue(e.target.checked) }} />
            <label>{item.text}</label>
        </div>
    )
}
