import React, { ReactNode } from "react"
import { Alert, Button } from "antd"
import { CsButtonClickEvent } from "../cs/CsEvent"
import { useCallback } from "react"
import { CsView } from "../cs"

export interface CxButtonProps {
  event: CsButtonClickEvent<unknown>
  validationViews?: CsView[],
  successMessage?: string
  errorMessage?: string
  affterSuccessPath?: string
  children?: ReactNode | undefined
}

export const CxButton: React.FC<CxButtonProps> = (props) => {
  const { event } = props
  const onClick = useCallback(async () => {
    await event.mutateAsync(event.requestData)
  }, [event.mutateAsync, event.requestData])
  return (
    <>
      <Button loading={event.isLoading} onClick={() => { onClick() }}>
        {props.children}
      </Button>
      {event.isSuccess && props.successMessage} && <Alert message={props.successMessage} type="success" showIcon closable />
      {event.isError && props.errorMessage} && <Alert message={props.errorMessage} type="error" showIcon closable />
    </>
  )
}