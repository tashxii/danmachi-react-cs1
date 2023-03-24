import React, { ReactNode, useEffect, useState } from 'react'
import {
  CsCheckBoxItem, CsInputPassword, CsRadioBoxItem,
  CsSelectBoxItem, CsTextAreaItem, CsInputTextItem,
  CsInputNumberItem, CsItem, CsItemBase,
  CsMultiCheckBoxItem,
} from '../cs'
import "./BSxCtrl.css"
import { ValidationError } from '../../components/basics/ValidationError'
import { Badge, Form, FormControlProps, FormGroupProps, FormSelectProps } from 'react-bootstrap'
import { BsPrefixRefForwardingComponent } from 'react-bootstrap/esm/helpers'
import { FeedbackProps } from 'react-bootstrap/esm/Feedback'

export interface BSxProps<I extends CsItemBase> {
  item: I
  showRequiredTag?: "both" | "required" | "optional" | "none"
  addClassNames?: string[]
}

interface BSxLabelProp {
  label: string | ReactNode
  color?: string
}

export const BSxLabel = (props: BSxLabelProp) => {
  const color = props.color ?? "#e9900c"
  return (
    <div className="label"><Form.Label style={{ color: color }}>{props.label}</Form.Label></div>
  )
}

export const getClassName = <T,>(props: BSxProps<CsItem<T>>, add?: string): string => {
  let names = ["bsx-ctrl"]
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
  const required = item.ValidationRule?.required ?? false
  const showTag = showRequiredTag ?? ((item.parentView) ? "both" : "none")
  const requiredTag = () => {
    switch (showTag) {
      case "both":
        return (<Badge pill bg="light" text={required ? "danger" : "dark"}>{required ? "必須" : "任意"}</Badge>)
      case "required":
        return (required && <Badge pill bg="light" text="danger">{"必須"}</Badge>)
      case "optional":
        return (!required && <Badge pill bg="light" text="dark">{"任意"}</Badge>)
    }
  }
  return (
    <span>
      {item.label}
      {requiredTag()}
    </span >
  )
}

export const validateWhenErrroExists = <T extends string | number | number[] | string[]>(newValue: T, item: CsItem<T>) => {
  const validateEvent = item.parentView?.validateEvent
  if (!validateEvent) {
    return
  }
  if (!validateEvent.validationError[item.key]) {
    return
  }
  return validateEvent.onItemValidateHasError(newValue, item)
}

export interface BSxEditCtrlProps<T extends CsItemBase> {
  bsxProps: BSxProps<T>
  renderCtrl: (setRefresh: React.Dispatch<React.SetStateAction<boolean>>) => ReactNode
}

export const BSxEditCtrl = <T,>(props: BSxEditCtrlProps<CsItem<T>>) => {
  const { bsxProps, renderCtrl } = props
  const { item, showRequiredTag } = bsxProps
  const [refresh, setRefresh] = useState(false)

  useEffect(() => {
    if (refresh) {
      setRefresh(false)
    }
  }, [item.hasValidationError, refresh])

  return (
    <div>
      <BSxLabel label={getLabel(item, showRequiredTag)}></BSxLabel>
      {renderCtrl(setRefresh)}
      <ValidationError message={item.validationErrorMessage} />
    </div>
  )
}

export interface BSxInputTextProps extends BSxProps<CsInputTextItem> {
  bsProps?: BsPrefixRefForwardingComponent<"input", FormControlProps> & {
    Feedback: BsPrefixRefForwardingComponent<"div", FeedbackProps>
  }
}

export const BSxInputText = (props: BSxInputTextProps) => {
  const { item, bsProps } = props
  return (
    <BSxEditCtrl bsxProps={props}
      renderCtrl={(setRefresh) => (
        <Form.Control className={getClassName(props)}
          as="input"
          value={item.value}
          readOnly={item.isReadonly()}
          onChange={(e) => {
            item.setValue(e.target.value)
            if (!validateWhenErrroExists(e.target.value, item)) {
              setRefresh(true)
            }
          }}
          {...bsProps}
        />
      )}
    /> // BSxEditCtrl
  )
}

export interface BSxInputNumberProps extends BSxProps<CsInputNumberItem> {
  bsProps?: BsPrefixRefForwardingComponent<"input", FormControlProps> & {
    Feedback: BsPrefixRefForwardingComponent<"div", FeedbackProps>
  }
}

export const BSxInputNumber = (props: BSxInputNumberProps) => {
  const { item, bsProps } = props
  return (
    <BSxEditCtrl bsxProps={props}
      renderCtrl={(setRefresh) => (
        <Form.Control className={getClassName(props, "input-number")}
          type="number"
          value={item.value}
          readOnly={item.isReadonly()}
          onChange={(e) => {
            const newValue = (e.target.value) ? e.target.value : undefined
            const newNumber = (newValue) ? Number(newValue) : undefined
            item.setValue(newNumber)
            if (!validateWhenErrroExists(newNumber as number, item)) {
              setRefresh(true)
            }
          }}
          {...bsProps}
        />
      )}
    /> // BSxEditCtrl
  )
}

export interface BSxInputPasswordProps extends BSxProps<CsInputPassword> {
  bsProps?: BsPrefixRefForwardingComponent<"input", FormControlProps> & {
    Feedback: BsPrefixRefForwardingComponent<"div", FeedbackProps>
  }
}

