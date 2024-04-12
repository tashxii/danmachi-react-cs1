import React from "react"
import {
  CsCheckBoxItem, CsInputDateItem, CsInputNumberItem, CsInputPasswordItem, CsInputTextItem,
  CsMultiCheckBoxItem, CsRadioBoxItem, CsSelectBoxItem, CsTextAreaItem, CsView,
  numberRule, selectOptions, selectOptionStrings, stringArrayRule, stringRule,
  useCsCheckBoxItem, useCsInputDateItem, useCsInputNumberItem, useCsInputPasswordItem,
  useCsInputTextItem, useCsMultiCheckBoxItem, useCsRadioBoxItem, useCsSelectBoxItem, useCsTextAreaItem,
  useCsView, useInit
} from "../../framework/logics"
import {
  AxButton, AxCheckBox, AxInputDate, AxInputNumber, AxInputPassword,
  AxInputText, AxMultiCheckBox, AxRadioBox, AxSelectBox, AxTextArea
} from "../../framework/components/antd"
import { CxTableLayout } from "../../framework/components/cx"
import { Col, Row } from "antd"

// Viewの定義
type RegisterUserView = CsView & {
  nickname: CsInputTextItem
  password: CsInputPasswordItem
  kananame: CsInputTextItem
  job: CsSelectBoxItem
  moneyStone: CsInputNumberItem
  charge: CsCheckBoxItem
  selfPR: CsTextAreaItem
  birthDay: CsInputDateItem
  paymentMethod: CsRadioBoxItem
  connectSns: CsMultiCheckBoxItem
}

export const ConceptApplyedPane: React.FC = () => {
  const view: RegisterUserView = useCsView({
    nickname: useCsInputTextItem("ニックネーム", useInit(""), stringRule(true, 3, 30)),
    password: useCsInputPasswordItem("パスワード", useInit(""), stringRule(true, 8, 16)),
    kananame: useCsInputTextItem("かな", useInit(""), stringRule(true)),
    job: useCsSelectBoxItem("ジョブ", useInit(""), stringRule(true),
      selectOptionStrings(["無職", "遊び人", "ギャンブラー"])),
    moneyStone: useCsInputNumberItem("課金石", useInit(3000), numberRule(true, 3000, 200000)),
    charge: useCsCheckBoxItem("課金", useInit(true), "課金する"),
    selfPR: useCsTextAreaItem("自己紹介", useInit(""), stringRule(true, 1, 2000)),
    birthDay: useCsInputDateItem("ネット上の誕生日", useInit("2023-01-01"), stringRule(true)),
    paymentMethod: useCsRadioBoxItem("支払い方法", useInit(""), stringRule(true),
      selectOptionStrings(["父親のクレカ", "母親のクレカ", "家族のクレカ"])),
    connectSns: useCsMultiCheckBoxItem("共有するSNS", useInit(["twitter", "tiktok"]),
      stringArrayRule(false),
      selectOptions([
        { key: "twitter", name: "Twitter" },
        { key: "tiktok", name: "TikTok" },
        { key: "instagram", name: "Instagram" },
        { key: "facebook", name: "Facebook" },
      ], "key", "name")),
  })
  return (
    <>
      <CxTableLayout
        view={view}
        componentType="antd"
        colSize={2}
      />
      {false && // 非表示：フラットに書く場合
        <>
          <Row style={{ marginTop: "10px" }} >
            <Col span={10} offset={1}>
              <AxInputText item={view.nickname} />
            </Col>
            <Col span={10} offset={1}>
              <AxInputPassword item={view.password} />
            </Col>
          </Row>
          <Row style={{ marginTop: "10px" }} >
            <Col span={10} offset={1}>
              <AxInputText item={view.kananame} />
            </Col>
            <Col span={10} offset={1}>
              <AxSelectBox item={view.job} />
            </Col>
          </Row>
          <Row style={{ marginTop: "10px" }} >
            <Col span={10} offset={1}>
              <AxInputNumber item={view.moneyStone} />
            </Col>
            <Col span={10} offset={1}>
              <AxTextArea item={view.selfPR} />
            </Col>
          </Row>
          <Row style={{ marginTop: "10px" }} >
            <Col span={10} offset={1}>
              <AxInputDate item={view.birthDay} />
            </Col>
            <Col span={10} offset={1}>
              <AxCheckBox item={view.charge} />
            </Col>
          </Row>
          <Row style={{ marginTop: "10px" }} >
            <Col span={10} offset={1}>
              <AxRadioBox item={view.paymentMethod} />
            </Col>
            <Col span={10} offset={1}>
              <AxMultiCheckBox item={view.connectSns} />
            </Col>
          </Row>
        </>
      }
      <Row>
        <Col span={20}>
          <AxButton type="primary" validationViews={[view]} onClick={() => { }}>
            バリデーション
          </AxButton>
        </Col>
      </Row>
    </>
  )
}


