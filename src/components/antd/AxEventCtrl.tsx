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
  const [onClickResult, setOnClickResult] = useState<boolean>()

  const onClickWrap = useCallback(() => {
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
    if (validationOK) {
      onClick()
      setOnClickResult(true)
    }
  }, [onClick, validationViews])

  const isShowDisableReason = () => {
    return (antdProps?.disabled === true) && (props.disabledReason)
  }

  return (
    <div className={getClassName(props, "button-area")}>
      {(onClickResult !== undefined && onClickResult && props.successMessage) && <Alert message={props.successMessage} type="success" showIcon closable />}
      {(onClickResult !== undefined && !onClickResult && props.errorMessage) && <Alert message={props.errorMessage} type="error" showIcon closable />}
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
  affterSuccessPath?: string
  children?: ReactNode | undefined
  antdProps?: ButtonProps
}

export const AxMutateButton = <TApiRequest = unknown, TApiResponse = unknown>
  (props: AxMutateButtonProps<TApiRequest, TApiResponse>) => {
  const { event, validationViews, antdProps } = props

  useEffect(() => {
    if (!event.isLoading) {
      if (event.isSuccess) {
        event.setResponse()
      }
      if (event.isError) {
        event.setError()
      }
    }
  }, [event])

  const onClick = useCallback(async () => {
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
    if (validationOK) {
      if (event.apiRequest === undefined) {
        return
      }
      await event.onClick()
    }
  }, [event, validationViews])

  return (
    <div className={getClassName(props, "button-area")}>
      {(event.result.isSuccess && props.successMessage) && <Alert message={props.successMessage} type="success" showIcon closable />}
      {(event.result.isError && props.errorMessage) && <Alert message={props.errorMessage} type="error" showIcon closable />}
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
  affterSuccessPath?: string
  children?: ReactNode | undefined
  antdProps?: ButtonProps
}

export const AxQueryButton = <TApiResponse = unknown>
  (props: AxQueryButtonProps<TApiResponse>) => {
  const { event, validationViews, antdProps } = props

  useEffect(() => {
    if (!event.isRefetching) {
      if (event.isSuccess) {
        event.setResponse()
      }
      if (event.isError) {
        event.setError()
      }
    }
  }, [event])

  const onClick = useCallback(async () => {
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
    if (validationOK) {
      await event.onClick()
    }
  }, [event, validationViews])

  return (
    <div className={getClassName(props, "button-area")}>
      {(event.result.isSuccess && props.successMessage) && <Alert message={props.successMessage} type="success" showIcon closable />}
      {(event.result.isError && props.errorMessage) && <Alert message={props.errorMessage} type="error" showIcon closable />}
      <Button className={getClassName(props, "button")} type={props.type} loading={event.isRefetching}
        onClick={() => { onClick() }}
        {...antdProps}>
        {props.children}
      </Button>
    </div>
  )
}
