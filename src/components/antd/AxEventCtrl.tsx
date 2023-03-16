import React, { ReactNode, useEffect, useState } from "react"
import { Alert, Button } from "antd"
import { useCallback } from "react"
import { CsRQMutateButtonClickEvent, CsRQQueryButtonClickEvent } from "../../framework/cs/CsEvent"
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

export interface AxOwnClickButtonProps extends AxEventProps {
  type?: "default" | "link" | "text" | "ghost" | "primary" | "dashed" | undefined
  onClickHandler: () => boolean | void
  validationViews?: CsView[],
  successMessage?: string
  errorMessage?: string
  validateErrorMessage?: string
  affterSuccessPath?: string
  children?: ReactNode | undefined
}

export const AxOwnClickButton = (props: AxOwnClickButtonProps) => {
  const { onClickHandler, validationViews } = props
  const [onClickResult, setOnClickResult] = useState<boolean>()
  const [validationSuccess, setValidationSuccess] = useState(true)

  const onClick = useCallback(() => {
    console.error("here")
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
    console.error(validationOK)
    if (validationOK) {
      onClickHandler()
      setOnClickResult(true)
    }
  }, [onClickHandler, validationViews])

  return (
    <div className={getClassName(props, "button-area")}>
      <div className={getClassName(props, "button")}>
        {(onClickResult !== undefined && onClickResult && props.successMessage) && <Alert message={props.successMessage} type="success" showIcon closable />}
        {(onClickResult !== undefined && !onClickResult && props.errorMessage) && <Alert message={props.errorMessage} type="error" showIcon closable />}
        {(!validationSuccess && props.validateErrorMessage) && <Alert message={props.validateErrorMessage} type="warning" showIcon closable />}
        <Button type={props.type}
          onClick={() => { onClick() }}>
          {props.children}
        </Button>
      </div>
    </div >
  )
}

export interface AxMutateButtonProps<TApiRequest = unknown, TApiResponse = unknown> extends AxEventProps {
  type?: "default" | "link" | "text" | "ghost" | "primary" | "dashed" | undefined
  event: CsRQMutateButtonClickEvent<TApiRequest, TApiResponse>
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
        console.warn("Api Success E " + new Date(Date.now()).toLocaleTimeString(), event)
        event.setResponse()
      }
      if (event.isError) {
        console.warn("Api Error E " + new Date(Date.now()).toLocaleTimeString(), event)
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
      <div className={getClassName(props, "button")}>
        {(event.result.isSuccess && props.successMessage) && <Alert message={props.successMessage} type="success" showIcon closable />}
        {(event.result.isError && props.errorMessage) && <Alert message={props.errorMessage} type="error" showIcon closable />}
        {(!isVadaliteSuccess() && props.validateErrorMessage) && <Alert message={props.validateErrorMessage} type="warning" showIcon closable />}
        <Button type={props.type} loading={event.isLoading}
          onClick={() => { onClick() }} disabled={(event.apiRequest === undefined)}>
          {props.children}
        </Button>
      </div>
    </div >
  )
}

export interface AxQueryButtonProps<TApiResponse = unknown> extends AxEventProps {
  type?: "default" | "link" | "text" | "ghost" | "primary" | "dashed" | undefined
  event: CsRQQueryButtonClickEvent<TApiResponse>
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
        console.log("QQQ", event)
        console.warn("QQQ Api Success E " + new Date(Date.now()).toLocaleTimeString(), JSON.stringify(event))
        event.setResponse()
      }
      if (event.isError) {
        console.log("QQQ", event)
        console.warn("QQQ Api Error E " + new Date(Date.now()).toLocaleTimeString(), JSON.stringify(event))
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
      <div className={getClassName(props, "button")}>
        {(event.result.isSuccess && props.successMessage) && <Alert message={props.successMessage} type="success" showIcon closable />}
        {(event.result.isError && props.errorMessage) && <Alert message={props.errorMessage} type="error" showIcon closable />}
        {(!isVadaliteSuccess() && props.validateErrorMessage) && <Alert message={props.validateErrorMessage} type="warning" showIcon closable />}
        <Button type={props.type} loading={event.isRefetching}
          onClick={() => { onClick() }}>
          {props.children}
        </Button>
      </div>
    </div >
  )
}