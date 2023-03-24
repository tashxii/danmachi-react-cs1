import React from "react"
import { Button, Col, Row } from "antd"
import { Form } from "../basics/Form"
import { useTestView } from "./testView"
import { CxLayout2Props, CxTableLayout2 } from "../../framework/cx/CxLayout2"
import CsView, { CsRIView, CsZodView } from "../../framework/cs/CsView"

interface TestTabXPaneProp {
  colSize: number,
  componentType: "standard" | "antd" | "mui" | "bootstrap",
  readonly: boolean
  view: CsRIView | CsZodView
}
export const TestTabXPane: React.FC<TestTabXPaneProp> = (props: TestTabXPaneProp) => {
  const { view } = props
  view.readonly = props.readonly
  const layoutProps: CxLayout2Props = {
    colSize: props.colSize as 1 | 2 | 3 | 4 | 6 | 12 | 24,
    componentType: props.componentType,
    view: view
  }
  const onSubmit = () => {
    if (view instanceof CsRIView) {
      const csView = view as CsRIView
      if (csView.validateEvent) {
        return csView.validateEvent?.onHandleSubmit(view, () => { alert("submit!") }, () => { })
      }
    }
    return () => { }
  }
  const onClickValidation = (argView: CsView) => {
    if (argView instanceof CsZodView) {
      const csView = argView as CsZodView
      return () => { csView.validationEvent?.onValidateHasError(csView) }
    }
    return () => { }
  }


  return (
    <Form onSubmit={onSubmit}>
      <CxTableLayout2 {...layoutProps} />
      <Row>
        <Col span={4} offset={20}>
          <Button type="primary" htmlType="submit" onClick={onClickValidation(view)}>バリデーションテスト</Button>
          <Button type="default" onClick={() => { console.log(view) }}>コンソールダンプ</Button>
        </Col>
      </Row>
    </Form >
  )
}