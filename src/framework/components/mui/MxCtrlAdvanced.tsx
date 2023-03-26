import { TextField, TextFieldProps } from "@mui/material"
import { DatePicker, DatePickerProps } from "@mui/x-date-pickers"
import dayjs from "dayjs"
import React from "react"
import { CsInputDateItem, CsInputNumberRangeItem } from "../../logics"
import { getClassName, MxEditCtrl, MxProps } from "./MxCtrl"

export interface MxInputDateProps extends MxProps<CsInputDateItem> {
  muiProps?: DatePickerProps<dayjs.Dayjs>
}

export const MxInputDate = (props: MxInputDateProps) => {
  const { item, muiProps } = props
  const valueDayjs = (!item.value) ? dayjs("Invalid Date")
    : dayjs(item.value, CsInputDateItem.dateValueFormat)
  return (
    <MxEditCtrl<string> mxProps={props}
      renderCtrl={(setRefresh) => (
        <DatePicker className={getClassName(props)}
          value={valueDayjs}
          format={CsInputDateItem.dateDisplayFormat}
          onChange={(value: dayjs.Dayjs | null) => {
            const newValue = (!value || !(value.isValid())) ? undefined
              : value.format(CsInputDateItem.dateValueFormat)
            item.setValue(newValue)
            if (!item.validateWhenErrorExists(newValue as string)) {
              setRefresh(true)
            }
          }}
          {...muiProps}
        />
      )
      }
    /> // MxEditCtrl
  )
}

export interface MxInputNumberRangeProps extends MxProps<CsInputNumberRangeItem> {
  muiPropsLower?: TextFieldProps
  muiPropsUpper?: TextFieldProps
}

export const MxInputNumberRange = (props: MxInputNumberRangeProps) => {
  const { item, muiPropsLower, muiPropsUpper } = props
  return (
    <MxEditCtrl mxProps={props}
      renderCtrl={(setRefresh) => (
        <div style={{ display: "inline-block" }}>
          <TextField className={getClassName(props, "input-number")}
            value={item.lowerValue}
            inputProps={{
              readOnly: item.isReadonly(),
            }}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
              const re = /^-?[0-9]+$/g;
              const newValue = (e.target.value.length === 0) ? undefined : e.target.value
              if (newValue === undefined || re.test(newValue)) {
                const newNumber = (newValue) ? Number(newValue) : undefined
                item.setLowerValue(newNumber)
                if (!item.validateWhenErrorExists([newNumber as number, item.upperValue as number])) {
                  setRefresh(true)
                }
              }
            }}
            onBlur={() => {
              if (!item.lowerValue) return
              if (item.upperValue && item.upperValue < item.lowerValue) {
                item.setUpperValue(item.lowerValue)
              }
            }}
            {...muiPropsLower}
          />
          <div style={{ display: "inline-block", margin: "10px 2px 12px 10px", verticalAlign: "middle" }}> ～ </div>
          <TextField className={getClassName(props, "input-number")}
            value={item.upperValue}
            inputProps={{
              readOnly: item.isReadonly(),
            }}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
              const re = /^-?[0-9]+$/g;
              const newValue = (e.target.value.length === 0) ? undefined : e.target.value
              if (newValue === undefined || re.test(newValue)) {
                const newNumber = (newValue) ? Number(newValue) : undefined
                item.setUpperValue(newNumber)
                if (!item.validateWhenErrorExists([item.lowerValue as number, newNumber as number])) {
                  setRefresh(true)
                }
              }
            }}
            onBlur={() => {
              if (!item.upperValue) return
              if (item.lowerValue && item.lowerValue > item.upperValue) {
                item.setLowerValue(item.upperValue)
              }
            }}
            {...muiPropsUpper}
          />
        </div>
      )}
    /> // AxEditCtrl
  )
}
