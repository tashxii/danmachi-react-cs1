import React from "react"
import { CxLayoutProps, CxTableLayout } from "../../framework/cx/CxLayout"
import { useTestView } from "./testView"

export const TestTab2PaneA: React.FC = () => {
  const view = useTestView()
  const props: CxLayoutProps = {
    colSize: 4,
    rowSize: 10,
    useAx: true,
    view: view
  }
  return (
    <CxTableLayout {...props} />
  )
}