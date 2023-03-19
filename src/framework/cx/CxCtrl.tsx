import React from 'react'
import {
  CsCheckBoxItem, CsPasswordItem, CsRadioBoxItem,
  CsSelectBoxItem, CsTextAreaItem, CsInputTextItem
} from '../cs'
import { CsInputNumberItem, CsItemBase } from '../cs/CsItem'
import "./CxCtrl.css"

export class CxProps<I extends CsItemBase> {
  item: I = {} as I
}

export const CxLabel: React.FC<React.LabelHTMLAttributes<HTMLLabelElement>> = (props: React.LabelHTMLAttributes<HTMLLabelElement>) => {
  return (
    <label className="label" {...props}>{props.children}</label>
  )
}

export const CxInputText: React.FC<CxProps<CsInputTextItem>> = (props) => {
  const { item } = props
  return (
    <div className="ctrl">
      <CxLabel>{item.label}</CxLabel>
      <input className="Input" {...props} readOnly={item.isReadonly()} value={item.value}
        onChange={(e) => { item.setValue(e.target.value) }} />
    </div>
  )
}

export const CxInputNumber: React.FC<CxProps<CsInputNumberItem>> = (props) => {
  const { item } = props
  return (
    <div className="ctrl">
      <CxLabel>{item.label}</CxLabel>
      <input type="number" className="Input" {...props} readOnly={item.isReadonly()} value={item.value}
        onChange={(e) => { item.setValue(Number(e.target.value)) }} />
    </div>
  )
}

export const CxPasswordBox: React.FC<CxProps<CsPasswordItem>> = (props) => {
  const { item } = props
  return (
    <div className="ctrl">
      <CxLabel>{item.label}</CxLabel>
      <input type="password" value={item.value} className="Input" readOnly={item.isReadonly()} onChange={(e) => { item.setValue(e.target.value) }} />
    </div>
  )
}

export const CxTextArea: React.FC<CxProps<CsTextAreaItem>> = (props) => {
  const { item } = props
  return (
    <div className="ctrl">
      <CxLabel>{item.label}</CxLabel>
      <textarea className="Input" {...props} readOnly={item.isReadonly()} rows={3} onChange={(e) => { item.setValue(e.target.value) }} />
    </div>
  )
}

export const CxSelectBox: React.FC<CxProps<CsSelectBoxItem>> = (props) => {
  const { item } = props
  let key = 0
  return (
    <div className="ctrl">
      <CxLabel>{item.label}</CxLabel>
      <select className="Select" {...props} onChange={(e) => { item.setValue(e.target.value) }}>
        {item.options.map(o => {
          return (<option key={key++} value={o[item.optionValueKey]}>{o[item.optionLabelKey]}</option>)
        })}
      </select>
    </div>
  )
}

export const CxRadioBox: React.FC<CxProps<CsRadioBoxItem>> = (props) => {
  const { item } = props
  let key = 0
  return (
    <div className="ctrl">
      <CxLabel>{item.label}</CxLabel>
      {item.options.map(o => {
        return (
          <div className="ctrl" key={key}>
            <input type="radio" key={key++} className="Input" id={o[item.optionValueKey]} name="contact" value={o[item.optionValueKey]} />
            <label>{o[item.optionLabelKey]}</label>
          </div>
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
    <div className="ctrl">
      <label>{item.label}</label>
      <input type="checkbox" checked={item.value} onChange={(e) => { item.setValue(e.target.checked) }} />
    </div>
  )
}
