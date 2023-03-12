import React from "react"
import { CxPasswordBox, CxRadioBox, CxSelectBox, CxInputText } from "../../framework/cx/CxCtrl"
import { AxInputText, AxPasswordBox } from "../antd/AxCtrl"
import testView, { useTestView } from "./testView"

export const AsIsWayPane: React.FC = () => {
  const view = useTestView()
  return (
    <>
      <div>
        名前：
      </div>
      <div>
        <AxPasswordBox {...{ item: view.password }}></AxPasswordBox>
      </div>

      <div>
        パスワード：
      </div>
      <div>
        <CxPasswordBox {...{ item: view.password }}></CxPasswordBox>
      </div>

      <div>
        性別：
      </div>
      <div>
        <CxSelectBox {...{ item: view.genderSelect }} />
      </div>

      <div>
        連絡方法：
      </div>
      <div>
        <CxRadioBox {...{ item: view.contactWay }} />
      </div>
    </>
  )
}