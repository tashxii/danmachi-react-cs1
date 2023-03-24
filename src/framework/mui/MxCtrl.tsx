import React, { ChangeEvent, ReactNode, useEffect, useState } from 'react'
import {
  CsCheckBoxItem, CsInputPassword, CsRadioBoxItem,
  CsSelectBoxItem, CsTextAreaItem, CsInputTextItem,
  CsInputNumberItem, CsItem, CsItemBase,
  CsMultiCheckBoxItem,
} from '../cs'
import "./MxCtrl.css"
import { ValidationError } from '../../components/basics/ValidationError'
import { Checkbox, CheckboxProps, FormControl, FormControlLabel, FormGroup, FormLabel, Input, Radio, RadioGroup, RadioGroupProps, Select, SelectProps, Typography } from '@mui/material'
import Chip from '@mui/material/Chip'
import { InputProps } from '@mui/material/Input'
import TextField, { TextFieldProps } from '@mui/material/TextField'
import TextareaAutosize, { TextareaAutosizeProps } from '@mui/material/TextareaAutosize'
import { SelectChangeEvent } from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import { CsRIView } from '../cs/CsView'

//const { Text } = Typography

export interface MxProps<I extends CsItemBase> {
  item: I
  showRequiredTag?: "both" | "required" | "optional" | "none"
  addClassNames?: string[]
}

interface MxLabelProp {
  label: string | ReactNode
  color?: string
}

export const MxLabel = (props: MxLabelProp) => {
  const color = props.color ?? "#195e0bda"
  return (
    <div className="label"><Typography variant="subtitle2" style={{ color: color }}>{props.label}</Typography></div>
  )
}

export const getClassName = <T,>(props: MxProps<CsItem<T>>, add?: string): string => {
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

export const getLabel = <T,>(item: CsItem<T>, showRequiredTag?: "both" | "required" | "optional" | "none"): ReactNode => {
  const required = item.ValidationRule?.required ?? false
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

export const validateWhenErrroExists = <T extends string | number | number[] | string[]>(newValue: T, item: CsItem<T>) => {
  if (item.parentView instanceof CsRIView) {
    const validateEvent = item.parentView?.validateEvent
    if (!validateEvent) {
      return
    }
    if (!validateEvent.validationError[item.key]) {
      return
    }
    return validateEvent.onItemValidateHasError(newValue, item)
  }
  return false
}

export interface MxEditCtrlProps<T extends CsItemBase> {
  mxProps: MxProps<T>
  renderCtrl: (setRefresh: React.Dispatch<React.SetStateAction<boolean>>) => ReactNode
}

export const MxEditCtrl = <T,>(props: MxEditCtrlProps<CsItem<T>>) => {
  const { mxProps, renderCtrl } = props
  const { item, showRequiredTag } = mxProps
  const [refresh, setRefresh] = useState(false)

  useEffect(() => {
    if (refresh) {
      setRefresh(false)
    }
  }, [item.hasValidationError, refresh])

  return (
    <>
      <MxLabel label={getLabel(item, showRequiredTag)}></MxLabel>
      {renderCtrl(setRefresh)}
      <ValidationError message={item.validationErrorMessage} />
    </>
  )
}

export interface MxInputTextProps extends MxProps<CsInputTextItem> {
  muiProps?: InputProps
}

export const MxInputText = (props: MxInputTextProps) => {
  const { item, muiProps } = props
  return (
    <MxEditCtrl mxProps={props}
      renderCtrl={(setRefresh) => (
        <Input className={getClassName(props)}
          value={item.value} defaultValue={item.value}
          readOnly={item.isReadonly()}
          onChange={(e: any) => {
            item.setValue(e.target.value)
            if (!validateWhenErrroExists(e.target.value, item)) {
              setRefresh(true)
            }
          }}
          {...muiProps}
        />
      )}
    /> // MxEditCtrl
  )
}

export interface MxInputNumberProps extends MxProps<CsInputNumberItem> {
  muiProps?: InputProps
}

export const MxInputNumber = (props: MxInputNumberProps) => {
  const { item, muiProps } = props
  return (
    <MxEditCtrl mxProps={props}
      renderCtrl={(setRefresh) => (
        <Input className={getClassName(props, "input-number")}
          value={item.value} defaultValue={item.value}
          readOnly={item.isReadonly()}
          inputMode="numeric"
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
            item.setValue(Number(e.target.value))
            if (!validateWhenErrroExists(Number(e.target.value), item)) {
              setRefresh(true)
            }
          }
          }
          {...muiProps}
        />
      )}
    /> // MxEditCtrl
  )
}

export interface MxInputPasswordProps extends MxProps<CsInputPassword> {
  muiProps?: TextFieldProps
}

