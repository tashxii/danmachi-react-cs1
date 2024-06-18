import React, { ReactNode, useEffect, useState } from "react"
import { Alert, Button, ButtonProps, Tooltip } from "antd"
import { useCallback } from "react"
import { CsMutateButtonClickEvent, CsQueryButtonClickEvent } from "../../logics"
import "./BSxCtrl.css"
import { CsView } from "../../logics"
import { executeValidation } from "../../logics"

export interface AxEventProps {
  addClassNames?: string[]
}

const getClassName = (props: AxEventProps, base: string): string => {
  let names = [base]
  if (props.addClassNames) {
    names = names.concat(props.addClassNames)
  }
  return names.join(" ")
}

export interface AxButtonProps extends AxEventProps {
  type?: "default" | "link" | "text" | "primary" | "dashed" | undefined
  onClick: () => boolean | void
  validationViews?: CsView[],
  successMessage?: string
  errorMessage?: string
  validateErrorMessage?: string
  affterSuccessPath?: string
  disabledReason?: string
  children?: ReactNode | undefined
  antdProps?: ButtonProps
}

export const AxButton = (props: AxButtonProps) => {
  const { onClick, validationViews, antdProps } = props
  const [onClickResult, setOnClickResult] = useState<string>()
  const [showStatus, setShowStatus] = useState<string>()

  useEffect(() => {
    if (onClickResult !== undefined) {
      setShowStatus(onClickResult)
      setOnClickResult(undefined)
    }
  }, [onClickResult])

  const onClickWrap = useCallback(() => {
    const validationOk = executeValidation(validationViews)
    if (!validationOk) {
      setOnClickResult("validation")
      return
    }
    if (onClick() === false) {
      setOnClickResult("error")
    } else {
      setOnClickResult("success")
    }
  }, [onClick, validationViews])

  const isShowDisableReason = () => {
    return (antdProps?.disabled === true) && (props.disabledReason)
  }
  return (
    <div className={getClassName(props, "button-area")}>
      {(showStatus === "success" && props.successMessage) &&
        <Alert className="button-alert" message={props.successMessage}
          type="success" showIcon closable onClose={() => setShowStatus(undefined)} />}
      {(showStatus === "error" && props.errorMessage) &&
        <Alert className="button-alert" message={props.errorMessage}
          type="error" showIcon closable onClose={() => setShowStatus(undefined)} />}
      {(showStatus === "validation" && props.validateErrorMessage) &&
        <Alert className="button-alert" message={props.validateErrorMessage}
          type="error" showIcon closable onClose={() => setShowStatus(undefined)} />}
      <Tooltip title={props.disabledReason} color="darkslategray"
        open={(isShowDisableReason()) ? undefined : false} >
        <Button className={getClassName(props, "button")} type={props.type}
          onClick={() => { onClickWrap() }}
          {...antdProps}
        >
          {props.children}
        </Button>
      </Tooltip>
    </div >
  )
}

export interface AxMutateButtonProps<TApiRequest = unknown, TApiResponse = unknown> extends AxEventProps {
  type?: "default" | "link" | "text" | "primary" | "dashed" | undefined
  event: CsMutateButtonClickEvent<TApiRequest, TApiResponse>
  validationViews?: CsView[],
  successMessage?: string
  errorMessage?: string
  validateErrorMessage?: string
  affterSuccessPath?: string
  children?: ReactNode | undefined
  antdProps?: ButtonProps
}

export const AxMutateButton = <TApiRequest = unknown, TApiResponse = unknown>(
  props: AxMutateButtonProps<TApiRequest, TApiResponse>
) => {
  const { event, validationViews, antdProps } = props
  const [onClickResult, setOnClickResult] = useState<string>()
  const [showStatus, setShowStatus] = useState<string>()

  useEffect(() => {
    if (onClickResult !== undefined) {
      setShowStatus(onClickResult)
      setOnClickResult(undefined)
    }
  }, [onClickResult])

  const onClick = useCallback(async () => {
    const validationOk = executeValidation(validationViews)
    if (!validationOk) {
      setOnClickResult("validation")
    }
    if (event.apiRequest === undefined) {
      setOnClickResult("noRequest")
      return
    }
    await event.onClick()
  }, [event, validationViews])

  return (
    <div className={getClassName(props, "button-area")}>
      {(event.isSuccess && props.successMessage) &&
        <Alert className="button-alert" message={props.successMessage} type="success" showIcon closable />}
      {(event.isError && props.errorMessage) &&
        <Alert className="button-alert" message={props.errorMessage} type="error" showIcon closable />}
      {(showStatus === "validation" && props.validateErrorMessage) &&
        <Alert className="button-alert" message={props.validateErrorMessage}
          type="warning" showIcon closable onClose={() => setShowStatus(undefined)} />}
      {(showStatus === "noRequest" && props.validationViews) &&
        <Alert className="button-alert" message="リクエストがありません"
          type="warning" showIcon closable onClose={() => setShowStatus(undefined)} />}
      <Button className={getClassName(props, "button")} type={props.type} loading={event.isLoading}
        onClick={() => { onClick() }}
        disabled={(event.apiRequest === undefined)}
        {...antdProps}>
        {props.children}
      </Button>
    </div >
  )
}

export interface AxQueryButtonProps<TApiResponse = unknown> extends AxEventProps {
  type?: "default" | "link" | "text" | "primary" | "dashed" | undefined
  event: CsQueryButtonClickEvent<TApiResponse>
  validationViews?: CsView[],
  successMessage?: string
  errorMessage?: string
  validateErrorMessage?: string
  affterSuccessPath?: string
  children?: ReactNode | undefined
  antdProps?: ButtonProps
}

export const AxQueryButton = <TApiResponse = unknown>(
  props: AxQueryButtonProps<TApiResponse>
) => {
  const { event, validationViews, antdProps } = props
  const [onClickResult, setOnClickResult] = useState<string>()
  const [showStatus, setShowStatus] = useState<string>()

  useEffect(() => {
    if (onClickResult !== undefined) {
      setShowStatus(onClickResult)
      setOnClickResult(undefined)
    }
  }, [onClickResult])

  const onClick = useCallback(async () => {
    const validationOk = executeValidation(validationViews)
    if (!validationOk) {
      setOnClickResult("validation")
      return
    }
    await event.onClick()
  }, [event, validationViews])

  return (
    <div className={getClassName(props, "button-area")}>
      {(event.isSuccess && props.successMessage) &&
        <Alert className="button-alert" message={props.successMessage} type="success" showIcon closable />}
      {(event.isError && props.errorMessage) &&
        <Alert className="button-alert" message={props.errorMessage} type="error" showIcon closable />}
      {(showStatus === "validation" && props.validateErrorMessage) &&
        <Alert className="button-alert" message={props.validateErrorMessage}
          type="warning" showIcon closable onClose={() => setShowStatus(undefined)} />}
      <Button className={getClassName(props, "button")} type={props.type} loading={event.isLoading}
        onClick={() => { onClick() }}
        {...antdProps}>
        {props.children}
      </Button>
    </div>
  )
}
