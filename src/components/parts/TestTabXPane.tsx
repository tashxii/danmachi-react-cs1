import { Button, Col, Row } from "antd"
import React from "react"
import { CxLayoutProps, CxTableLayout } from "../../framework/cx/CxLayout"
import { Form } from "../basics/Form"
import { useTestView } from "./testView"

export const TestTabXPane: React.FC<{ colSize: number, componentType: "standard" | "antd" | "fluent" }>
  = (props: { colSize: number, componentType: "standard" | "antd" | "fluent" }) => {
    const view = useTestView()
    const layoutProps: CxLayoutProps = {
      colSize: props.colSize as 1 | 2 | 3 | 4 | 6 | 12 | 24,
      componentType: props.componentType,
      view: view
    }
    return (
      <Form onSubmit={view.validateEvent?.onHandleSubmit(view, () => { alert("submit!") }, () => { })}>
        <CxTableLayout {...layoutProps} />
        <Row>
          <Col span={4} offset={20}>
            <Button type="primary" htmlType="submit">バリデーションテスト</Button>
            <Button type="default" onClick={() => { console.log(view) }}>コンソールダンプ</Button>
          </Col>
        </Row>
      </Form>
    )
  }