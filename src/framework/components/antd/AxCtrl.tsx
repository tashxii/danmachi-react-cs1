import React, { ChangeEvent, ReactNode, useEffect, useState } from "react"
import { Input, Select, Radio, Checkbox, InputNumber, Typography, Tag, InputProps, InputNumberProps, InputRef, SelectProps, RadioGroupProps, CheckboxProps } from "antd"
import {
  CsCheckBoxItem, CsInputPasswordItem, CsRadioBoxItem,
  CsSelectBoxItem, CsTextAreaItem, CsInputTextItem,
  CsInputNumberItem, CsItem, CsItemBase,
  CsMultiCheckBoxItem, CsSelectNumberBoxItem, CsHasOptionsItem,
} from "../../logics"
import "./AxCtrl.css"
import { ValidationError } from "../../../components/basics/ValidationError"
import { ValueType } from "@rc-component/mini-decimal"
import { TextAreaProps, TextAreaRef } from "antd/es/input/TextArea"

const { Text } = Typography

export interface AxProps<I extends CsItemBase> {
  item: I
  hideLabel?: boolean
  labelPlacement?: "top" | "left"
  labelWidth?: 5 | 10 | 15 | 20 | 25 | 30 | 35 | 40 | 45 | 50
  showRequiredTag?: "both" | "required" | "optional" | "none"
  addClassNames?: string[]
}

interface AxLabelProp {
  label: string | ReactNode
  color?: string
}

export const AxLabel = (props: AxLabelProp) => {
  const color = props.color ?? "#1867dcce"
  return (
    <div className="label"><Text style={{ color: color }}>{props.label}</Text></div>
  )
}

