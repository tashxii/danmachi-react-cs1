import React, { useEffect, useMemo, useState } from "react"
import { Card, Col, Modal, Row, Table } from "antd"
import { AxButton, AxQueryButton, AxInputText, AxTableLayout } from "../../framework/components/antd"
import {
  CsRqMutateButtonClickEvent, CsRqQueryButtonClickEvent,
  useCsRqMutateButtonClickEvent, useCsRqQueryButtonClickEvent,
  CsInputTextItem, CsSelectBoxItem, CsView, useCsView
} from "../../framework/logics"
import { stringRule, selectOptionStrings, useCsInputTextItem, useCsSelectBoxItem, useCsSelectNumberBoxItem, numberRule, selectOptions, useInit } from "../../framework/logics"
import { TestApi } from "./testApi"
import { useMutation, useQuery } from "@tanstack/react-query"
import { CsSelectNumberBoxItem } from "../../framework/logics"
import Link from "antd/es/typography/Link"
import { City, CityCreateRequest, Clan, Chara } from "./testApiClasses"

export type CitySearchView = CsView & {
  keyword: CsInputTextItem
  searchButton: CsRqQueryButtonClickEvent<City>
  makeButton: CsRqMutateButtonClickEvent<CityCreateRequest, City>
}

export const TestEventPane: React.FC<{ colSize: number, componentType: "standard" | "antd" | "mui" | "bootstrap" }>
  = (
    props: { colSize: number, componentType: "standard" | "antd" | "mui" | "bootstrap" }
  ) => {
    const [editingCity] = useState(new City())
    const [clans, setClans] = useState<Clan[]>(editingCity.clans)
    const [charas, setCharas] = useState<Chara[]>(editingCity.charas)
    const [showClanModal, setShowClanModal] = useState(false)
    const [editingClan, setEditingClan] = useState<Clan>(new Clan())
    const [showCharaModal, setShowCharaModal] = useState(false)
    const [editingChara, setEditingChara] = useState<Chara>(new Chara())

    const keywordItem = useCsInputTextItem("検索キーワード", useInit(""), stringRule(false, 1, 100))
    const searchView = useCsView({
      keyword: keywordItem,
      searchButton: useCsRqQueryButtonClickEvent(
        useQuery(
          {
            queryKey: ["getCity"], enabled: false, refetchOnWindowFocus: false, retry: 2,
            queryFn: () => { return TestApi.getCity(keywordItem.value ?? "") },
          },
        )
      ),
      makeButton: useCsRqMutateButtonClickEvent(useMutation({ mutationFn: TestApi.createCity })),
    })
    const clanView = useCsView({
      readonly: false,
      name: useCsInputTextItem("名前", useInit(""), stringRule(true, 1, 16)),
      description: useCsInputTextItem("説明", useInit(""), stringRule(false, 1, 100)),
    })
    const charaView = useCsView({
      readonly: false,
      name: useCsInputTextItem("名前", useInit(""), stringRule(true, 1, 16)),
      job: useCsSelectBoxItem("職業", useInit(""), stringRule(true),
        selectOptionStrings(["無職", "戦士", "魔術師", "僧侶", "盗賊", "山賊", "海賊", "遊び人", "ギャンブラー", "博徒", "勇者", "修羅"])),
      clanKey: useCsSelectNumberBoxItem("クラン", useInit(), numberRule(true),
        selectOptions(editingCity.clans, "clanKey", "name")),
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
                    clanView.validationEvent?.resetError()
                    clanView.name.setValue("")
                    clanView.description.setValue("")
                    setShowClanModal(true)
                    return true
                  }}
                >
                  ⚔ クランの追加 ⚔
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
                          <Link style={{ marginRight: "10px" }}
                            onClick={() => {
                              const clan = new Clan()
                              // 参照を渡すとキャンセルでロールバックできないので、コピーを渡す
                              Object.assign(clan, row)
                              setEditingClan(clan)
                              clanView.name.setValue(clan.name)
                              setShowClanModal(true)
                            }}>編集</Link>

                          <Link style={{ color: "red" }}
                            onClick={() => {
                              editingCity.removeClan(row)
                              setClans(editingCity.clans)
                            }} >削除</Link>
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
                      charaView.validationEvent?.resetError()
                      charaView.name.setValue("")
                      charaView.job.setValue("")
                      charaView.clanKey.setValue(clans.at(0)?.clanKey ?? -1)
                      setShowCharaModal(true)
                      return true
                    }}
                    disabledReason="クランがないのでキャラクターは追加できません。"
                    antdProps={{
                      disabled: (clans.length === 0),
                    }}
                  >
                    🗡 キャラクターの追加 🗡
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
                            <Link style={{ marginRight: "10px" }}
                              onClick={() => {
                                const chara = new Chara()
                                Object.assign(chara, row)
                                // 参照を渡すとキャンセルでロールバックできないので、コピーを渡す
                                setEditingChara(chara)
                                charaView.name.setValue(chara.name)
                                charaView.job.setValue(chara.job)
                                charaView.clanKey.setValue(chara.clanKey ?? -1)
                                setShowCharaModal(true)
                              }}>編集</Link>
                            <Link style={{ color: "red" }}
                              onClick={() => {
                                editingCity.removeChara(row)
                                setCharas(editingCity.charas)
                              }} >削除</Link>
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
          destroyOnClose={true}
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
                      setClans((prev) => (prev.map(c => (c.clanKey === editingClan.clanKey) ? editingClan : c)))
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
          destroyOnClose={true}
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
                      setCharas((prev) => (prev.map(c => (c.charaKey === editingChara.charaKey) ? editingChara : c)))
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

type ClanMakeView = CsView & {
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
      <AxTableLayout
        colSize={1}
        view={view}
      />
    </>
  )
}

// CharaEdit
interface CharaEditProps {
  chara: Chara
  view: CharaMakeView
}

type CharaMakeView = CsView & {
  name: CsInputTextItem
  job: CsSelectBoxItem
  clanKey: CsSelectNumberBoxItem
}

export const CharaEditForm: React.FC<CharaEditProps> = (props: CharaEditProps) => {
  const { chara, view } = props

  useEffect(() => {
    chara.name = view.name.value ?? ""
    chara.job = view.job.value ?? ""
    chara.clanKey = view.clanKey.value
  }, [chara, view.clanKey.value, view.job.value, view.name.value])

  return (
    <>
      <AxTableLayout
        colSize={1}
        view={view}
      />
    </>
  )
}

