import { Button, Grid } from "@mui/material"
import { MxArrayDataTable } from "../../framework/components/mui/MxArrayDataTable"
import { CsInputDateItem, CsInputNumberItem, CsInputTextItem, CsMultiCheckBoxItem, CsSelectBoxItem, CsView, numberRule, selectOptionStrings, selectOptions, stringArrayRule, stringRule, useCsInputDateItem, useCsInputNumberItem, useCsInputTextItem, useCsMultiCheckBoxItem, useCsSelectBoxItem, useCsView, useInit } from "../../framework/logics"
import { useCsArrayDataView } from "../../framework/logics/CsArrayDataView"

export type PetInfo = {
  name: string
  race: string
  birthday: string
  star: number
  payMethod: string[]
  noTargetProperty: string // PetInfoViewのキー名と不一致のため対象とならない
}

export type PetInfoView = CsView & {
  name: CsInputTextItem
  race: CsSelectBoxItem
  birthday: CsInputDateItem
  star: CsInputNumberItem
  payMethod: CsMultiCheckBoxItem
  noTargetItem: CsInputTextItem // PetInfoのキーと一致しないため表示されない
}

export type PetInfoTableProps = {
  validationTrigger: string
}

const PetInfoTable = (props: PetInfoTableProps) => {
  const { validationTrigger } = props
  const mode = validationTrigger === "onBlur" ? "onBlur" : "onSubmit"
  // 従来通りのViewを定義する
  const headerView: PetInfoView = useCsView(
    {
      name: useCsInputTextItem("ペットの名前", useInit(""), stringRule(true, 0, 16)),
      race: useCsSelectBoxItem("種類", useInit("cat"), stringRule(true), selectOptions([
        { key: "bird", label: "とり" },
        { key: "cat", label: "ねこ" },
        { key: "dog", label: "いぬ" },
      ], "key", "label")),
      birthday: useCsInputDateItem("誕生日", useInit(""), stringRule(true)),
      star: useCsInputNumberItem("お気に入り度", useInit(3), numberRule(false, 0, 5)),
      payMethod: useCsMultiCheckBoxItem("支払い方法", useInit(), stringArrayRule(true), selectOptionStrings(["現金", "クレカ"])),
      noTargetItem: useCsInputTextItem("表示されない項目", useInit(""), stringRule(true, 0, 16)),
    },
    {
      validationTrigger: mode
    }
  )
  // Viewをヘッダーとして、初期化する配列を渡す
  const arrayView = useCsArrayDataView<PetInfoView, PetInfo>(
    headerView,
    [// column info 並び順と幅を設定する
      { key: "name", width: "20%" },
      { key: "star", width: "15%" },
      { key: "race", width: "15%" },
      { key: "birthday", width: "20%" },
      { key: "payMethod", width: "20%" }
    ],
    [// array data
      { name: "わんこ", race: "dog", birthday: "2024-01-01T00:00:00Z", star: 5, payMethod: [], noTargetProperty: "aaa" },
      { name: "にゃー", race: "cat", birthday: "2024-02-01T00:00:00Z", star: 4, payMethod: [], noTargetProperty: "bbb" },
      { name: "ばどお", race: "bird", birthday: "2024-03-01T00:00:00Z", star: 3, payMethod: [], noTargetProperty: "ccc" },
      { name: "鳥貴族", race: "bird", birthday: "2024-03-02T00:00:00Z", star: 3, payMethod: [], noTargetProperty: "ccc" },
      { name: "鳥義賊", race: "bird", birthday: "2024-03-03T00:00:00Z", star: 3, payMethod: ["クレカ"], noTargetProperty: "ccc" },
      { name: "鳥平民", race: "bird", birthday: "2024-03-04T00:00:00Z", star: 3, payMethod: ["現金"], noTargetProperty: "ccc" },
    ])

  return (
    <>
      <MxArrayDataTable view={arrayView} showDeleteAction={true} />
      <Grid container>
        <Grid item>
          <Button variant="outlined" onClick={(() => {
            arrayView.addRow({ name: "", race: "", birthday: "2024-01-01T00:00:00Z", star: 0, payMethod: [], noTargetProperty: "xxx" })
          })}>ペットの追加</Button >
        </Grid>
        <Grid item>
          <Button variant="contained" onClick={() => { arrayView.valiadteArrayData() }}>バリデーション</Button>
        </Grid>
        <Grid item>
          <Button variant="text" onClick={() => { console.warn(arrayView) }}>テーブルのダンプ</Button>
        </Grid>
      </Grid>
    </>
  )
}
export default PetInfoTable
