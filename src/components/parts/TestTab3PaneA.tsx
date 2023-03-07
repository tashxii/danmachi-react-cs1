import React from "react"
import { Button } from "antd"
import { CxLayoutProps, CxTableLayout } from "../../framework/cx/CxLayout"
import testView, { useTestView } from "./testView"
import { CsItem } from "../../framework/cs"
import { Form } from "../basics/Form"

export const TestTab3PaneA: React.FC = () => {
  const view = useTestView()
  const props: CxLayoutProps = {
    colSize: 3,
    rowSize: 10,
    useAx: true,
    view: view
  }
  const itemKeys = Object.keys(view).filter((k) => {
    const x = k as keyof testView;
    if (view[x] instanceof CsItem<string | number | boolean | string[]>) {
      const item = view[x] as CsItem<string | number | boolean | string[]>
      return true
    }
    return false
  })
  const map = new Map<string, string>()
  itemKeys.forEach(k => map.set(k, k))
  const vals = Object.fromEntries(map)
  console.warn(vals)
  return (
    <>
      <Form onSubmit={view.validateEvent?.onHandleSubmit(view, () => { alert("submit!") }, () => { alert("error") })}>
        <CxTableLayout {...props} />
        <Button onClick={() => (console.error(view, view.validateEvent?.validationError))}>ダンプ</Button>
        <Button htmlType="submit" onClick={() => (console.error(view))}>バリデーションテスト</Button>
      </Form>
    </>
  )
}