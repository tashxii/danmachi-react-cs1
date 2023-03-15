import React, { useMemo, useState } from "react"
import { Card, Col, Row, Table } from "antd"
import { CxLayoutProps, CxTableLayout } from "../../framework/cx/CxLayout"
import { CsInputTextItem, CsSelectBoxItem, CsView } from "../../framework/cs"
import { Form } from "../basics/Form"
import { AxButton, AxMutateButton, AxQueryButton } from "../antd/AxEventCtrl"
import { AxInputText} from "../antd/AxCtrl"
import {
  CsRQMutateButtonClickEvent, CsRQQueryButtonClickEvent, useCsRQMutateButtonClickEvent, useCsRQQueryButtonClickEvent, useRQCsButtonClickEvent
 } from "../../framework/cs/CsEvent"
import { selectOptStr, strValOpt, useCsInputTextItem, useCsSelectBoxItem } from "../../framework/cs/CsHooks"
import { TestApi, User, UserCreateRequest } from "./testApi"
import { useCsView } from "../../framework/cs/CsView"
import { useMutation, useQuery } from "react-query"

interface TestSearchView extends CsView {
  keyword: CsInputTextItem
  searchButton2: CsRQQueryButtonClickEvent<User[]>
}

interface TestMakeView extends CsView {
  name: CsInputTextItem
  job: CsSelectBoxItem
  makeButton2: CsRQMutateButtonClickEvent<UserCreateRequest, User>
}

export const TestEventPane: React.FC<{ colSize: number, componentType: "standard" | "antd" | "fluent" }>
  = (props: { colSize: number, componentType: "standard" | "antd" | "fluent" }) => {
    const keywordItem = useCsInputTextItem("検索キーワード", useState(""), strValOpt(false, 1, 100))
    const searchView = useCsView<TestSearchView>({
      readonly: false,
      keyword: keywordItem,
      searchButton2: useCsRQQueryButtonClickEvent(
        useQuery(
          "listUsers",
          () => TestApi.listUsers(keywordItem.value ?? ""),
          {enabled:false, refetchOnWindowFocus:false, retry:2}
        )
      ),
    })
    const makeView = useCsView<TestMakeView>({
      readonly: false,
      name: useCsInputTextItem("名前", useState(""), strValOpt(true, 1, 16)),
      job: useCsSelectBoxItem("職業", useState(), strValOpt(true),
        selectOptStr(["無職", "戦士", "魔術師", "僧侶", "盗賊", "山賊", "海賊", "遊び人", "ギャンブラー", "博徒","勇者","修羅"])),
      makeButton2: useCsRQMutateButtonClickEvent(useMutation(TestApi.createUser)),
    })


    const layoutProps: CxLayoutProps = {
      colSize: props.colSize as 1 | 2 | 3 | 4 | 6 | 12 | 24,
      componentType: props.componentType,
      view: makeView
    }

    useMemo(() => {
      if (makeView.name.value && makeView.job.value
        && makeView.name.value !== "" && makeView.job.value !== "") {
        makeView.makeButton2.setRequest(
          new UserCreateRequest(makeView.name.value, makeView.job.value)
        )
      }
    }, [makeView.name.value, makeView.job.value, makeView.makeButton2])

    return (
      <>
        <Card title="検索" style={{ width: "auto" }}>
          <Row>
            <Col span={18}>
              <AxInputText item={searchView.keyword}></AxInputText>
            </Col>
            <Col span={6}>
                <AxQueryButton
                  type="primary"
                  validationViews={[searchView]}
                  event={searchView.searchButton2}
                  addClassNames={["left"]}
                  successMessage="6割くらいの確率で成功しました"
                  errorMessage="4割くらいの確率で失敗しました"
                  validateErrorMessage="入力項目に不備があります"
                >
                  検索
                </AxQueryButton>
            </Col>
          </Row>
        </Card>
        <Card title="新規ユーザー登録" style={{ width: "auto" }}>
          <Form onSubmit={makeView.validateEvent?.onHandleSubmit(makeView, () => { alert("submit!") }, () => { })}>
            <CxTableLayout {...layoutProps} />
              <AxMutateButton
                type="primary"
                validationViews={[makeView]}
                event={makeView.makeButton2}
                successMessage="6割くらいの確率で成功しました"
                errorMessage="4割くらいの確率で失敗しました"
                validateErrorMessage="入力項目に不備があります"
              >
                登録
              </AxMutateButton>
          </Form>
        </Card>
        <Card title="ユーザーの一覧" style={{ width: "auto" }}>
          <Table
            dataSource={searchView.searchButton2.response ?? []}
            columns={[
              { title: "ID", dataIndex: "id", key: "1" },
              { title: "名前", dataIndex: "name", key: "2" },
              { title: "職業", dataIndex: "job", key: "3" },
              { title: "筋力", dataIndex: "str", key: "4" },
              { title: "耐久", dataIndex: "vit", key: "5" },
              { title: "知力", dataIndex: "int", key: "6" },
              { title: "器用", dataIndex: "dex", key: "7" },
              { title: "幸運", dataIndex: "luc", key: "8" },
              { title: <span style={{color: "red"}}>† 合計 †</span>,
                render:(i,row:User)=>
                (<span style={{color:"blue"}}>
                    {row.str + row.vit + row.int + row.dex + row.luc}
                 </span>)
              }
            ]}
            pagination={false}
            rowKey="id"
          ></Table>
        </Card>
      </>
    )
  }