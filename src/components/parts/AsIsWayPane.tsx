import React from "react"
import { CxPasswordBox, CxRadioBox, CxSelectBox, CxTextBox } from "../../framework/cx/CxCtrl"
import testView, { useTestView } from "./testView"

export const AsIsWayPane: React.FC = () => {
  const view = useTestView()
  return (
    <>
      <div>
        名前：
      </div>
      <div>
        <CxTextBox {...{ item: view.name }}></CxTextBox>
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