export const BSxInputPassword = (props: BSxInputPasswordProps) => {
  const { item, bsProps } = props
  return (
    <BSxEditCtrl bsxProps={props}
      renderCtrl={(setRefresh) => (
        <Form.Control className={getClassName(props)}
          type="password"
          value={item.value}
          readOnly={item.isReadonly()}
          onChange={(e) => {
            item.setValue(e.target.value)
            if (!validateWhenErrroExists(e.target.value, item)) {
              setRefresh(true)
            }
          }}
          {...bsProps}
        />
      )} /> // BSxEditCtrl
  )
}

export interface BSxTextAreaProps extends BSxProps<CsTextAreaItem> {
  bsProps?: BsPrefixRefForwardingComponent<"input", FormControlProps> & {
    Feedback: BsPrefixRefForwardingComponent<"div", FeedbackProps>
  }
}

export const BSxTextArea = (props: BSxTextAreaProps) => {
  const { item, bsProps } = props
  return (
    <BSxEditCtrl bsxProps={props}
      renderCtrl={(setRefresh) => (
        <Form.Control className={getClassName(props, "textarea")}
          as="textarea"
          value={item.value}
          readOnly={item.isReadonly()}
          onChange={(e) => {
            item.setValue(e.target.value)
            if (!validateWhenErrroExists(e.target.value, item)) {
              setRefresh(true)
            }
          }}
          {...bsProps}
        />
      )}
    /> // BSxEditCtrl
  )
}

export interface BSxSelectBoxProps<T extends string | number> extends BSxProps<CsSelectBoxItem<T>> {
  bsProps?: BsPrefixRefForwardingComponent<"select", FormSelectProps>
}

export const BSxSelectBox = <T extends string | number = string>(props: BSxSelectBoxProps<T>) => {
  const { item, bsProps } = props
  return (
    <BSxEditCtrl bsxProps={props}
      renderCtrl={(setRefresh) => (
        <Form.Select className={getClassName(props, "fit-content")}
          value={item.value}
          onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
            const newValue = e.target.value
            item.setValue(newValue as T | undefined)
            if (!validateWhenErrroExists(newValue as T, item)) {
              setRefresh(true)
            }
          }}
          {...bsProps}
        >
          {item.options.map(o => {
            const value = o[item.optionValueKey]
            const label = o[item.optionLabelKey]
            return (
              (!item.isReadonly() || (item.isReadonly() && item.value === value)) ?
                <option key={value} value={value}>
                  {label}
                </option>
                : null
            )
          })
          }
        </Form.Select>
      )}
    /> // BSxEditCtrl
  )
}

export interface BSxSelectNumberBoxProps extends BSxSelectBoxProps<number> {
  bsProps?: BsPrefixRefForwardingComponent<"select", FormSelectProps>
}

export const BSxSelectNumberBox = (props: BSxSelectNumberBoxProps) => {
  return (<BSxSelectBox<number> {...props} />)
}

export interface BSxRadioBoxProps extends BSxProps<CsRadioBoxItem> {
  bsProps?: BsPrefixRefForwardingComponent<"div", FormGroupProps>
}

export const BSxRadioBox = (props: BSxRadioBoxProps) => {
  const { item, bsProps } = props
  return (
    <BSxEditCtrl bsxProps={props}
      renderCtrl={(setRefresh) => (
        <Form.Group className={getClassName(props, "fit-content checkbox-area")}
          {...bsProps}
        >
          {item.options.map(o => {
            const value = o[item.optionValueKey]
            const label = o[item.optionLabelKey]
            return (
              <Form.Check className="checkbox-item" key={value}
                type="radio"
                value={value}
                label={label}
                disabled={item.isReadonly() && item.value !== value}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  item.setValue(e.target.value)
                }}
                checked={item.value === value}
              />
            )
          })}
        </Form.Group>
      )}
    /> // BSxEditCtrl
  )
}

export interface BSxCheckBoxProps extends BSxProps<CsCheckBoxItem> {
  bsProps?: BsPrefixRefForwardingComponent<"div", FormGroupProps>
}

export const BSxCheckBox = (props: BSxCheckBoxProps) => {
  const { item, bsProps } = props
  return (
    <BSxEditCtrl bsxProps={props}
      renderCtrl={() => (
        <Form.Group className={getClassName(props, "fit-content")}
          onChange={(e: React.FormEvent<HTMLElement>) => {
            if (item.isReadonly()) return
            console.log("checkbox", e)
            const newValue = (e) ? undefined : undefined
            item.setValue(newValue)
          }}
          {...bsProps}
        >
          <Form.Check
            type="checkbox"
            label={item.checkBoxText}
            defaultChecked={item.isChecked()}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              item.setValue(e.target.checked)
            }}
            disabled={item.isReadonly()}
          />
        </Form.Group>
      )}
    /> // BSxEditCtrl
  )
}

export interface BSxMultiCheckBoxProps extends BSxProps<CsMultiCheckBoxItem> {
  bsProps?: BsPrefixRefForwardingComponent<"div", FormGroupProps>
}

export const BSxMultiCheckBox = (props: BSxMultiCheckBoxProps) => {
  const { item, bsProps } = props
  return (
    <BSxEditCtrl bsxProps={props}
      renderCtrl={(setRefresh) => (
        <Form.Group className={getClassName(props, "fit-content checkbox-area")}>
          {item.options.map(o => {
            const value = o[item.optionValueKey]
            const text = o[item.optionLabelKey]
            return (
              <Form.Check
                className="checkbox-item" key={value}
                value={value}
                type="checkbox"
                defaultChecked={item.value?.includes(value)}
                label={text}
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
                disabled={item.isReadonly() && !item.value?.includes(value)}
                {...bsProps}
              />
            )
          })}
        </Form.Group>
      )}
    /> // BSxEditCtrl
  )
}