export const MxInputPassword = (props: MxInputPasswordProps) => {
  const { item, muiProps } = props
  return (
    <MxEditCtrl mxProps={props}
      renderCtrl={(setRefresh) => (
        <TextField className={getClassName(props)}
          value={item.value} defaultValue={item.value}
          type="password"
          onChange={(e: any) => {
            item.setValue(e.target.value)
            if (!validateWhenErrroExists(e.target.value, item)) {
              setRefresh(true)
            }
          }}
          {...muiProps}
        />
      )}
    /> // MxEditCtrl
  )
}

export interface MxTextAreaProps extends MxProps<CsTextAreaItem> {
  muiProps?: TextareaAutosizeProps
}

export const MxTextArea = (props: MxTextAreaProps) => {
  const { item, muiProps } = props
  return (
    <MxEditCtrl mxProps={props}
      renderCtrl={(setRefresh) => (
        <TextareaAutosize className={getClassName(props, "textarea")}
          value={item.value} defaultValue={item.value}
          minRows={4}
          readOnly={item.isReadonly()}
          onChange={(e: ChangeEvent<HTMLTextAreaElement>) => {
            item.setValue(e.target.value)
            if (!validateWhenErrroExists(e.target.value, item)) {
              setRefresh(true)
            }
          }}
          {...muiProps}
        />
      )}
    /> // MxEditCtrl
  )
}

export interface MxSelectBoxProps<T extends string | number = string> extends MxProps<CsSelectBoxItem<T>> {
  muiProps?: SelectProps<T>
}

export const MxSelectBox = <T extends string | number = string>(props: MxSelectBoxProps<T>) => {
  const { item, muiProps } = props
  return (
    <MxEditCtrl mxProps={props}
      renderCtrl={(setRefresh) => (
        <Select className={getClassName(props, "fit-content")}
          value={item.value} // defaultValue={item.value}
          onChange={(e: SelectChangeEvent<T>) => {
            item.setValue(e.target.value as T | undefined)
            if (!validateWhenErrroExists(e.target.value as T, item)) {
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

export interface MxSelectNumberBoxProps extends MxSelectBoxProps<number> {
  muiProps?: SelectProps<number>
}

export const MxSelectNumberBox = (props: MxSelectNumberBoxProps) => {
  return (<MxSelectBox<number> {...props} />)
}

export interface MxRadioBoxProps extends MxProps<CsRadioBoxItem> {
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
            value={item.value} defaultValue={item.value}
            name={"radio-group-" + item.key}
            onChange={(e, value: string) => {
              console.log("checkbox", e.target.value)
              if (item.isReadonly()) return
              item.setValue(value)
              if (!validateWhenErrroExists(value, item)) {
                setRefresh(true)
              }
            }}
            {...muiProps}
          >
            {item.options.map(o => {
              const selected = (o[item.optionValueKey] === item.value)
              return (
                <FormControlLabel value={o[item.optionValueKey]}
                  control={<Radio readOnly={(item.isReadonly() && !selected)} />}
                  label={o[item.optionLabelKey]} />
              )
            })}
          </RadioGroup>
        </FormControl>
      )}
    /> // MxEditCtrl
  )
}

export interface MxCheckBoxProps extends MxProps<CsCheckBoxItem> {
  muiProps?: CheckboxProps
}

export const MxCheckBox = (props: MxCheckBoxProps) => {
  const { item, muiProps } = props
  return (
    <MxEditCtrl mxProps={props}
      renderCtrl={() => (
        <FormGroup>
          <FormControlLabel
            control={
              <Checkbox className={getClassName(props, "fit-content")}
                value={item.value} checked={item.value}
                onChange={(e, checked) => {
                  if (item.isReadonly()) return
                  item.setValue(checked)
                }}
                {...muiProps}
              />
            }
            label={item.checkBoxText} />
        </FormGroup>
      )}
    /> // MxEditCtrl
  )
}

export interface MxMultiCheckBoxProps extends MxProps<CsMultiCheckBoxItem> {
  muiProps?: CheckboxProps
}

export const MxMultiCheckBox = (props: MxMultiCheckBoxProps) => {
  const { item, muiProps } = props
  return (
    <MxEditCtrl mxProps={props}
      renderCtrl={(setRefresh) => (
        <div className={getClassName(props, "fit-content")}>
          <FormGroup>
            {item.options.map(o => {
              const value = o[item.optionValueKey]
              const text = o[item.optionLabelKey]
              return (
                <FormControlLabel
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
                          newValue = (item.value) ? item.value?.filter(v => v !== value) : []
                        }
                        item.setValue(newValue)
                        if (!validateWhenErrroExists(newValue, item)) {
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