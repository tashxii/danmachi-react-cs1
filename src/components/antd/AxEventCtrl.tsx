import React, { ReactNode, useEffect, useState } from "react"
import { Alert, Button } from "antd"
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
  children?: ReactNode | undefined
}

export const AxButton = (props: AxButtonProps) => {
  const { onClick, validationViews } = props
  const [onClickResult, setOnClickResult] = useState<boolean>()
  const [validationSuccess, setValidationSuccess] = useState(true)

  const onClickWrap = useCallback(() => {
    let validationOK = true
    setValidationSuccess(true)
    if (validationViews) {
      for (const view of validationViews) {
        if (view.validateEvent) {
          view.validateEvent.resetError()
          if (view.validateEvent.onValidateHasError(view)) {
            validationOK = false
            setValidationSuccess(false)
          }
        }
      }
    }
    if (validationOK) {
      onClick()
      setOnClickResult(true)
    }
  }, [onClick, validationViews])

  return (
    <div className={getClassName(props, "button-area")}>
      {(onClickResult !== undefined && onClickResult && props.successMessage) && <Alert message={props.successMessage} type="success" showIcon closable />}
      {(onClickResult !== undefined && !onClickResult && props.errorMessage) && <Alert message={props.errorMessage} type="error" showIcon closable />}
      {(!validationSuccess && props.validateErrorMessage) && <Alert message={props.validateErrorMessage} type="warning" showIcon closable />}
      <Button className={getClassName(props, "button")} type={props.type}
        onClick={() => { onClickWrap() }}>
        {props.children}
      </Button>
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
}

export const AxMutateButton = <TApiRequest = unknown, TApiResponse = unknown>
  (props: AxMutateButtonProps<TApiRequest, TApiResponse>) => {
  const { event, validationViews } = props

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

  const isVadaliteSuccess = () => {
    if (validationViews) {
      for (const view of validationViews) {
        if (view.validateEvent) {
          if (Object.keys(view.validateEvent.validationError).length > 0) {
            return false
          }
        }
      }
    }
    return true;
  }

  const onClick = useCallback(async () => {
    if (event.apiRequest === undefined) {
      return
    }
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
      {(!isVadaliteSuccess() && props.validateErrorMessage) && <Alert message={props.validateErrorMessage} type="warning" showIcon closable />}
      <Button className={getClassName(props, "button")} type={props.type} loading={event.isLoading}
        onClick={() => { onClick() }} disabled={(event.apiRequest === undefined)}>
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
}

export const AxQueryButton = <TApiResponse = unknown>
  (props: AxQueryButtonProps<TApiResponse>) => {
  const { event, validationViews } = props

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

  const isVadaliteSuccess = () => {
    if (validationViews) {
      for (const view of validationViews) {
        if (view.validateEvent) {
          if (Object.keys(view.validateEvent.validationError).length > 0) {
            return false
          }
        }
      }
    }
    return true;
  }

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
      {(!isVadaliteSuccess() && props.validateErrorMessage) && <Alert message={props.validateErrorMessage} type="warning" showIcon closable />}
      <Button className={getClassName(props, "button")} type={props.type} loading={event.isRefetching}
        onClick={() => { onClick() }}>
        {props.children}
      </Button>
    </div>
  )
}