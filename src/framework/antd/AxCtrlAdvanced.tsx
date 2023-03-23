import { DatePicker, DatePickerProps, InputNumber, InputNumberProps, InputProps, InputRef } from "antd"
import dayjs from "dayjs"
import React from "react"
import { CsInputDateItem, CsInputNumberRangeItem } from "../cs/CsItemAdvanced"
import { AxProps, AxEditCtrl, getClassName, validateWhenErrroExists } from "./AxCtrl"

export interface AxInputDateProps extends AxProps<CsInputDateItem> {
  antdProps?: DatePickerProps
}

export const AxInputDate = (props: AxInputDateProps) => {
  const { item, antdProps } = props
  return (
    <AxEditCtrl axProps={props}
      renderCtrl={(setRefresh) => (
        <DatePicker className={getClassName(props, "fit-content")}
          value={(item.value) ? dayjs(item.value) : undefined}
          format={CsInputDateItem.dateDisplayFormat}
          onChange={(value: dayjs.Dayjs | null, dateString: string) => {
            if (item.isReadonly()) return
            const newValue = value?.format(CsInputDateItem.dateValueFormat)
            item.setValue(newValue)
            if (!validateWhenErrroExists(newValue ?? "", item)) {
              setRefresh(true)
            }
          }}
          {...antdProps}
        />
      )}
    /> // AxEditCtrl
  )
}

export interface AxInputNumberRangeProps extends AxProps<CsInputNumberRangeItem> {
  antdPropsLower?: InputNumberProps
  antdPropsUpper?: InputNumberProps
}

export const AxInputNumberRange = (props: AxInputNumberRangeProps) => {
  const { item, antdPropsLower, antdPropsUpper } = props
  return (
    <AxEditCtrl axProps={props}
      renderCtrl={(setRefresh) => (
        <div style={{ display: "inline-block" }}>
          <InputNumber className={getClassName(props, "input-number")}
            value={item.lowerValue} defaultValue={item.lowerValue}
            readOnly={item.isReadonly()}
            onChange={(value) => {
              const newValue = (value) ? value : undefined
              item.setLowerValue(newValue as number)
              if (!validateWhenErrroExists([newValue as number, item.upperValue as number], item)) {
                setRefresh(true)
              }
            }}
            onBlur={() => {
              if (!item.lowerValue) return
              if (item.upperValue && item.upperValue < item.lowerValue) {
                item.setUpperValue(item.lowerValue)
              }
            }}
            {...antdPropsLower}
          />
          <span> ～ </span>
          <InputNumber className={getClassName(props, "input-number")}
            value={item.upperValue} defaultValue={item.upperValue}
            readOnly={item.isReadonly()}
            onChange={(value) => {
              const newValue = (value) ? value : undefined
              item.setUpperValue(newValue as number)
              if (!validateWhenErrroExists([item.lowerValue as number, newValue as number], item)) {
                setRefresh(true)
              }
            }}
            onBlur={() => {
              if (!item.upperValue) return
              if (item.lowerValue && item.lowerValue > item.upperValue) {
                item.setLowerValue(item.upperValue)
              }
            }}

            {...antdPropsUpper}
          />
        </div>
      )}
    /> // AxEditCtrl
  )
}
