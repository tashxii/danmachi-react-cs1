//import { DatePicker, DatePickerProps, InputNumber, InputNumberProps, InputProps, InputRef } from "bs"
//import dayjs from "dayjs"
import dayjs from "dayjs"
import React from "react"
import { Form, FormControlProps } from "react-bootstrap"
import { FeedbackProps } from "react-bootstrap/esm/Feedback"
import { BsPrefixRefForwardingComponent } from "react-bootstrap/esm/helpers"
import { CsInputDateItem, CsInputNumberRangeItem } from "../../logics"
import { BSxEditCtrl, BSxProps, getClassName } from "./BSxCtrl"

export interface BSxInputDateProps extends BSxProps<CsInputDateItem> {
  bsProps?: BsPrefixRefForwardingComponent<"input", FormControlProps> & {
    Feedback: BsPrefixRefForwardingComponent<"div", FeedbackProps>
  }
}

export const BSxInputDate = (props: BSxInputDateProps) => {
  const { item, bsProps } = props
  const displayValue = (!item.value) ? ""
    : dayjs(item.value).format("YYYY-MM-DD")
  return (
    <BSxEditCtrl bsxProps={props}
      renderCtrl={(setRefresh) => (
        <Form.Control className={getClassName(props, "fit-content")}
          type="date"
          value={displayValue}
          onChange={(e: React.ChangeEvent<any>) => {
            if (item.isReadonly()) return
            const value = e.target.value
            const newValue = (!value) ? ""
              : dayjs(value).format(CsInputDateItem.dateValueFormat)
            item.setValue(newValue)
            if (!item.validateWhenErrorExists(newValue)) {
              setRefresh(true)
            }
          }}
          {...bsProps}
        />
      )}
    /> // BSxEditCtrl
  )
}

export interface BSxInputNumberRangeProps extends BSxProps<CsInputNumberRangeItem> {
  bsPropsLower?: BsPrefixRefForwardingComponent<"input", FormControlProps> & {
    Feedback: BsPrefixRefForwardingComponent<"div", FeedbackProps>
  }
  bsPropsUpper?: BsPrefixRefForwardingComponent<"input", FormControlProps> & {
    Feedback: BsPrefixRefForwardingComponent<"div", FeedbackProps>
  }
}

export const BSxInputNumberRange = (props: BSxInputNumberRangeProps) => {
  const { item, bsPropsLower, bsPropsUpper } = props
  return (
    <BSxEditCtrl bsxProps={props}
      renderCtrl={(setRefresh) => (
        <div style={{ display: "inline-flex" }}>
          <Form.Control className={getClassName(props, "input-number")}
            type="number"
            value={item.lowerValue}
            readOnly={item.isReadonly()}
            onChange={(e) => {
              const newValue = (e.target.value) ? e.target.value : undefined
              const newNumber = (newValue) ? Number(newValue) : undefined
              item.setLowerValue(newNumber)
              if (!item.validateWhenErrorExists([newNumber as number, item.upperValue as number])) {
                setRefresh(true)
              }
            }}
            onBlur={() => {
              if (!item.lowerValue) return
              if (item.upperValue && item.upperValue < item.lowerValue) {
                item.setUpperValue(item.lowerValue)
              }
            }}
            {...bsPropsLower}
          />
          <span style={{ verticalAlign: "middle", marginTop: "8px", marginLeft: "5px" }}> ～ </span>
          <Form.Control className={getClassName(props, "input-number")}
            type="number"
            value={item.upperValue}
            readOnly={item.isReadonly()}
            onChange={(e) => {
              const newValue = (e.target.value) ? e.target.value : undefined
              const newNumber = (newValue) ? Number(newValue) : undefined
              item.setUpperValue(newNumber)
              if (!item.validateWhenErrorExists([item.lowerValue as number, newNumber as number])) {
                setRefresh(true)
              }
            }}
            onBlur={() => {
              if (!item.upperValue) return
              if (item.lowerValue && item.lowerValue > item.upperValue) {
                item.setLowerValue(item.upperValue)
              }
            }}

            {...bsPropsUpper}
          />
        </div>
      )}
    /> // BSxEditCtrl
  )
}
