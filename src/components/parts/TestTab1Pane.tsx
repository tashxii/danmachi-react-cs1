import React, { useState } from "react"
import { CsCheckBoxItem, CsPasswordItem, CsRadioBoxItem, CsSelectBoxItem, CsTextAreaItem, CsInputTextItem } from "../../framework/cs"
import { useInitView } from "../../framework/cs/CsView"
import { CxLayoutProps, CxTableLayout } from "../../framework/cx/CxLayout"
import TestView, { TestViewItems, useTestView } from "./testView"

export const TestTab1Pane: React.FC = () => {
  const view = useTestView()
  const props: CxLayoutProps = {
    colSize: 1,
    rowSize: 10,
    useAntd: false,
    view: view
  }
  return (
    <CxTableLayout {...props} />
  )
}