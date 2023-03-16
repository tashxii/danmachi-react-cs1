import React, { ReactNode } from 'react'
import { Input, Select, Radio, Checkbox, InputNumber, Typography, Tag } from "antd"
import {
  CsCheckBoxItem, CsPasswordItem, CsRadioBoxItem,
  CsSelectBoxItem, CsTextAreaItem, CsInputTextItem
} from '../../framework/cs'
import { CxProps } from '../../framework/cx/CxCtrl'
import { CsInputNumberItem, CsItem, CsItemBase, CsMultiCheckBoxItem, CsSelectNumberBoxItem } from '../../framework/cs/CsItem'
import "./AxCtrl.css"
import { ValidationError } from '../basics/ValidationError'

const { Text } = Typography
class AxProps<I extends CsItemBase> extends CxProps<I> {
  item: I = {} as I
  showRequiredTag?: "both" | "required" | "optional" | "none"
  addClassNames?: string[]
}

export const AxLabel: React.FC<{ label: string | ReactNode, color?: string }> = (props: { label: string | ReactNode, color?: string }) => {
  const color = props.color ?? "#1867dcce"
  return (
    <div className="label"><Text style={{ color: color }}>{props.label}</Text></div>
  )
}

const getClassName = (props: AxProps<CsItemBase>, add?: string): string => {
  let names = ["ctrl"]
  const item = props.item
  if (add) {
    names.push(add)
  }
  if (props.addClassNames) {
    names = names.concat(props.addClassNames)
  }
  if (item.isReadonly()) {
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

const getLabel = <T,>(item: CsItem<T>, showRequiredTag?: "both" | "required" | "optional" | "none"): ReactNode => {
  const required = item.ValidationRule?.required ?? false
  const showTag = showRequiredTag ?? "both"
  const requiredTag = () => {
    switch (showTag) {
      case "both":
        return (<Tag color={required ? "error" : "default"}>{required ? "必須" : "任意"}</Tag>)
      case "required":
        return (required && <Tag color="error">{"必須"}</Tag>)
      case "optional":
        return (!required && <Tag color="default">{"任意"}</Tag>)
    }
  }
  return (
    <span>
      {item.label}
      {requiredTag()}
    </span >
  )
}

export const AxInputText: React.FC<AxProps<CsInputTextItem>> = (props) => {
  const { item, showRequiredTag } = props
  return (
    <div>
      <AxLabel label={getLabel(item, showRequiredTag)}></AxLabel>
      <Input className={getClassName(props)} value={item.value} defaultValue={item.value} readOnly={item.isReadonly()}
        onChange={(e) => { item.setValue(e.target.value) }} />
      <ValidationError message={getValidateionError<string>(item)} />
    </div>
  )
}

export const AxInputNumber: React.FC<AxProps<CsInputNumberItem>> = (props) => {
  const { item, showRequiredTag } = props
  return (
    <div>
      <AxLabel label={getLabel(item, showRequiredTag)}></AxLabel>
      <InputNumber className={getClassName(props)} value={item.value} defaultValue={item.value} readOnly={item.isReadonly()}
        onChange={(value: number | null) => { if (value != null) { item.setValue(value) } }} />
      <ValidationError message={getValidateionError<number>(item)} />
    </div>
  )
}

export const AxPasswordBox: React.FC<AxProps<CsPasswordItem>> = (props) => {
  const { item, showRequiredTag } = props
  return (
    <div>
      <AxLabel label={getLabel(item, showRequiredTag)}></AxLabel>
      <Input.Password className={getClassName(props)} value={item.value} defaultValue={item.value} readOnly={item.isReadonly()}
        onChange={(e) => { item.setValue(e.target.value) }} />
      <ValidationError message={getValidateionError<string>(item)} />
    </div>
  )
}

export const AxTextArea: React.FC<AxProps<CsTextAreaItem>> = (props: AxProps<CsTextAreaItem>) => {
  const { item, showRequiredTag } = props
  return (
    <div>
      <AxLabel label={getLabel(item, showRequiredTag)}></AxLabel>
      <Input.TextArea className={getClassName(props, "textarea")}
        value={item.value} defaultValue={item.value} readOnly={item.isReadonly()}
        onChange={(e) => { item.setValue(e.target.value) }} />
      <ValidationError message={getValidateionError<string>(item)} />
    </div>
  )
}

export const AxSelectBox = <T extends string | number = string>(props: AxProps<CsSelectBoxItem<T>>) => {
  const { item, showRequiredTag } = props
  return (
    <div>
      <AxLabel label={getLabel(item, showRequiredTag)}></AxLabel>
      <Select
        className={getClassName(props, "fit-content")}
        value={item.value}
        defaultValue={item.value}
        onChange={(value: T) => { item.setValue(value) }}
      >
        {item.options.map(o => {
          return (
            (!item.isReadonly() || (item.isReadonly() && item.value === o[item.valueKey])) ?
              <Select.Option key={o[item.valueKey]} value={o[item.valueKey]}>
                {o[item.labelKey]}
              </Select.Option>
              : null
          )
        })}
      </Select>
      <ValidationError message={getValidateionError<T>(item)} />
    </div >
  )
}

export const AxSelectNumberBox: (props: AxProps<CsSelectBoxItem<number>>) => JSX.Element = (props) => {
  return (<AxSelectBox<number> {...props} />)
}

export const AxRadioBox: React.FC<AxProps<CsRadioBoxItem>> = (props) => {
  const { item, showRequiredTag } = props
  return (
    <div>
      <AxLabel label={getLabel(item, showRequiredTag)} ></AxLabel>
      <Radio.Group
        className={getClassName(props, "fit-content")}
        value={item.value}
        onChange={(e) => {
          if (item.isReadonly()) return
          item.setValue(e.target.value)
        }}
      >
        {item.options.map(o => {
          return (
            <Radio key={o[item.valueKey]} value={o[item.valueKey]}
              disabled={item.isReadonly() && item.value !== o[item.valueKey]}>
              {o[item.labelKey]}
            </Radio>
          )
        })}
      </Radio.Group>
      <ValidationError message={getValidateionError<string>(item)} />
    </div>
  )
}

export const AxCheckBox: React.FC<AxProps<CsCheckBoxItem>> = (props) => {
  const { item, showRequiredTag } = props
  return (
    <div>
      <AxLabel label={getLabel(item, showRequiredTag)} ></AxLabel>
      <Checkbox className={getClassName(props, "fit-content")} value={item.value} checked={item.value}
        onChange={(e) => {
          if (item.isReadonly()) return
          item.setValue(e.target.checked)
        }}
      >
        {item.checkBoxText}
      </Checkbox>
      <ValidationError message={getValidateionError<boolean>(item)} />
    </div>
  )
}

export const AxMultiCheckBox: React.FC<AxProps<CsMultiCheckBoxItem>> = (props) => {
  const { item, showRequiredTag } = props
  return (
    <div>
      <AxLabel label={getLabel(item, showRequiredTag)} ></AxLabel>
      <div className={getClassName(props, "fit-content")}>
        {item.options.map(o => {
          const value = o[item.valueKey]
          const text = o[item.labelKey]
          return (
            <Checkbox
              className="checkbox-item" key={value} value={value}
              checked={item.value?.includes(value)}
              onChange={(e) => {
                if (item.isReadonly()) return
                if (e.target.checked) {
                  if (item.value) {
                    item.setValue(item.value?.concat(value))
                  } else {
                    item.setValue([])
                  }
                } else {
                  if (item.value) {
                    item.setValue(item.value?.filter(v => v !== value))
                  } else {
                    item.setValue([])
                  }
                }
              }}
              disabled={item.isReadonly() && !item.value?.includes(value)}>
              {text}
            </Checkbox>
          )
        })}
      </div>
      <ValidationError message={getValidateionError<string[]>(item)} />
    </div>
  )
}