import React, { ReactNode, useEffect, useState } from "react"
import {
  CsCheckBoxItem, CsInputPasswordItem, CsRadioBoxItem,
  CsSelectBoxItem, CsTextAreaItem, CsInputTextItem,
  CsInputNumberItem, CsItem, CsItemBase,
  CsMultiCheckBoxItem,
} from "../../logics"
import "./MxCtrl.css"
import { ValidationError } from "../../../components/basics/ValidationError"
import {
  Checkbox, CheckboxProps, FormControl, FormControlLabel, FormGroup,
  Radio, RadioGroup, RadioGroupProps, Select, SelectProps, TextareaAutosize, TextareaAutosizeProps, Typography
} from "@mui/material"
import Chip from "@mui/material/Chip"
import TextField, { TextFieldProps } from "@mui/material/TextField"
import { SelectChangeEvent } from "@mui/material/Select"
import MenuItem from "@mui/material/MenuItem"
import { CsHasOptionsItem, CsSelectNumberBoxItem } from "../../logics"
import { CsArrayDataItem } from "../../logics/CsArrayDataView"

export interface MxProps<I extends CsItemBase> {
  item: I
  hideLabel?: boolean
  labelPlacement?: "top" | "left"
  labelWidth?: 5 | 10 | 15 | 20 | 25 | 30 | 35 | 40 | 45 | 50
  showRequiredTag?: "both" | "required" | "optional" | "none"
  addClassNames?: string[]
}

interface MxLabelProp {
  label: string | ReactNode
  color?: string
}

export const MxLabel = (props: MxLabelProp) => {
  const color = props.color ?? "#196e0bda"
  return (
    <div className="label"><Typography variant="subtitle2" style={{ color: color }}>{props.label}</Typography></div>
  )
}

export const getClassName = <T,>(props: MxProps<CsItem<T> | CsArrayDataItem>, add?: string): string => {
  let names = ["mui-ctrl"]
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

export const getLabel = <T,>(item: CsItem<T> | CsArrayDataItem, showRequiredTag?: "both" | "required" | "optional" | "none"): ReactNode => {
  const required = item.validationRule?.required ?? false
  const showTag = showRequiredTag ?? ((item.parentView) ? "both" : "none")
  const requiredTag = () => {
    switch (showTag) {
      case "both":
        return (<Chip variant="outlined" color={required ? "error" : "default"} label={required ? "必須" : "任意"} />)
      case "required":
        return (required && <Chip variant="outlined" size="small" color="error" label={"必須"} />)
      case "optional":
        return (!required && <Chip variant="outlined" size="small" color="default" label={"任意"} />)
    }
  }
  return (
    <span>
      {item.label}
      {requiredTag()}
    </span >
  )
}

export interface MxEditCtrlProps<T extends CsItemBase | CsArrayDataItem> {
  mxProps: MxProps<T>
  renderCtrl: (setRefresh: React.Dispatch<React.SetStateAction<boolean>>) => ReactNode
}

export const MxEditCtrl = <T,>(props: MxEditCtrlProps<CsItem<T> | CsArrayDataItem>) => {
  const { mxProps, renderCtrl } = props
  const { item, showRequiredTag } = mxProps
  const hideLabel = mxProps.hideLabel ?? false
  const labelPlacement = mxProps.labelPlacement ?? "top"
  const labelWidth = mxProps.labelWidth ?? 30
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
                <MxLabel label={getLabel(item, showRequiredTag)}></MxLabel>
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
      <>
        {!hideLabel && <MxLabel label={getLabel(item, showRequiredTag)}></MxLabel>}
        {renderCtrl(setRefresh)}
        <ValidationError key={"validation-error-" + item.key} message={item.validationErrorMessage} />
      </>
    )
  )
}

export interface MxInputTextProps extends MxProps<CsInputTextItem | CsArrayDataItem> {
  muiProps?: TextFieldProps
}

