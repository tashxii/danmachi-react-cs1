import { Col, Row } from "antd"
import { AxCheckBox, AxPasswordBox, AxRadioBox, AxSelectBox, AxTextArea, AxInputText } from "../../components/antd/CxCtrl"
import { CsCheckBoxItem, CsItemBase, CsPasswordItem, CsRadioBoxItem, CsSelectBoxItem, CsTextAreaItem, CsInputTextItem, CsView } from "../cs"
import { CsInputNumberItem } from "../cs/CsItem"
import { CxCheckBox, CxLabel, CxPasswordBox, CxProps, CxRadioBox, CxSelectBox, CxTextArea, CxInputText } from "./CxCtrl"



export class CxLayoutProps {
  view: CsView = {} as CsView
  rowSize: number = 10
  colSize: 1 | 2 | 3 | 4 | 6 | 12 | 24 = 3
  useAx: boolean = false
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
  const rows: number[] = []
  for (let i = 0; i < rowLimit; i++) {
    rows.push(i + 1)
  }
  const cols: number[] = []
  for (let i = 0; i < props.colSize; i++) {
    cols.push(i + 1)
  }
  const colSpan = 24 / props.colSize
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
                        <SelectComponent item={items[x++]} useAx={props.useAx} />
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

export const selectComponent = (item: CsItemBase, useAx: boolean): JSX.Element => {
  if (item instanceof CsInputTextItem) {
    const props: CxProps<CsInputTextItem> = { item: item }
    return (!useAx) ? (<CxInputText {...props} />) : (<AxInputText {...props} />)
  }
  // if (item instanceof CsInputNumberItem) {
  //   const props: CxProps<CsInputNumberItem> = { item: item }
  //   return (!useAx) ? (<CxInputNumber {...props} />) : (<AxInputNumber {...props} />)
  // }
  if (item instanceof CsTextAreaItem) {
    const props: CxProps<CsInputTextItem> = { item: item }
    return (!useAx) ? (<CxTextArea {...props} />) : (<AxTextArea {...props} />)
  }
  if (item instanceof CsCheckBoxItem) {
    const props: CxProps<CsCheckBoxItem> = { item: item }
    return (!useAx) ? (<CxCheckBox {...props} />) : (<AxCheckBox {...props} />)
  }
  if (item instanceof CsPasswordItem) {
    const props: CxProps<CsPasswordItem> = { item: item }
    return (!useAx) ? (<CxPasswordBox {...props} />) : (<AxPasswordBox {...props} />)
  }
  if (item instanceof CsRadioBoxItem) {
    const props: CxProps<CsRadioBoxItem> = { item: item }
    return (!useAx) ? (<CxRadioBox {...props} />) : (<AxRadioBox {...props} />)
  }
  if (item instanceof CsSelectBoxItem) {
    const props: CxProps<CsSelectBoxItem> = { item: item }
    return (!useAx) ? (<CxSelectBox {...props} />) : (<AxSelectBox {...props} />)
  }
  return <NullElement />
}

const NullElement: React.FC<{}> = ({ }) => {
  return <div></div>;
};

const SelectComponent: React.FC<{ item: CsItemBase, useAx: boolean }> = (props) => {
  return selectComponent(props.item, props.useAx)
}