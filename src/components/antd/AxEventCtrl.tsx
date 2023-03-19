import React, { ReactNode, useEffect, useState } from "react"
import { Alert, Button, ButtonProps, Tooltip } from "antd"
import { useCallback } from "react"
import { CsRqMutateButtonClickEvent, CsRqQueryButtonClickEvent } from "../../framework/cs/CsEvent"
import "./AxCtrl.css"
import { CsView } from "../../framework/cs"

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

const executeValidation = (validationViews: CsView[] | undefined) => {
  let validationOK = true
  if (validationViews) {
    for (const view of validationViews) {
      if (view.validateEvent) {
        view.validateEvent.resetError()
        if (view.validateEvent.onValidateHasError(view)) {
          validationOK = false
        }
      }
    }
  }
  return validationOK
}

export interface AxButtonProps extends AxEventProps {
  type?: "default" | "link" | "text" | "ghost" | "primary" | "dashed" | undefined
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
  console.log("onClickResult", onClickResult)
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
  type?: "default" | "link" | "text" | "ghost" | "primary" | "dashed" | undefined
  event: CsRqMutateButtonClickEvent<TApiRequest, TApiResponse>
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
    if (!event.isLoading) {
      if (event.isSuccess) {
        event.setResponse()
      } else if (event.isError) {
        event.setError()
      }
    }
  }, [event, onClickResult])

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
      {(event.result.isSuccess && props.successMessage) &&
        <Alert className="button-alert" message={props.successMessage} type="success" showIcon closable />}
      {(event.result.isError && props.errorMessage) &&
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
  type?: "default" | "link" | "text" | "ghost" | "primary" | "dashed" | undefined
  event: CsRqQueryButtonClickEvent<TApiResponse>
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
    if (!event.isRefetching) {
      if (event.isSuccess) {
        event.setResponse()
      } else if (event.isError) {
        event.setError()
      }
    }
  }, [event, onClickResult])

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
      {(event.result.isSuccess && props.successMessage) &&
        <Alert className="button-alert" message={props.successMessage} type="success" showIcon closable />}
      {(event.result.isError && props.errorMessage) &&
        <Alert className="button-alert" message={props.errorMessage} type="error" showIcon closable />}
      {(showStatus === "validation" && props.validateErrorMessage) &&
        <Alert className="button-alert" message={props.validateErrorMessage}
          type="warning" showIcon closable onClose={() => setShowStatus(undefined)} />}
      <Button className={getClassName(props, "button")} type={props.type} loading={event.isRefetching}
        onClick={() => { onClick() }}
        {...antdProps}>
        {props.children}
      </Button>
    </div>
  )
}
