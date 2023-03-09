import React, { ReactNode, useState } from "react"
import { Alert, Button, Space } from "antd"
import { useCallback } from "react"
import { CsButtonClickEvent } from "../../framework/cs/CsEvent"
import "./AxCtrl.css"
import { CsView } from "../../framework/cs"

export interface CxButtonProps {
  type: "default" | "link" | "text" | "ghost" | "primary" | "dashed" | undefined
  validationViews?: CsView[],
  event: CsButtonClickEvent<unknown>
  successMessage?: string
  errorMessage?: string
  validateErrorMessage?: string
  affterSuccessPath?: string
  children?: ReactNode | undefined
}

export const AxButton: React.FC<CxButtonProps> = (props) => {
  const { event, validationViews } = props
  const [validationSuccess, setValidationSuccess] = useState<boolean>(true)
  const onClick = useCallback(async () => {
    setValidationSuccess(true)
    let success = true
    if (validationViews) {
      for (const view of validationViews) {
        if (view.validateEvent) {
          view.validateEvent.resetError()
          if (view.validateEvent.onValidateHasError(view)) {
            setValidationSuccess(false)
            success = false
          }
        }
      }
    }
    if (!validationSuccess) {
      return
    }
    await event.mutateAsync(event.requestData)
  }, [event.mutateAsync, event.requestData, validationViews, validationSuccess, setValidationSuccess])
  return (
    <div className="buttonArea">
      {/* <Space direction="vertical" style={{ width: '100%' }}> */}
      <div className="button">
        <Button type={props.type} loading={event.isLoading} onClick={() => { onClick() }}>
          {props.children}
        </Button>
        {(event.isSuccess && props.successMessage) && <Alert message={props.successMessage} type="success" showIcon closable />}
        {(event.isError && props.errorMessage) && <Alert message={props.errorMessage} type="error" showIcon closable />}
        {(!validationSuccess && props.validateErrorMessage) && <Alert message={props.validateErrorMessage} type="warning" showIcon closable />}
      </div>
      {/* </Space> */}
    </div>
  )
}