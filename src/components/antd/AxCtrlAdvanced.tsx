import { DatePicker, DatePickerProps, InputProps, InputRef } from "antd"
import dayjs from "dayjs"
import React from "react"
import { CsInputDateItem } from "../../framework/cs/CsItemAdvanced"
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
          value={dayjs(item.value)}
          //defaultValue={item.value}
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
