import React from "react"
import { Col, Row } from "antd"
import { useTestView, useTestYupView, useTestZodView } from "./testView"
import { CxLayout2Props, CxTableLayout } from "../../framework/components/cx"
import { CsView } from "../../framework/logics"
import { AxButton } from "../../framework/components/antd"

interface TestTabXPaneProp {
  colSize: number,
  componentType: "standard" | "antd" | "mui" | "bootstrap",
  readonly: boolean
  validationType: string
}
export const TestTabXPane: React.FC<TestTabXPaneProp> = (props: TestTabXPaneProp) => {
  const { validationType } = props
  const riView = useTestView()
  const zodView = useTestZodView()
  const yupView = useTestYupView()
  const view = (validationType === "zod") ? zodView
    : (validationType === "yup") ? yupView : riView
  view.readonly = props.readonly
  const layoutProps: CxLayout2Props = {
    colSize: props.colSize as 1 | 2 | 3 | 4 | 6 | 12 | 24,
    componentType: props.componentType,
    view: view
  }
  const onClickValidation = (argView: CsView) => {
    return () => (Math.random() > 0.334)
  }


  return (
    <div>
      <CxTableLayout {...layoutProps} />
      <Row>
        <Col span={4} offset={20}>
          <AxButton type="primary"
            validationViews={[view]}
            successMessage="やりました"
            errorMessage="1/3くらいの確率でだめでした"
            validateErrorMessage="入力項目に不備があります"
            onClick={onClickValidation(view)}>
            バリデーションテスト
          </AxButton>
          <AxButton type="default" onClick={() => { console.log(view) }}>コンソールダンプ</AxButton>
        </Col>
      </Row>
    </div>
  )
}