export const getClassName = <T,>(props: AxProps<CsItem<T>>, add?: string): string => {
  let names = ["antd-ctrl"]
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

export const getLabel = <T,>(item: CsItem<T>, showRequiredTag?: "both" | "required" | "optional" | "none"): ReactNode => {
  const required = item.validationRule?.required ?? false
  const showTag = showRequiredTag ?? ((item.parentView) ? "both" : "none")
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

export interface AxEditCtrlProps<T extends CsItemBase> {
  axProps: AxProps<T>
  renderCtrl: (setRefresh: React.Dispatch<React.SetStateAction<boolean>>) => ReactNode
}

export const AxEditCtrl = <T,>(props: AxEditCtrlProps<CsItem<T>>) => {
  const { axProps, renderCtrl } = props
  const { item, showRequiredTag } = axProps
  const hideLabel = axProps.hideLabel ?? false
  const labelPlacement = axProps.labelPlacement ?? "top"
  const labelWidth = axProps.labelWidth ?? 30
  const [refresh, setRefresh] = useState(false)

  useEffect(() => {
    if (refresh) {
      setRefresh(false)
    }
  }, [item.hasValidationError, refresh])
  return (
    (labelPlacement === "left") ? (
      <div>
        <div className={"input-container"}>
          {hideLabel ? (
            <div style={{ width: "100%" }}>{renderCtrl(setRefresh)}</div>
          ) : (
            <>
              <div style={{ width: labelWidth + "%" }}>
                <AxLabel label={getLabel(item, showRequiredTag)}></AxLabel>
              </div>
              <div style={{ width: 100 - labelWidth + "%" }}>{renderCtrl(setRefresh)}</div>
            </>
          )}
        </div>
        <div className={"input-container"}>
          <div style={{ width: hideLabel ? 0 : labelWidth + "%" }}></div>
          <ValidationError key={"validation-error-" + item.key} message={item.validationErrorMessage} />
        </div>
      </div>
    ) : (
      <div>
        {!hideLabel && <AxLabel label={getLabel(item, showRequiredTag)}></AxLabel>}
        {renderCtrl(setRefresh)}
        <ValidationError key={"validation-error-" + item.key} message={item.validationErrorMessage} />
      </div>
    )
  )
}
export interface AxInputTextProps extends AxProps<CsInputTextItem> {
  antdProps?: InputProps & React.RefAttributes<InputRef>
}

export const AxInputText = (props: AxInputTextProps) => {
  const { item, antdProps } = props
  return (
    <AxEditCtrl axProps={props}
      renderCtrl={(setRefresh) => (
        <Input className={getClassName(props)}
          value={item.value}
          readOnly={item.isReadonly()}
          onChange={(e) => {
            item.setValue(e.target.value)
            if (!item.validateWhenErrorExists(e.target.value)) {
              setRefresh(true)
            }
          }}
          onBlur={() => {
            if (item.parentView?.validateTrigger !== "onBlur") {
              return
            }
            if (!item.validate(item.value)) {
              setRefresh(true)
            }
          }}
          {...antdProps}
        />
      )}
    /> // AxEditCtrl
  )
}

export interface AxInputNumberProps extends AxProps<CsInputNumberItem> {
  antdProps?: InputNumberProps
}

export const AxInputNumber = (props: AxInputNumberProps) => {
  const { item, antdProps } = props
  return (
    <AxEditCtrl axProps={props}
      renderCtrl={(setRefresh) => (
        <InputNumber className={getClassName(props, "input-number")}
          value={item.value}
          readOnly={item.isReadonly()}
          onChange={(value: ValueType | null) => {
            if (value !== null) {
              item.setValue(Number(value))
              if (!item.validateWhenErrorExists(Number(value))) {
                setRefresh(true)
              }
            }
          }}
          onBlur={() => {
            if (item.parentView?.validateTrigger !== "onBlur") {
              return
            }
            if (!item.validate(item.value)) {
              setRefresh(true)
            }
          }}
          {...antdProps}
        />
      )}
    /> // AxEditCtrl
  )
}

export interface AxInputPasswordProps extends AxProps<CsInputPasswordItem> {
  antdProps?: InputProps & React.RefAttributes<InputRef>
}

export const AxInputPassword = (props: AxInputPasswordProps) => {
  const { item, antdProps } = props
  return (
    <AxEditCtrl axProps={props}
      renderCtrl={(setRefresh) => (
        <Input.Password className={getClassName(props)}
          value={item.value}
          readOnly={item.isReadonly()}
          onChange={(e) => {
            item.setValue(e.target.value)
            if (!item.validateWhenErrorExists(e.target.value)) {
              setRefresh(true)
            }
          }}
          onBlur={() => {
            if (item.parentView?.validateTrigger !== "onBlur") {
              return
            }
            if (!item.validate(item.value)) {
              setRefresh(true)
            }
          }}
          {...antdProps}
        />
      )}
    /> // AxEditCtrl
  )
}

export interface AxTextAreaProps extends AxProps<CsTextAreaItem> {
  antdProps?: TextAreaProps & React.RefAttributes<TextAreaRef>
}

export const AxTextArea = (props: AxTextAreaProps) => {
  const { item, antdProps } = props
  return (
    <AxEditCtrl axProps={props}
      renderCtrl={(setRefresh) => (
        <Input.TextArea className={getClassName(props, "textarea")}
          value={item.value}
          readOnly={item.isReadonly()}
          onChange={(e: ChangeEvent<HTMLTextAreaElement>) => {
            item.setValue(e.target.value)
            if (!item.validateWhenErrorExists(e.target.value)) {
              setRefresh(true)
            }
          }}
          onBlur={() => {
            if (item.parentView?.validateTrigger !== "onBlur") {
              return
            }
            if (!item.validate(item.value)) {
              setRefresh(true)
            }
          }}
          {...antdProps}
        />
      )}
    /> // AxEditCtrl
  )
}

interface AxSelectBoxCommonProps<V extends string | number, T extends CsHasOptionsItem<V>>
  extends AxProps<T> {
  antdProps?: SelectProps
}

const AxSelectBoxCommon = <V extends string | number, T extends CsHasOptionsItem<V>>(
  props: AxSelectBoxCommonProps<V, T>
) => {
  const { item, antdProps } = props
  return (
    <AxEditCtrl axProps={props}
      renderCtrl={(setRefresh) => (
        <Select className={getClassName(props, "fit-content")}
          value={item.value}
          onChange={(value: V) => {
            item.setValue(value)
            if (!item.validateWhenErrorExists(value)) {
              setRefresh(true)
            }
          }}
          onBlur={() => {
            if (item.parentView?.validateTrigger !== "onBlur") {
              return
            }
            if (!item.validate(item.value)) {
              setRefresh(true)
            }
          }}
          {...antdProps}
        >
          {item.options.map(o => {
            return (
              (!item.isReadonly() || (item.isReadonly() && item.value === o[item.optionValueKey])) ?
                <Select.Option key={o[item.optionValueKey]} value={o[item.optionValueKey]}>
                  {o[item.optionLabelKey]}
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

export interface AxSelectBoxProps
  extends AxSelectBoxCommonProps<string, CsSelectBoxItem> {
  antdProps?: SelectProps
}

export const AxSelectBox = (props: AxSelectBoxProps) => {
  return (<AxSelectBoxCommon<string, CsSelectBoxItem> {...props} />)
}

export interface AxSelectNumberBoxProps
  extends AxSelectBoxCommonProps<number, CsSelectNumberBoxItem> {
  antdProps?: SelectProps
}

export const AxSelectNumberBox = (props: AxSelectNumberBoxProps) => {
  return (<AxSelectBoxCommon<number, CsSelectNumberBoxItem> {...props} />)
}

export interface AxRadioBoxProps extends AxProps<CsRadioBoxItem> {
  antdProps?: RadioGroupProps
}

export const AxRadioBox = (props: AxRadioBoxProps) => {
  const { item, antdProps } = props
  return (
    <AxEditCtrl axProps={props}
      renderCtrl={(setRefresh) => (
        <Radio.Group className={getClassName(props, "fit-content")}
          value={item.value}
          onChange={(e) => {
            if (item.isReadonly()) return
            item.setValue(e.target.value)
            if (!item.validateWhenErrorExists(e.target.value)) {
              setRefresh(true)
            }
          }}
          onBlur={() => {
            if (item.parentView?.validateTrigger !== "onBlur") {
              return
            }
            if (!item.validate(item.value)) {
              setRefresh(true)
            }
          }}
          {...antdProps}
        >
          {item.options.map(o => {
            return (
              <Radio key={o[item.optionValueKey]} value={o[item.optionValueKey]}
                disabled={item.isReadonly() && item.value !== o[item.optionValueKey]}>
                {o[item.optionLabelKey]}
              </Radio>
            )
          })}
        </Radio.Group>
      )}
    /> // AxEditCtrl
  )
}

export interface AxCheckBoxProps extends AxProps<CsCheckBoxItem> {
  antdProps?: CheckboxProps
}

export const AxCheckBox = (props: AxCheckBoxProps) => {
  const { item, antdProps } = props
  return (
    <AxEditCtrl axProps={props}
      renderCtrl={() => (
        <Checkbox className={getClassName(props, "fit-content")} value={item.value} checked={item.value}
          onChange={(e) => {
            if (item.isReadonly()) return
            item.setValue(e.target.checked)
          }}
          {...antdProps}
        >
          {item.checkBoxText}
        </Checkbox>
      )}
    /> // AxEditCtrl
  )
}

export interface AxMultiCheckBoxProps extends AxProps<CsMultiCheckBoxItem> {
  antdProps?: CheckboxProps
}

export const AxMultiCheckBox = (props: AxMultiCheckBoxProps) => {
  const { item, antdProps } = props
  return (
    <AxEditCtrl axProps={props}
      renderCtrl={(setRefresh) => (
        <div
          className={getClassName(props, "fit-content")}
          onBlur={() => {
            if (item.parentView?.validateTrigger !== "onBlur") {
              return
            }
            if (!item.validate(item.value)) {
              setRefresh(true)
            }
          }}
        >
          {item.options.map(o => {
            const value = o[item.optionValueKey]
            const text = o[item.optionLabelKey]
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
                  if (!item.validateWhenErrorExists(newValue)) {
                    setRefresh(true)
                  }
                }}
                disabled={item.isReadonly() && !item.value?.includes(value)}
                {...antdProps}
              >
                {text}
              </Checkbox>
            )
          })}
        </div>
      )}
    /> // AxEditCtrl
  )
}