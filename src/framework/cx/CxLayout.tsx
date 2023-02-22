import { Col, Row } from "antd"
import { AntdCheckBox, AntdPasswordBox, AntdRadioBox, AntdSelectBox, AntdTextArea, AntdTextBox } from "../../components/antd/CxCtrl"
import { CsCheckBoxItem, CsItemBase, CsPasswordBoxItem, CsRadioBoxItem, CsSelectBoxItem, CsTextAreaItem, CsTextBoxItem, CsView } from "../cs"
import { CxCheckBox, CxLabel, CxPasswordBox, CxProps, CxRadioBox, CxSelectBox, CxTextArea, CxTextBox } from "./CxCtrl"



export class CxLayoutProps {
  view: CsView = {} as CsView
  rowSize: number = 10
  colSize: 1 | 2 | 3 | 4 | 6 | 12 | 24 = 3
  useAntd: boolean = false
}

export const CxTableLayout: React.FC<CxLayoutProps> = (props) => {
  const v = props.view
  const items: CsItemBase[] = []
  for (const [key, value] of Object.entries(v)) {
    if (value instanceof CsItemBase) {
      items.push(value)
    }
  }
  const rowLimit = Math.floor(items.length / props.colSize + ((items.length % props.colSize === 0) ? 0 : 1))
  console.log("rowLimit", rowLimit)
  const rows: number[] = []
  for (let i = 0; i < rowLimit; i++) {
    rows.push(i + 1)
  }
  console.log(rows)
  const cols: number[] = []
  for (let i = 0; i < props.colSize; i++) {
    cols.push(i + 1)
  }
  console.log(cols)
  const colSpan = 24 / props.colSize
  console.warn(props)

  const aaa: number[] = [1, 2, 3]
  let x = 0;
  return (
    <>
      {
        rows.map((r) => {
          return (
            <Row>
              {
                cols.map((c) => {
                  return (
                    <Col span={colSpan}>
                      {
                        <SelectComponent item={items[x++]} useAntd={props.useAntd} />
                      }
                    </Col>
                  )
                })
              }
            </Row>
          )
        }
        )
      }
    </>
  )
}

export const selectComponent = (item: CsItemBase, useAntd: boolean): JSX.Element => {
  if (item instanceof CsTextBoxItem) {
    const props: CxProps<CsTextBoxItem> = { item: item }
    return (useAntd) ? (<CxTextBox {...props} />) : (<AntdTextBox {...props} />)
  }
  if (item instanceof CsTextAreaItem) {
    const props: CxProps<CsTextBoxItem> = { item: item }
    return (useAntd) ? (<CxTextArea {...props} />) : (<AntdTextArea {...props} />)
  }
  if (item instanceof CsCheckBoxItem) {
    const props: CxProps<CsCheckBoxItem> = { item: item }
    return (useAntd) ? (<CxCheckBox {...props} />) : (<AntdCheckBox {...props} />)
  }
  if (item instanceof CsPasswordBoxItem) {
    const props: CxProps<CsPasswordBoxItem> = { item: item }
    return (useAntd) ? (<CxPasswordBox {...props} />) : (<AntdPasswordBox {...props} />)
  }
  if (item instanceof CsRadioBoxItem) {
    const props: CxProps<CsRadioBoxItem> = { item: item }
    return (useAntd) ? (<CxRadioBox {...props} />) : (<AntdRadioBox {...props} />)
  }
  if (item instanceof CsSelectBoxItem) {
    const props: CxProps<CsSelectBoxItem> = { item: item }
    return (useAntd) ? (<CxSelectBox {...props} />) : (<AntdSelectBox {...props} />)
  }
  return <NullElement />
}

const NullElement: React.FC<{}> = ({ }) => {
  return <div></div>;
};

const SelectComponent: React.FC<{ item: CsItemBase, useAntd: boolean }> = (props) => {
  return selectComponent(props.item, props.useAntd)
}