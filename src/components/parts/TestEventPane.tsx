import React, { useEffect, useMemo, useState } from "react"
import { Button, Card, Col, Modal, Row, Table } from "antd"
import { CxTableLayout } from "../../framework/cx/CxLayout"
import { CsInputTextItem, CsSelectBoxItem, CsView } from "../../framework/cs"
import { AxButton, AxMutateButton, AxQueryButton } from "../antd/AxEventCtrl"
import { AxInputText } from "../antd/AxCtrl"
import {
  CsRqMutateButtonClickEvent, CsRqQueryButtonClickEvent,
  useCsRqMutateButtonClickEvent, useCsRqQueryButtonClickEvent,
} from "../../framework/cs/CsEvent"
import { stringRule, optionStrings, useCsInputTextItem, useCsSelectBoxItem, useCsSelectNumberBoxItem, numberRule, options } from "../../framework/cs/CsHooks"
import { TestApi, Chara, CityCreateRequest, City, Clan } from "./testApi"
import { useCsView } from "../../framework/cs/CsView"
import { useMutation, useQuery } from "react-query"
import { CsSelectNumberBoxItem } from "../../framework/cs/CsItem"
import Link from "antd/es/typography/Link"

interface CitySearchView extends CsView {
  keyword: CsInputTextItem
  searchButton: CsRqQueryButtonClickEvent<City>
  makeButton: CsRqMutateButtonClickEvent<CityCreateRequest, City>
}

export const TestEventPane: React.FC<{ colSize: number, componentType: "standard" | "antd" | "fluent" }>
  = (
    props: { colSize: number, componentType: "standard" | "antd" | "fluent" }
  ) => {
    const [editingCity, setEditingCity] = useState(new City())
    const [clans, setClans] = useState<Clan[]>(editingCity.clans)
    const [charas, setCharas] = useState<Chara[]>(editingCity.charas)
    const [showClanModal, setShowClanModal] = useState(false)
    const [editingClan, setEditingClan] = useState<Clan>(new Clan())
    const [showCharaModal, setShowCharaModal] = useState(false)
    const [editingChara, setEditingChara] = useState<Chara>(new Chara())

    const keywordItem = useCsInputTextItem("検索キーワード", useState(""), stringRule(false, 1, 100))
    const searchView = useCsView<CitySearchView>({
      readonly: false,
      keyword: keywordItem,
      searchButton: useCsRqQueryButtonClickEvent(
        useQuery(
          "getCity",
          () => TestApi.getCity(keywordItem.value ?? ""),
          { enabled: false, refetchOnWindowFocus: false, retry: 2 }
        )
      ),
      makeButton: useCsRqMutateButtonClickEvent(useMutation(TestApi.createCity)),
    })
    const clanView = useCsView<ClanMakeView>({
      readonly: false,
      name: useCsInputTextItem("名前", useState(""), stringRule(true, 1, 16)),
      description: useCsInputTextItem("説明", useState(""), stringRule(false, 1, 100)),
    })
    const charaView = useCsView<CharaMakeView>({
      readonly: false,
      name: useCsInputTextItem("名前", useState(""), stringRule(true, 1, 16)),
      job: useCsSelectBoxItem("職業", useState(""), stringRule(true),
        optionStrings(["無職", "戦士", "魔術師", "僧侶", "盗賊", "山賊", "海賊", "遊び人", "ギャンブラー", "博徒", "勇者", "修羅"])),
      clanKey: useCsSelectNumberBoxItem("クラン", useState(0), numberRule(true),
        options(editingCity.clans, "clanKey", "name")),
    })

    useMemo(() => {
      searchView.makeButton.setRequest(
        new CityCreateRequest(editingCity)
      )
    }, [editingCity, searchView.makeButton])

    return (
      <>
        <Card title="都市ロード" style={{ width: "auto" }}>
          <Row>
            <Col span={18}>
              <AxInputText showRequiredTag="none" item={searchView.keyword} />
            </Col>
            <Col span={6}>
              <AxQueryButton
                type="primary"
                validationViews={[searchView]}
                event={searchView.searchButton}
                addClassNames={["left", "bottom"]}
                successMessage="6割くらいの確率で成功しました"
                errorMessage="4割くらいの確率で失敗しました"
                validateErrorMessage="入力項目に不備があります"
              >
                検索
              </AxQueryButton>
            </Col>
          </Row>
        </Card>
        <Card title={"都市 " + editingCity.name + " の情報"} style={{ width: "100%" }} >
          <Card size="small" title="クランの一覧" style={{ width: "100%" }}>
            <Row style={{ marginBottom: "10px", height: "100%", width: "100%" }}>
              <Col span={24}>
                <AxButton type="primary"
                  onClick={() => {
                    setEditingClan(new Clan())
                    clanView.validateEvent?.resetError()
                    clanView.name.setValue("")
                    clanView.description.setValue("")
                    setShowClanModal(true)
                    return true
                  }}
                >
                  ⚔クランの追加⚔
                </AxButton>
              </Col>
            </Row>
            <Row>
              <Table
                dataSource={clans}
                style={{ width: "100%" }}
                columns={[
                  { title: "ID", dataIndex: "clanKey", key: "1" },
                  { title: "名前", dataIndex: "name", key: "2" },
                  { title: "説明", dataIndex: "description", key: "3" },
                  { title: "所属人数", dataIndex: "charaCount", key: "4" },
                  {
                    title: "操作", key: "9", render: (i, row) => {
                      return (
                        <>
                          <Link onClick={() => { setEditingClan(row); setShowClanModal(true) }}>編集</Link>
                          <span>&nbsp;</span>
                          <Link onClick={() => { }} >削除</Link>
                        </>
                      )
                    }
                  },
                ]}
                pagination={false}
                rowKey="id"
              ></Table>
            </Row>
          </Card>
          <Card size="small" title="キャラクターの一覧" style={{ width: "100%" }}>
            <div>
              <Row style={{ marginBottom: "10px", height: "100%", width: "100%" }}>
                <Col span={24}>
                  <AxButton type="primary"
                    onClick={() => {
                      setEditingChara(new Chara())
                      charaView.validateEvent?.resetError()
                      charaView.name.setValue("")
                      charaView.job.setValue("")
                      charaView.clanKey.setValue()
                      setShowCharaModal(true)
                      return true
                    }}
                  >
                    † キャラクターの追加 †
                  </AxButton>
                </Col>
              </Row>
              <Row>
                <Table
                  dataSource={charas}
                  style={{ width: "100%" }}
                  columns={[
                    { title: "ID", dataIndex: "charaKey", key: "1" },
                    { title: "名前", dataIndex: "name", key: "2" },
                    { title: "職業", dataIndex: "job", key: "3" },
                    { title: "筋力", dataIndex: "str", key: "4" },
                    { title: "耐久", dataIndex: "vit", key: "5" },
                    { title: "知力", dataIndex: "int", key: "6" },
                    { title: "器用", dataIndex: "dex", key: "7" },
                    { title: "幸運", dataIndex: "luc", key: "8" },
                    {
                      title: <span style={{ color: "red" }}>† 合計 †</span>,
                      render: (i, row: Chara) =>
                      (<span style={{ color: "blue" }}>
                        {row.str + row.vit + row.int + row.dex + row.luc}
                      </span>)
                    },
                    {
                      title: "操作", key: "9", render: (i, row) => {
                        return (
                          <>
                            <Link onClick={() => { setEditingChara(row); setShowCharaModal(true) }}>編集</Link>
                            <span>&nbsp;</span>
                            <Link onClick={() => { }} >削除</Link>
                          </>
                        )
                      }
                    },
                  ]}
                  pagination={false}
                  rowKey="id"
                ></Table>
              </Row>
            </div>
          </Card>
        </Card>
        {/* Clan Modal */}
        <Modal
          open={showClanModal}
          onCancel={() => { setShowClanModal(false) }}
          title={(editingClan?.isNew ?? true) ? "クラン作成" : "クラン更新"}
          footer={[
            <Row>
              <Col offset={16} span={4}>
                <AxButton onClick={() => { setShowClanModal(false) }}>
                  やめる
                </AxButton>
              </Col>
              <Col span={4}>
                <AxButton type="primary"
                  validationViews={[clanView]}
                  onClick={() => {
                    if (editingClan.isNew) {
                      editingCity.addClan(editingClan)
                      setClans(editingCity.clans)
                    } else {
                      setEditingClan(editingClan)
                    }
                    setShowClanModal(false)
                  }}>
                  {(editingClan?.isNew ?? true) ? "作成" : "更新"}
                </AxButton>
              </Col>
            </Row>
          ]}
        >
          <ClanEditForm
            clan={editingClan}
            view={clanView}
          // city={editingCity}
          />
        </Modal>
        {/* Chara Modal */}
        <Modal
          open={showCharaModal}
          onCancel={() => { setShowCharaModal(false) }}
          title={(editingChara?.isNew ?? true) ? "キャラ作成" : "キャラ更新"}
          footer={[
            <Row>
              <Col offset={16} span={4}>
                <AxButton onClick={() => { setShowCharaModal(false) }}>
                  やめる
                </AxButton>
              </Col>
              <Col span={4}>
                <AxButton type="primary"
                  validationViews={[charaView]}
                  onClick={() => {
                    if (editingChara.isNew) {
                      editingCity.addChara(editingChara)
                      setCharas(editingCity.charas)
                    } else {
                      setEditingChara(editingChara)
                    }
                    setShowCharaModal(false)
                  }}>
                  {(editingChara?.isNew ?? true) ? "作成" : "更新"}
                </AxButton>
              </Col>
            </Row>
          ]}

        >
          <CharaEditForm
            chara={editingChara}
            view={charaView}
          // city={editingCity}
          />
        </Modal>
      </>
    )
  }

