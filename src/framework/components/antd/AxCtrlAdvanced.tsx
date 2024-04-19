import { DatePicker, DatePickerProps, GetProps, InputNumber, InputNumberProps } from "antd"
import dayjs, { Dayjs } from "dayjs"
import React from "react"
import { CsInputDateItem, CsInputDateRangeItem, CsInputNumberRangeItem } from "../../logics"
import { AxProps, AxEditCtrl, getClassName } from "./AxCtrl"

const { RangePicker } = DatePicker
type RangePickerProps = GetProps<typeof DatePicker.RangePicker>

export interface AxInputDateProps extends AxProps<CsInputDateItem> {
  antdProps?: DatePickerProps
}

export const AxInputDate = (props: AxInputDateProps) => {
  const { item, antdProps } = props
  return (
    <AxEditCtrl axProps={props}
      renderCtrl={(setRefresh) => (
        <div
          onBlur={() => {
            if (item.parentView?.validateTrigger !== "onBlur") {
              return
            }
            if (!item.validate(item.value)) {
              setRefresh(true)
            }
          }}
        >
          <DatePicker className={getClassName(props, "fit-content")}
            value={(item.value) ? dayjs(item.value) : undefined}
            format={item.displayFormat}
            onChange={(value: Dayjs, dateString: string | string[]) => {
              if (item.isReadonly()) return
              const newValue = value?.format(item.valueFormat)
              item.setValue(newValue)
              if (!item.validateWhenErrorExists(newValue ?? "")) {
                setRefresh(true)
              }
            }}
            {...antdProps}
          />
        </div>
      )}
    /> // AxEditCtrl
  )
}

export interface AxInputDateRangeProp extends AxProps<CsInputDateRangeItem> {
  antdProps?: RangePickerProps
}

export const AxInputDateRange = (props: AxInputDateRangeProp) => {
  const { item, antdProps } = props
  const from = item.value?.at(0) ? dayjs(item.lowerValue) : undefined
  const to = item.value?.at(1) ? dayjs(item.upperValue) : undefined
  return (
    <AxEditCtrl
      axProps={props}
      renderCtrl={(setRefresh) => (
        <RangePicker
          className={getClassName(props, "fit-content")}
          onCalendarChange={(dates, _, __) => {
            if (item.isReadonly()) {
              return
            }
            const newFrom = dates && dates.length === 2 ? dates[0]?.format(item.valueFormat) : undefined
            const newTo = dates && dates.length === 2 ? dates[1]?.format(item.valueFormat) : undefined
            const newValue = [newFrom ?? "", newTo ?? ""]
            item.setValue(newValue)
            if (!item.validateWhenErrorExists(newValue)) {
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
          allowClear={!item.validationRule.required}
          defaultValue={[from, to] as [dayjs.Dayjs, dayjs.Dayjs]}
          format={item.displayFormat}
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
            value={item.lowerValue}
            readOnly={item.isReadonly()}
            onChange={(value) => {
              const newValue = (value) ? value : undefined
              item.setLowerValue(newValue as number)
              if (!item.validateWhenErrorExists([newValue as number, item.upperValue as number])) {
                setRefresh(true)
              }
            }}
            onBlur={() => {
              if (!item.lowerValue) return
              if (item.upperValue && item.upperValue < item.lowerValue) {
                item.setUpperValue(item.lowerValue)
              }
              if (item.parentView?.validateTrigger !== "onBlur") {
                return
              }
              if (!item.validate(item.value)) {
                setRefresh(true)
              }
            }}
            {...antdPropsLower}
          />
          <span> ～ </span>
          <InputNumber className={getClassName(props, "input-number")}
            value={item.upperValue}
            readOnly={item.isReadonly()}
            onChange={(value) => {
              const newValue = (value) ? value : undefined
              item.setUpperValue(newValue as number)
              if (!item.validateWhenErrorExists([item.lowerValue as number, newValue as number])) {
                setRefresh(true)
              }
            }}
            onBlur={() => {
              if (!item.upperValue) return
              if (item.lowerValue && item.lowerValue > item.upperValue) {
                item.setLowerValue(item.upperValue)
              }
              if (item.parentView?.validateTrigger !== "onBlur") {
                return
              }
              if (!item.validate(item.value)) {
                setRefresh(true)
              }
            }}
            {...antdPropsUpper}
          />
        </div>
      )}
    /> // AxEditCtrl
  )
}
