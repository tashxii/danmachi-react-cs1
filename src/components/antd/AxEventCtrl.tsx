import React, { ReactNode } from "react"
import { Alert, Button } from "antd"
import { useCallback } from "react"
import { CsButtonClickEvent } from "../../framework/cs/CsEvent"
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

export interface AxButtonProps<TApiRequest = unknown, TApiResponse = unknown, TApiError = unknown> extends AxEventProps {
  type: "default" | "link" | "text" | "ghost" | "primary" | "dashed" | undefined
  event: CsButtonClickEvent<TApiRequest, TApiResponse, TApiError>
  validationViews?: CsView[],
  successMessage?: string
  errorMessage?: string
  validateErrorMessage?: string
  affterSuccessPath?: string
  children?: ReactNode | undefined
}

export const AxButton = <TApiRequest = unknown, TApiResponse = unknown, TApiError = unknown,>
  (props: AxButtonProps<TApiRequest, TApiResponse, TApiError>) => {
  const { event, validationViews } = props
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
    event.result.resetFlag()
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
      await event.callApiAsync(event.apiRequest)
      if (event.result.isSuccess) {
        console.warn("Api Success " + new Date(Date.now()).toLocaleTimeString(), event)
        //ページ遷移などを実行するコールバックを呼び出す
      }
      if (event.result.isError) {
        console.warn("Api Error " + new Date(Date.now()).toLocaleTimeString(), event)
        //エラー通知などを実行するコールバックを呼び出す
      }
    }
  }, [event.callApiAsync, event.apiRequest, validationViews])

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