// ClanEdit
interface ClanEditProps {
  clan: Clan
  view: ClanMakeView
  //onClickHandler: () => boolean | void
}

interface ClanMakeView extends CsView {
  name: CsInputTextItem
  description: CsInputTextItem
}

export const ClanEditForm: React.FC<ClanEditProps> = (props: ClanEditProps) => {
  const { clan, view } = props

  useEffect(() => {
    clan.name = view.name.value ?? ""
    clan.description = view.description.value ?? ""
  }, [clan, view.description.value, view.name.value])

  return (
    <>
      <CxTableLayout
        colSize={1}
        view={view}
        componentType="antd"
      />
    </>
  )
}

// CharaEdit
interface CharaEditProps {
  chara: Chara
  view: CharaMakeView
  //onClickHandler: () => boolean | void
}

interface CharaMakeView extends CsView {
  name: CsInputTextItem
  job: CsSelectBoxItem
  clanKey: CsSelectNumberBoxItem
}

export const CharaEditForm: React.FC<CharaEditProps> = (props: CharaEditProps) => {
  const { chara, view } = props

  useEffect(() => {
    chara.name = view.name.value ?? ""
    chara.job = view.job.value ?? ""
    chara.clanKey = view.clanKey.value ?? -1
  }, [chara, view.clanKey.value, view.job.value, view.name.value])

  return (
    <>
      <CxTableLayout
        colSize={1}
        view={view}
        componentType="antd"
      />
    </>
  )
}