export const MxInputText = (props: MxInputTextProps) => {
  const { item, muiProps } = props
  return (
    <MxEditCtrl mxProps={props}
      renderCtrl={(setRefresh) => (
        <TextField className={getClassName(props)}
          value={item.value}
          inputProps={{ readOnly: item.isReadonly() }}
          onChange={(e: any) => {
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
          {...muiProps}
        />
      )}
    /> // MxEditCtrl
  )
}

export interface MxInputNumberProps extends MxProps<CsInputNumberItem | CsArrayDataItem> {
  muiProps?: TextFieldProps
}

export const MxInputNumber = (props: MxInputNumberProps) => {
  const { item, muiProps } = props
  return (
    <MxEditCtrl mxProps={props}
      renderCtrl={(setRefresh) => (
        <TextField className={getClassName(props, "input-number")}
          value={item.value}
          inputProps={{
            readOnly: item.isReadonly(),
          }}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
            const re = /^-?[0-9]+$/g
            const newValue = (e.target.value.length === 0) ? undefined : e.target.value
            if (newValue === undefined || re.test(newValue)) {
              const newNumber = (newValue) ? Number(newValue) : undefined
              item.setValue(newNumber)
              if (!item.validateWhenErrorExists(newNumber as number)) {
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
          {...muiProps}
        />
      )}
    /> // MxEditCtrl
  )
}

export interface MxInputPasswordProps extends MxProps<CsInputPasswordItem | CsArrayDataItem> {
  muiProps?: TextFieldProps
}

export const MxInputPassword = (props: MxInputPasswordProps) => {
  const { item, muiProps } = props
  return (
    <MxEditCtrl mxProps={props}
      renderCtrl={(setRefresh) => (
        <TextField className={getClassName(props)}
          value={item.value}
          inputProps={{
            readOnly: item.isReadonly(),
          }}
          type="password"
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
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
          {...muiProps}
        />
      )}
    /> // MxEditCtrl
  )
}

export interface MxTextAreaProps extends MxProps<CsTextAreaItem | CsArrayDataItem> {
  muiProps?: TextFieldProps
}

export const MxTextArea = (props: MxTextAreaProps) => {
  const { item, muiProps } = props
  return (
    <MxEditCtrl mxProps={props}
      renderCtrl={(setRefresh) => (
        <TextField className={getClassName(props, "textarea")}
          value={item.value}
          inputProps={{
            readOnly: item.isReadonly(),
            // https://github.com/mui/base-ui/issues/167
            inputComponent: "textarea",
          }}
          // Do not use multiline till this issue fixed ... https://github.com/mui/base-ui/issues/167
          // multiline
          // minRows={4}
          variant="outlined"
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
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
          {...muiProps}
        />
      )}
    /> // MxEditCtrl
  )
}

interface MxSelectBoxCommonProps<V extends string | number, T extends CsHasOptionsItem<V> | CsArrayDataItem>
  extends MxProps<T> {
  muiProps?: SelectProps<V>
}

const MxSelectBoxCommon = <V extends string | number, T extends CsHasOptionsItem<V> | CsArrayDataItem>(
  props: MxSelectBoxCommonProps<V, T>,
  toValue: (value: string) => V | undefined
) => {
  const { item, muiProps } = props

  return (
    <MxEditCtrl mxProps={props}
      renderCtrl={(setRefresh) => (
        <Select className={getClassName(props, "fit-content")}
          value={item.value}
          onChange={(e: SelectChangeEvent<V>) => {
            const newValue = (e.target.value) ? e.target.value.toString() : ""
            item.setValue(toValue(newValue))
            if (!item.validateWhenErrorExists(toValue(newValue) as V)) {
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
          {...muiProps}
        >
          {item.options.map(o => {
            return (
              (!item.isReadonly() || (item.isReadonly() && item.value === o[item.optionValueKey])) ?
                <MenuItem key={o[item.optionValueKey]} value={o[item.optionValueKey]}>
                  {o[item.optionLabelKey]}
                </MenuItem>
                : null
            )
          })
          }
        </Select>
      )}
    /> // MxEditCtrl
  )
}
export interface MxSelectBoxProps
  extends MxSelectBoxCommonProps<string, CsSelectBoxItem | CsArrayDataItem> {
  muiProps?: SelectProps<string>
}

export const MxSelectBox = (props: MxSelectBoxProps) => {
  return (MxSelectBoxCommon<string, CsSelectBoxItem | CsArrayDataItem>(
    props, (value: string) => (value)))
}

export interface MxSelectNumberBoxProps
  extends MxSelectBoxCommonProps<number, CsSelectNumberBoxItem | CsArrayDataItem> {
  muiProps?: SelectProps<number>
}

export const MxSelectNumberBox = (props: MxSelectNumberBoxProps) => {
  return (MxSelectBoxCommon<number, CsSelectNumberBoxItem | CsArrayDataItem>(
    props, (value: string) => (Number(value))))
}

export interface MxRadioBoxProps extends MxProps<CsRadioBoxItem | CsArrayDataItem> {
  muiProps?: RadioGroupProps & React.RefAttributes<HTMLDivElement>
}

export const MxRadioBox = (props: MxRadioBoxProps) => {
  const { item, muiProps } = props
  return (
    <MxEditCtrl mxProps={props}
      renderCtrl={(setRefresh) => (
        <FormControl id={item.key}>
          <RadioGroup className={getClassName(props, "fit-content")}
            row
            value={item.value}
            name={"radio-group-" + item.key}
            onChange={(e, value: string) => {
              if (item.isReadonly()) return
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
            {...muiProps}
          >
            {item.options.map(o => {
              const selected = (o[item.optionValueKey] === item.value)
              return (
                <FormControlLabel key={o[item.optionValueKey]}
                  value={o[item.optionValueKey]}
                  control={
                    <Radio key={o[item.optionValueKey]}
                      readOnly={(item.isReadonly())}
                      disabled={(item.isReadonly() && !selected)} />}
                  label={o[item.optionLabelKey]} />
              )
            })}
          </RadioGroup>
        </FormControl>
      )}
    /> // MxEditCtrl
  )
}

export interface MxCheckBoxProps extends MxProps<CsCheckBoxItem | CsArrayDataItem> {
  muiProps?: CheckboxProps
}

export const MxCheckBox = (props: MxCheckBoxProps) => {
  const { item, muiProps } = props
  return (
    <MxEditCtrl mxProps={props}
      renderCtrl={(setRefresh) => (
        <div className={getClassName(props, "fit-content")}>
          <FormGroup
            className="checkbox-item"
            onBlur={() => {
              if (item.parentView?.validateTrigger !== "onBlur") {
                return
              }
              if (!item.validate(item.value)) {
                setRefresh(true)
              }
            }}
          >
            <FormControlLabel
              control={
                <Checkbox className="checkbox-item"
                  value={item.value} checked={item.value}
                  onChange={(e, checked) => {
                    if (item.isReadonly()) return
                    item.setValue(checked)
                  }}
                  {...muiProps}
                />
              }
              label={item.checkBoxText}
            />
          </FormGroup>
        </div>
      )}
    /> // MxEditCtrl
  )
}

export interface MxMultiCheckBoxProps extends MxProps<CsMultiCheckBoxItem | CsArrayDataItem> {
  muiProps?: CheckboxProps
}

export const MxMultiCheckBox = (props: MxMultiCheckBoxProps) => {
  const { item, muiProps } = props
  return (
    <MxEditCtrl mxProps={props}
      renderCtrl={(setRefresh) => (
        <div className={getClassName(props, "fit-content")}>
          <FormGroup
            className="checkbox-group"
            onBlur={() => {
              if (item.parentView?.validateTrigger !== "onBlur") {
                return
              }
              if (!item.validate(item.value)) {
                setRefresh(true)
              }
            }}>
            {item.options.map(o => {
              const value = o[item.optionValueKey]
              const text = o[item.optionLabelKey]
              return (
                <FormControlLabel
                  key={value}
                  control={
                    <Checkbox
                      className="checkbox-item" key={value} value={value}
                      checked={item.value?.includes(value)}
                      onChange={(e, checked) => {
                        if (item.isReadonly()) return
                        let newValue: string[]
                        if (checked) {
                          newValue = (item.value) ? item.value?.concat(value) : []
                        } else {
                          const values: string[] = item.value as string[]
                          newValue = (values) ? values.filter((v: string) => v !== value) : []
                        }
                        item.setValue(newValue)
                        if (!item.validateWhenErrorExists(newValue)) {
                          setRefresh(true)
                        }
                      }}
                      disabled={item.isReadonly() && !item.value?.includes(value)}
                      {...muiProps}
                    />
                  }
                  label={text}
                />
              )
            })}
          </FormGroup>
        </div>
      )}
    /> // MxEditCtrl
  )
}