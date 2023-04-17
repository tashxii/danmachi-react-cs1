import React, { useState } from "react"
import { Button, Checkbox, Col, DatePicker, Input, InputNumber, Radio, RadioChangeEvent, Row, Select, Typography } from "antd"
import dayjs from "dayjs"
import { CheckboxChangeEvent } from "antd/es/checkbox"
import { numberField, stringField, useValidation } from "../../framework/validation"
import { ValidationError } from "../basics/ValidationError"
import { Form } from "../basics/Form"

export const OldFashionededPane: React.FC = () => {
  // ステート
  const [nickname, setNickname] = useState("")
  const [password, setPassword] = useState("")
  const [kananame, setKananame] = useState("")
  const [job, setJob] = useState("")
  const [moneyStone, setMoneyStone] = useState(3000)
  const [selfPR, setSelfPR] = useState("")
  const [birthDay, setbirthDay] = useState("2023-01-01")
  const [charge, setCharge] = useState(true)
  const [paymentMethod, setPaymentMethod] = useState("")
  const [connectSns, setConnectSns] = useState(["twitter", "tiktok"])

  // イベントハンドラ
  const onChangeNickname = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNickname(e.target.value)
  }
  const onChangePassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value)
  }
  const onChangeKananame = (e: React.ChangeEvent<HTMLInputElement>) => {
    setKananame(e.target.value)
  }
  const onChangeMoneyStone = (value: number | null) => {
    setMoneyStone(value ?? 0)
  }
  const onChangeJob = (value: string) => {
    setJob(value)
  }
  const onChangeSelfPR = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setSelfPR(e.target.value)
  }
  const onChangeBirthDay = (value: dayjs.Dayjs | null, dateString: string) => {
    const newValue = value?.format("YYYY-MM-DDTHHmmssZ")
    setbirthDay(newValue?.toString() ?? "")
  }
  const onChangeCharge = (e: CheckboxChangeEvent) => {
    setCharge(e.target.checked)
  }
  const onChangeConnectSns = (e: CheckboxChangeEvent) => {
    let newValue: string[]
    const value = e.target.value
    if (e.target.checked) {
      newValue = connectSns.concat(value)
    } else {
      newValue = (connectSns) ? connectSns?.filter(v => v !== value) : []
    }
    setConnectSns(newValue)
  }
  const onChangePaymentMethod = (e: RadioChangeEvent) => {
    setPaymentMethod(e.target.value)
  }

  // バリデーション
  const getRequiredMessage = (label: string) => {
    return `${label}は必須です。値を入力してください`
  }
  const getMinLengthMessage = (label: string, min: number) => {
    return `${label}が短すぎます。${min}以上の文字列を設定してください`
  }
  const getMaxLengthMessage = (label: string, max: number) => {
    return `${label}が長すぎます。${max}以下の文字列を設定してください`
  }
  const getMinMessage = (label: string, min: number) => {
    return `${label}が小さぎます。${min}以上の値を設定してください`
  }
  const getMaxMessage = (label: string, max: number) => {
    return `${label}が大きすぎます。${max}以下の値を設定してください`
  }
  const validationSchema = {
    nickname: stringField().required(getRequiredMessage("ニックネーム"))
      .minLength(3, getMinLengthMessage("ニックネーム", 3))
      .maxLength(30, getMaxLengthMessage("ニックネーム", 30)),
    password: stringField().required(getRequiredMessage("パスワード"))
      .minLength(8, getMinLengthMessage("パスワード", 8))
      .maxLength(16, getMaxLengthMessage("パスワード", 16)),
    kananame: stringField().required(getRequiredMessage("かな")),
    job: stringField().required(getRequiredMessage("ジョブ")),
    moneyStone: numberField().required(getRequiredMessage("課金石"))
      .min(3000, getMinMessage("課金石", 3000))
      .max(200000, getMaxMessage("課金石", 20000)),
    selfPR: stringField().required(getRequiredMessage("自己紹介")),
    birthDay: stringField().required(getRequiredMessage("誕生日")),
    paymentMethod: stringField().required(getRequiredMessage("支払い方法")),
  }

  const { error, handleSubmit } = useValidation(validationSchema)
  return (
    <>
      <Form onSubmit={handleSubmit({
        nickname, password, kananame, job,
        moneyStone, selfPR, birthDay, paymentMethod
      }, () => { console.warn(error) }, () => { console.warn(error) })}>
        <Row style={{ marginTop: "10px" }} >
          <Col span={10} offset={1}>
            <div>
              <Typography.Text>ニックネーム</Typography.Text>
            </div>
            <Input
              value={nickname}
              onChange={onChangeNickname}
            />
            <ValidationError message={error.nickname} />
          </Col>
          <Col span={10} offset={1}>
            <div>
              <Typography.Text>パスワード</Typography.Text>
            </div>
            <Input.Password
              value={password}
              onChange={onChangePassword}
            />
            <ValidationError message={error.password} />
          </Col>
        </Row>
        <Row style={{ marginTop: "10px" }} >
          <Col span={10} offset={1}>
            <div>
              <Typography.Text>かな</Typography.Text>
            </div>
            <Input
              value={kananame}
              onChange={onChangeKananame}
            />
            <ValidationError message={error.kananame} />
          </Col>
          <Col span={10} offset={1}>
            <div>
              <Typography.Text>ネット上のジョブ</Typography.Text>
            </div>
            <div>
              <Select
                value={job}
                onChange={onChangeJob}
                style={{ minWidth: "200px" }}
                dropdownMatchSelectWidth={false}
              >
                <Select.Option key="" value="" disabled>{ }</Select.Option>
                <Select.Option key="free" value="free">無職</Select.Option>
                <Select.Option key="player" value="player">遊び人</Select.Option>
                <Select.Option key="gambler" value="gambler">ギャンブラー</Select.Option>
              </Select>
            </div>
            <ValidationError message={error.job} />
          </Col>
        </Row>
        <Row style={{ marginTop: "10px" }} >
          <Col span={10} offset={1}>
            <div>
              <Typography.Text>初期購入する課金石の個数</Typography.Text>
            </div>
            <InputNumber
              value={moneyStone}
              onChange={onChangeMoneyStone}
            />
            <ValidationError message={error.moneyStone} />
          </Col>
          <Col span={10} offset={1}>
            <div>
              <Typography.Text>自己紹介</Typography.Text>
            </div>
            <Input.TextArea
              value={selfPR}
              onChange={onChangeSelfPR}
              rows={4} />
            <ValidationError message={error.selfPR} />
          </Col>
        </Row>
        <Row style={{ marginTop: "10px" }} >
          <Col span={10} offset={1}>
            <div>
              <Typography.Text>ネット上の誕生日</Typography.Text>
            </div>
            <DatePicker
              value={dayjs(birthDay)}
              format={"YYYY/MM/DD"}
              onChange={onChangeBirthDay} />
            <ValidationError message={error.birthDay} />
          </Col>
          <Col span={10} offset={1}>
            <div>
              <Typography.Text>課金</Typography.Text>
            </div>
            <Checkbox
              value={charge} checked={charge}
              onChange={onChangeCharge}
            >
              課金する
            </Checkbox>
          </Col>
        </Row>
        <Row style={{ marginTop: "10px" }} >
          <Col span={10} offset={1}>
            <div>
              <Typography.Text>支払い方法</Typography.Text>
            </div>
            <Radio.Group>
              <Radio key="fathers" value="fathers"
                onChange={onChangePaymentMethod}
                checked={paymentMethod === "fathers"}
              >父親のクレカ</Radio>
              <Radio key="mothers" value="mothers"
                onChange={onChangePaymentMethod}
                checked={paymentMethod === "mothers"}
              >母親のクレカ</Radio>
              <Radio key="familys" value="familys"
                onChange={onChangePaymentMethod}
                checked={paymentMethod === "familys"}
              >家族のクレカ</Radio>
            </Radio.Group>
            <ValidationError message={error.paymentMethod} />
          </Col>
          <Col span={10} offset={1}>
            <div>
              <Typography.Text>共有するSNS</Typography.Text>
            </div>
            <div>
              <Checkbox key={"tiktok"} value={"tiktok"}
                checked={connectSns.includes("tiktok")}
                onChange={onChangeConnectSns}>
                Tiktok
              </Checkbox>
              <Checkbox key={"twitter"} value={"twitter"}
                checked={connectSns.includes("twitter")}
                onChange={onChangeConnectSns}>
                Twitter
              </Checkbox>
              <Checkbox key={"instagram"} value={"instagram"}
                checked={connectSns.includes("instagram")}
                onChange={onChangeConnectSns}>
                Instagram
              </Checkbox>
              <Checkbox key={"facebook"} value={"facebook"}
                checked={connectSns.includes("facebook")}
                onChange={onChangeConnectSns}>
                Facebook
              </Checkbox>
            </div>
          </Col>
        </Row>
        <Row style={{ display: "inline-flex", marginTop: "15px" }}>
          <Col offset={20} span={4}>
            <div style={{ alignContent: "flex-end" }}>
              <Button type="primary" htmlType="submit">バリデーション</Button>
            </div>

          </Col>
        </Row>

      </Form>
    </>
  )
}