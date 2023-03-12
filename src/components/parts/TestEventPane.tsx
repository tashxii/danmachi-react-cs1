import React, { useState } from "react"
import { Button, Card, Col, Row, Table } from "antd"
import { CxLayoutProps, CxTableLayout } from "../../framework/cx/CxLayout"
import testView, { useTestView } from "./testView"
import { CsInputTextItem, CsItem, CsSelectBoxItem, CsView } from "../../framework/cs"
import { Form } from "../basics/Form"
import { AxButton } from "../antd/AxEventCtrl"
import { AxInputText, AxLabel } from "../antd/AxCtrl"
import { CsButtonClickEvent, useRQCsButtonClickEvent } from "../../framework/cs/CsEvent"
import { selectOptStr, strValOpt, useCsInputTextItem, useCsSelectBoxItem } from "../../framework/cs/CsHooks"
import Search from "antd/es/input/Search"
import { TestApi, User } from "./testApi"
import { useCsView } from "../../framework/cs/CsView"

interface TestSearchView extends CsView {
  keyword: CsInputTextItem
  searchButton: CsButtonClickEvent<string, User[]>
}

interface TestMakeView extends CsView {
  name: CsInputTextItem
  job: CsSelectBoxItem
  makeButton: CsButtonClickEvent<User, User>
}

export const TestEventPane: React.FC<{ colSize: number, componentType: "standard" | "antd" | "fluent" }>
  = (props: { colSize: number, componentType: "standard" | "antd" | "fluent" }) => {
    const searchView = useCsView<TestSearchView>({
      readonly: false,
      keyword: useCsInputTextItem("検索キーワード", useState(""), strValOpt(false, 1, 100)),
      searchButton: useRQCsButtonClickEvent("listUsers", TestApi.listUsers)
    })

    const makeView = useCsView<TestMakeView>({
      readonly: false,
      name: useCsInputTextItem("名前", useState(""), strValOpt(true, 1, 16)),
      job: useCsSelectBoxItem("職業", useState(), strValOpt(true),
        selectOptStr(["無職", "戦士", "魔術師", "僧侶", "遊び人", "ギャンブラー", "勇者"])),
      makeButton: useRQCsButtonClickEvent("createUser", TestApi.createUser)
    })


    const layoutProps: CxLayoutProps = {
      colSize: props.colSize as 1 | 2 | 3 | 4 | 6 | 12 | 24,
      componentType: props.componentType,
      view: makeView
    }

    searchView.searchButton.setApiRequest(searchView.keyword.value ?? "")

    if (makeView.name.value && makeView.job.value) {
      makeView.makeButton.setApiRequest(
        new User(makeView.name.value, makeView.job.value)
      )
    }

    return (
      <>
        <Card title="検索" style={{ width: "auto" }}>
          <Row>

            <Col span={18}>
              <AxInputText item={searchView.keyword}></AxInputText>
            </Col>
            <Col span={6}>
              <AxButton
                type="primary"
                validationViews={[searchView]}
                event={searchView.searchButton}
                addClassNames={["left"]}
                successMessage="6割くらいの確率で成功しました"
                errorMessage="4割くらいの確率で失敗しました"
                validateErrorMessage="入力項目に不備があります"
              >
                検索
              </AxButton>
            </Col>
          </Row>
        </Card>
        <Card title="新規ユーザー登録" style={{ width: "auto" }}>
          <Form onSubmit={makeView.validateEvent?.onHandleSubmit(makeView, () => { alert("submit!") }, () => { })}>
            <CxTableLayout {...layoutProps} />
            <AxButton
              type="primary"
              validationViews={[makeView]}
              event={makeView.makeButton}
              successMessage="6割くらいの確率で成功しました"
              errorMessage="4割くらいの確率で失敗しました"
              validateErrorMessage="入力項目に不備があります"
            >
              登録
            </AxButton>
          </Form>
        </Card>
        <Card title="ユーザーの一覧" style={{ width: "auto" }}>
          <Table
            dataSource={searchView.searchButton.result.response ?? []}
            columns={[
              { title: "ID", dataIndex: "id", key: "1" },
              { title: "名前", dataIndex: "name", key: "2" },
              { title: "職業", dataIndex: "job", key: "3" },
              { title: "筋力", dataIndex: "str", key: "4" },
              { title: "耐久", dataIndex: "vit", key: "5" },
              { title: "知力", dataIndex: "int", key: "6" },
              { title: "器用", dataIndex: "dex", key: "7" },
              { title: "幸運", dataIndex: "luc", key: "8" },
            ]}
            pagination={false}
            rowKey="id"
          ></Table>
        </Card>
      </>
    )
  }