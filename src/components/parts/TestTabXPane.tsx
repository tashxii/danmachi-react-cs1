import React from "react"
import { Col, Row } from "antd"
import { useTestView, useTestYupView, useTestZodView } from "./testView"
import { CsView } from "../../framework/logics"
import { AxButton, AxTableLayout } from "../../framework/components/antd"
import { MxTableLayout } from "../../framework/components/mui"
import { BSxTableLayout } from "../../framework/components/bootstrap"

interface TestTabXPaneProp {
  colSize: number,
  componentType: "antd" | "mui" | "bootstrap"
  readonly: boolean
  labelType: string
  labelWidth: number
  validationType: string
  validationTrigger: string
}

const getTableLayoutComponent = (
  view: CsView,
  componentType: "antd" | "mui" | "bootstrap",
  colSize: number,
  labelPlacement: "top" | "left",
  labelWidth: 5 | 10 | 15 | 20 | 25 | 30 | 35 | 40 | 45 | 50,
  hideLabel: boolean
) => {
  const propColSize = colSize as 1 | 2 | 3 | 4 | 6
  switch (componentType) {
    case "antd":
      return <AxTableLayout view={view} colSize={propColSize} labelPlacement={labelPlacement} labelWidth={labelWidth} hideLabel={hideLabel} />
    case "mui":
      return <MxTableLayout view={view} colSize={propColSize} labelPlacement={labelPlacement} labelWidth={labelWidth} hideLabel={hideLabel} />
    case "bootstrap":
      return <BSxTableLayout view={view} colSize={propColSize} labelPlacement={labelPlacement} labelWidth={labelWidth} hideLabel={hideLabel} />
  }
}

export const TestTabXPane: React.FC<TestTabXPaneProp> = (props: TestTabXPaneProp) => {
  const { validationType, validationTrigger, labelType } = props
  const mode = validationTrigger === "onBlur" ? "onBlur" : "onSubmit"
  const riView = useTestView(mode)
  const zodView = useTestZodView(mode)
  const yupView = useTestYupView(mode)
  const view = (validationType === "zod") ? zodView
    : (validationType === "yup") ? yupView : riView
  view.readonly = props.readonly

  const labelPlacement = labelType === "left" ? "left" : "top"
  const labelWidth = props.labelWidth as 5 | 10 | 15 | 20 | 25 | 30 | 35 | 40 | 45 | 50
  const hideLabel = labelType === "hidden"

  const onClickValidation = (argView: CsView) => {
    return () => (Math.random() > 0.334)
  }

  return (
    <div>
      {getTableLayoutComponent(view, props.componentType, props.colSize, labelPlacement, labelWidth, hideLabel)}
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