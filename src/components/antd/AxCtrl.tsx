import React, { ReactNode, useEffect, useState } from 'react'
import { Input, Select, Radio, Checkbox, InputNumber, Typography, Tag } from "antd"
import {
  CsCheckBoxItem, CsPasswordItem, CsRadioBoxItem,
  CsSelectBoxItem, CsTextAreaItem, CsInputTextItem,
  CsInputNumberItem, CsItem, CsItemBase,
  CsMultiCheckBoxItem, CsSelectNumberBoxItem
} from '../../framework/cs'
import "./AxCtrl.css"
import { ValidationError } from '../basics/ValidationError'

const { Text } = Typography

interface AxProps<I extends CsItemBase> {
  item: I
  showRequiredTag?: "both" | "required" | "optional" | "none"
  addClassNames?: string[]
}

export const AxLabel: React.FC<{ label: string | ReactNode, color?: string }> = (props: { label: string | ReactNode, color?: string }) => {
  const color = props.color ?? "#1867dcce"
  return (
    <div className="label"><Text style={{ color: color }}>{props.label}</Text></div>
  )
}

const getClassName = <T,>(props: AxProps<CsItem<T>>, add?: string): string => {
  let names = ["ctrl"]
  const item = props.item
  if (add) {
    names.push(add)
  }
  if (props.addClassNames) {
    names = names.concat(props.addClassNames)
  }
  if (item.hasValidationError) {
    names.push("validation-error")
  }
  if (item.isReadonly()) {
    names.push("readonly")
  }
  return names.join(" ")
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

const validateWhenErrroExists = <T extends string | number | string[]>(newValue: T, item: CsItem<T>) => {
  const validateEvent = item.parentView?.validateEvent
  if (!validateEvent) {
    return
  }
  if (!validateEvent.validationError[item.key]) {
    return
  }
  console.log("here " + item.key, item.value)
  return validateEvent.onItemValidateHasError(newValue, item)
}

export interface AxEditCtrlProps<T extends CsItemBase> {
  axProps: AxProps<T>
  renderCtrl: (setRefresh: React.Dispatch<React.SetStateAction<boolean>>) => ReactNode
}

export const AxEditCtrl = <T,>(props: AxEditCtrlProps<CsItem<T>>) => {
  const { axProps, renderCtrl } = props
  const { item, showRequiredTag } = axProps
  const [refresh, setRefresh] = useState(false)

  useEffect(() => {
    if (refresh) {
      setRefresh(false)
    }
  }, [item.hasValidationError, refresh])

  return (
    <div>
      <AxLabel label={getLabel(item, showRequiredTag)}></AxLabel>
      {renderCtrl(setRefresh)}
      <ValidationError message={item.validationErrorMessage} />
    </div>
  )
}

export const AxInputText: React.FC<AxProps<CsInputTextItem>> = (props) => {
  const { item } = props
  return (
    <AxEditCtrl axProps={props}
      renderCtrl={(setRefresh) => (
        <Input className={getClassName(props)}
          value={item.value} defaultValue={item.value}
          readOnly={item.isReadonly()}
          onChange={(e) => {
            item.setValue(e.target.value)
            if (!validateWhenErrroExists(e.target.value, item)) {
              setRefresh(true)
            }
          }}
        />
      )}
    /> // AxEditCtrl
  )
}

export const AxInputNumber: React.FC<AxProps<CsInputNumberItem>> = (props) => {
  const { item } = props
  return (
    <AxEditCtrl axProps={props}
      renderCtrl={(setRefresh) => (
        <InputNumber className={getClassName(props)}
          value={item.value} defaultValue={item.value}
          readOnly={item.isReadonly()}
          onChange={(value: number | null) => {
            if (value !== null) { item.setValue(value) }
            if (value === null) { item.setValue() }
            if (!validateWhenErrroExists(value ?? 0, item)) {
              setRefresh(true)
            }
          }}
        />
      )}
    /> // AxEditCtrl
  )
}

export const AxPasswordBox: React.FC<AxProps<CsPasswordItem>> = (props) => {
  const { item } = props
  return (
    <AxEditCtrl axProps={props}
      renderCtrl={(setRefresh) => (
        <Input.Password className={getClassName(props)}
          value={item.value} defaultValue={item.value}
          readOnly={item.isReadonly()}
          onChange={(e) => {
            item.setValue(e.target.value)
            if (!validateWhenErrroExists(e.target.value, item)) {
              setRefresh(true)
            }
          }}
        />
      )}
    /> // AxEditCtrl
  )
}

export const AxTextArea: React.FC<AxProps<CsTextAreaItem>> = (props: AxProps<CsTextAreaItem>) => {
  const { item } = props
  return (
    <AxEditCtrl axProps={props}
      renderCtrl={(setRefresh) => (
        <Input.TextArea className={getClassName(props, "textarea")}
          value={item.value} defaultValue={item.value}
          readOnly={item.isReadonly()}
          onChange={(e) => {
            item.setValue(e.target.value)
            if (!validateWhenErrroExists(e.target.value, item)) {
              setRefresh(true)
            }
          }}
        />
      )}
    /> // AxEditCtrl
  )
}

export const AxSelectBox = <T extends string | number = string>(props: AxProps<CsSelectBoxItem<T>>) => {
  const { item } = props
  return (
    <AxEditCtrl axProps={props}
      renderCtrl={(setRefresh) => (
        <Select className={getClassName(props, "fit-content")}
          value={item.value} defaultValue={item.value}
          onChange={(value: T) => {
            item.setValue(value)
            if (!validateWhenErrroExists(value, item)) {
              setRefresh(true)
            }
          }}
        >
          {item.options.map(o => {
            return (
              (!item.isReadonly() || (item.isReadonly() && item.value === o[item.valueKey])) ?
                <Select.Option key={o[item.valueKey]} value={o[item.valueKey]}>
                  {o[item.labelKey]}
                </Select.Option>
                : null
            )
          })
          }
        </Select>
      )}
    /> // AxEditCtrl
  )
}

export const AxSelectNumberBox: (props: AxProps<CsSelectNumberBoxItem>) => JSX.Element = (props) => {
  return (<AxSelectBox<number> {...props} />)
}

export const AxRadioBox: React.FC<AxProps<CsRadioBoxItem>> = (props) => {
  const { item } = props
  return (
    <AxEditCtrl axProps={props}
      renderCtrl={(setRefresh) => (
        <Radio.Group className={getClassName(props, "fit-content")}
          value={item.value} defaultValue={item.value}
          onChange={(e) => {
            if (item.isReadonly()) return
            item.setValue(e.target.value)
            if (!validateWhenErrroExists(e.target.value, item)) {
              setRefresh(true)
            }
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
      )}
    /> // AxEditCtrl
  )
}

export const AxCheckBox: React.FC<AxProps<CsCheckBoxItem>> = (props) => {
  const { item } = props
  return (
    <AxEditCtrl axProps={props}
      renderCtrl={() => (
        <Checkbox className={getClassName(props, "fit-content")} value={item.value} checked={item.value}
          onChange={(e) => {
            if (item.isReadonly()) return
            item.setValue(e.target.checked)
          }}
        >
          {item.checkBoxText}
        </Checkbox>
      )}
    /> // AxEditCtrl
  )
}

export const AxMultiCheckBox: React.FC<AxProps<CsMultiCheckBoxItem>> = (props) => {
  const { item } = props
  return (
    <AxEditCtrl axProps={props}
      renderCtrl={(setRefresh) => (
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
                  let newValue: string[]
                  if (e.target.checked) {
                    newValue = (item.value) ? item.value?.concat(value) : []
                  } else {
                    newValue = (item.value) ? item.value?.filter(v => v !== value) : []
                  }
                  item.setValue(newValue)
                  if (!validateWhenErrroExists(newValue, item)) {
                    setRefresh(true)
                  }
                }}
                disabled={item.isReadonly() && !item.value?.includes(value)}>
                {text}
              </Checkbox>
            )
          })}
        </div>
      )}
    /> // AxEditCtrl
  )
}