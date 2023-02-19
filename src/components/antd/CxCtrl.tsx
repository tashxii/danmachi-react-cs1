import React from 'react'
import { Input, Select, Radio, Checkbox } from "antd"
import { CsCheckBoxItem, CsItemBase, CsPasswordBoxItem, CsRadioBoxItem, CsSelectBoxItem, CsTextAreaItem, CsTextBoxItem } from '../../framework/cs'
import { CxCheckBox, CxLabel, CxPasswordBox, CxProps, CxRadioBox, CxSelectBox, CxTextArea, CxTextBox } from '../../framework/cx/CxCtrl'

class AntdProps<I extends CsItemBase> extends CxProps<I> {
    item: I = {} as I
    render?: (props:AntdProps<I>) => JSX.Element
}

export const AntdCtrl = <I extends CsItemBase, P extends CxProps<I>>(props : P) => {
    return (<></>)
}

export const AntdLabel : React.FC<{label:string, render?:React.FC}> = (props) => {
    return (
        <CxLabel {...props}/>
    )
}

export const AntdTextBox : React.FC<CxProps<CsTextBoxItem>> = (props) => {
  props.render = (props) => {
    const { item } = props
    return (
       <Input onChange={(e)=>{item.setValue(e.target.value)}}/>
    )
  }
  return (
    <CxTextBox {...props}/>
  )
}

export const AntdPasswordBox : React.FC<CxProps<CsPasswordBoxItem>> = (props) => {
    props.render = (props) => {
        const { item } = props
        return (
           <Input.Password readOnly={item.readonly} onChange={(e)=>{item.setValue(e.target.value)}}/>
        )
      }
    return (
        <CxPasswordBox {...props}/>
    )
  }

export const AntdTextArea : React.FC<CxProps<CsTextAreaItem>> = (props) => {
    props.render = (props) => {
        const { item } = props
        return (
           <Input.TextArea readOnly={item.readonly} onChange={(e)=>{item.setValue(e.target.value)}}/>
        )
      }
    return (
      <CxTextArea {...props}/>
    )
}

export const AntdSelectBox : React.FC<CxProps<CsSelectBoxItem>> = (props) => {
    props.render = (props) => {
        const { item } = props
        const selectOptions = item.options.map(o => {
            return {value:o, label:o}
        })
        return (
            <Select
                value={item.selected}
                aria-readonly={item.readonly} 
                onChange={(value:string)=>{item.setValue(value)}}
                options={selectOptions}/>
        )
      }
    return (
      <CxSelectBox {...props}/>
    )
}

export const AntdRadioBox : React.FC<CxProps<CsRadioBoxItem>> = (props) => {
    props.render = (props) => {
        const { item } = props
        const selectOptions = item.options.map(o => {
            return {value:o, label:o}
        })
        return (
            <>
            <AntdLabel label={item.name}></AntdLabel>
                <Radio.Group
                    value={item.selected}
                    aria-readonly={item.readonly} 
                    onChange={(e)=>{item.setValue(e.target.value)}}
                >
                    {item.options.map(o => (<Radio value={o}>o</Radio>)}
                </Radio.Group>
            </>
        )
      }
    return (
        <CxRadioBox {...props}/>
    )
}

export const AntdCheckBox : React.FC<CxProps<CsCheckBoxItem>> = (props) => {
    props.render = (props) => {
        const { item } = props
        return (
            <Checkbox checked={item.value} onChange={(e)=>item.setValue(e.target.value)}/>
        )
    }
    return (
        <CxCheckBox {...props}/>
    )
}
