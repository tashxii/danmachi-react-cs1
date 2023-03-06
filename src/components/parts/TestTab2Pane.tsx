import React from "react"
import { CxLayoutProps, CxTableLayout } from "../../framework/cx/CxLayout"
import testView, { useTestView } from "./testView"

export const TestTab2Pane: React.FC = () => {
  const view = useTestView()
  const props: CxLayoutProps = {
    colSize: 6,
    rowSize: 10,
    useAx: false,
    view: view,
  }
  return (
    <CxTableLayout {...props} />
  )
}