import { CsInputDateItem, CsInputNumberItem, CsInputTextItem, CsSelectBoxItem, CsView, numberRule, selectOptions, stringRule, useCsInputDateItem, useCsInputNumberItem, useCsInputTextItem, useCsSelectBoxItem, useCsView, useInit } from "../../framework/logics"
import { useCsArrayDataView } from "../../framework/logics/CsArrayDataView"

export type PetInfo = {
  name: string
  race: string
  birthday: string
  star: number
  noTargetProperty: string
}

export type PetInfoView = CsView & {
  name: CsInputTextItem
  race: CsSelectBoxItem
  birthday: CsInputDateItem
  star: CsInputNumberItem
  noTargetItem: CsInputTextItem
}

const PetInfoTable = () => {
  const view: PetInfoView = useCsView(
    {
      name: useCsInputTextItem("ペットの名前", useInit(""), stringRule(true, 0, 16)),
      race: useCsSelectBoxItem("種類", useInit("cat"), stringRule(true), selectOptions([
        { key: "bird", label: "とり" },
        { key: "cat", label: "ねこ" },
        { key: "dog", label: "いぬ" },
      ], "key", "label")),
      birthday: useCsInputDateItem("誕生日", useInit(""), stringRule(false)),
      star: useCsInputNumberItem("お気に入り度", useInit(3), numberRule(false, 0, 5)),
      noTargetItem: useCsInputTextItem("表示されない項目", useInit(""), stringRule(true, 0, 16)),
    }
  )
  const tableView = useCsArrayDataView(
    view,
    [
      { name: "わんこ", race: "dog", birthday: "2024/1/1", star: 5, noTargetProperty: "aaa" },
      { name: "にゃー", race: "cat", birthday: "2024/2/1", star: 4, noTargetProperty: "bbb" },
      { name: "ばどお", race: "bird", birthday: "2024/3/1", star: 3, noTargetProperty: "ccc" },
    ])



}
export default PetInfoTable
