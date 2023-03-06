import React, { useState } from "react"
import { CxLayoutProps, CxTableLayout } from "../../framework/cx/CxLayout"
import TestView, { useTestView } from "./testView"

export const TestTab1Pane: React.FC = () => {
  const view = useTestView()
  const props: CxLayoutProps = {
    colSize: 1,
    rowSize: 10,
    useAx: false,
    view: view
  }
  return (
    <CxTableLayout {...props} />
  )
}