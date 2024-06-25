# 省力化コンポーネントの概要

画面要素を統一する、また実装を簡潔にすることを目的に「省力化コンポーネント」(Cost-saving Components)と呼ばれるコンポーネントを定義しています。本ドキュメントは、その概要や概念の説明と実装方法について述べるものです。


## 標準コンポーネントのディレクトリ構成
frameworkの下に、論理情報(logics)とそれに対応するコンポーネントが配置されています。
```
- framework
  - components ... 論理情報に対応したコンポーネント
  - logics     ... 画面や画面項目の論理情報クラス
```
## ３系統の論理情報クラス
logics の下は、カスタムフックを除きほとんどがクラスになっています。  Typeでもinterfaceでもないのは、型チェックによる分岐、フィールドの集約化・カプセル化、インスタンスメソッドを持たせる、実装の継承による再利用などが理由です。

| 系統 | 説明 |
| ------ | ------ |
| CsItem | 画面項目を表します。テキスト入力フィールドの情報 CsInputTextItem や、セレクトボックスの情報  CsSelectBoxItem などの論理情報を持ちます。カスタムフック useCsXxxItem(...) で初期化します |
| CsEvent | バリデーション処理を行うイベントや、ボタンクリック処理を行うイベントを表しています。カスタムフック useCsXxxEvent(...) で初期化します。 |
| CsView | 画面全体を管理する親クラスでCsItem,CsEventを子に持ちます。 カスタムフック useCsView(...) で初期化します。 |

論理情報クラスは、それぞれに対応したカスタムフックで初期化します。

### CsItem の中身

CsItemの中身は、クラスにもよりますが、基本的には以下の図のように、ラベルlabel、状態変数value、更新関数setValue、バリデーション情報、（セレクトやラジオのように選択肢があれば選択肢）になります。

以下に、例としてCsSelectBoxItemの内部構造を示します。
```
CsSelectBoxItem
├ value    : useStateの状態変数
├ setValue : useStateの状態更新関数
├ validationRule: バリデーションのルール（必須、最小長、最大長など）
└ selectOptions : 選択肢のオブジェクト配列
```

## 論理情報に対応したコンポーネント

上記で説明した論理情報の派生クラスごとに以下のような名前のクラスがあります。
| 系統 | 説明 |
| ------ | ------ |
| CsItem を継承したItem | CsInputTextItem, CsInputPasswordItem, LCheckBoxItem, LRadioBoxItem, CsSelectBoxItem, CsTextAreaItem, CsInputDateItem, CsInputDateRangeItem, CsInputNumberItem, CsInputNumberRangeItem, CsMultiCheckBoxItem ... |
| CsEvent を継承したEvent | CsXxxValidationEvent, CsMutateButtonClickEvent, CsQueryButtonClickEvent |

これらのItemやEventを受け取って画面表示と処理を行うXxInputText, XxCheckBox, XxMutateButton, XxQueryButton (XxはAntDesignならAx, Material UIならMux, BootstrapならBsx)などがあります。論理情報クラスは、`Cs` で始まり、画面コンポーネントは `Ax`, `Mux`, `Bsx`で始まります。
以降の説明では、Ant Designのコンポーネントを例として記述していきます。

なお、CsValidationEventは、useCsViewの内部で作られるバリデーション処理を司るクラスです。利用者が直接作ることはほぼありえません。バリデーション処理を呼び出したい場合に使うことはあります。

# 実装ガイド

## ViewとItemの定義

インターフェースとしてCsItemの派生クラスを持つViewを定義します。（ボタンイベントは後述の例で示しますのでこの例ではありません）

useCsXxxItemのカスタムフックでラベル、初期値(useInit)、バリデーション情報（stringRule, numerRuleなど）、選択肢（selectOptionStringsなど）を設定していきます。

以下にすべてのヘルパ関数を示しておきます。

- useInit(T|undefined) 初期値の設定関数。内部でuseStateを呼び出す
- stringRule, numberRule, stringArrayRule, numberArrayRule バリデーション設定関数。
- selectOptions, selectOptionStrings, selectOptionNumbers 選択肢を設定する関数。 selectOptionsはオブジェクト配列を渡します。第２引数で値に使うキー("id"など)、第３引数で選択肢のラベルに使うキー("name"など)を指定します。


以下の例はほとんどのタイプが入っているので、CsItemの書き方としてはほぼすべてのバリエーションを含んでいます。
```typescript
// CsViewを継承したTypeで画面全体とそれぞれの画面項目のタイプを定義
type TestView = CsView & {
  name: CsInputTextItem
  password: CsInputPasswordItem
  adminCheck: CsCheckBoxItem
  genderSelect: CsSelectBoxItem
  contactWay: CsRadioBoxItem
  memo: CsTextAreaItem
  age: CsInputNumberItem
  remain: CsInputNumberItem
  snsWay: CsMultiCheckBoxItem
  date: CsInputDateItem
  range1: CsInputNumberRangeItem
  other1: CsInputTextItem
  other2: CsInputTextItem
  otherA: CsInputTextItem
  range2: CsInputDateRangeItem
}

// useCsViewを使ってCsItemとCsViewを初期化する
export function useTestView(): TestView {
  const view = useCsView({
    name: useCsInputTextItem("名前", useInit(""), stringRule(true, 1, 30)),
    password: useCsInputPasswordItem("パスワード", useInit(""), stringRule(true, 1, 16)),
    adminCheck: useCsCheckBoxItem("管理者権限", useInit(false), "付与する"),
    genderSelect: useCsSelectBoxItem("性別", useInit(""), stringRule(true),
      selectOptionStrings(["男性", "女性", "未回答"])),
    contactWay: useCsRadioBoxItem("連絡方法", useInit(""), stringRule(true),
      selectOptionStrings(["メール", "電話", "訪問"])),
    age: useCsInputNumberItem("年齢", useInit(20), numberRule(true, 18, 70)),
    memo: useCsTextAreaItem("メモ", useInit(""), stringRule(true, 1, 4000)),
    snsWay: useCsMultiCheckBoxItem("SNS連絡手段",
      useInit(["SMS", "Twitter"]), selectOptionStrings(["SMS", "Line", "Twitter", "Facebook"])),
    remain: useCsInputNumberItem("残機", useInit(50), numberRule(true, 0, 999)),
    range1: useCsInputNumberRangeItem("レンジ(下限)", useInit(), useInit(),
      numberRule(true, 1, 100)),
    other1: useCsInputTextItem("ほか１", useInit("ほか１"), stringRule(false, 1, 10)),
    other2: useCsInputTextItem("ほか２", useInit("ほか２"), stringRule(false, 1, 10), RW.Editable),
    otherA: useCsInputTextItem("ほかＡ", useInit("ほかあ"), stringRule(false, 1, 10), RW.Readonly),
    date: useCsInputDateItem("日時", useInit("2023-03-01"), stringRule(true)),
  })
  return view
}

```

`selectOptionsでのオブジェクト配列の指定方法`
```tsx
  const radioOptions = [
    { label: "電話", value: "tel" },
    { label: "メール", value: "mail" },
    { label: "SMS", value: "sms" },
    { label: "SNS", value: "sns" },
  ]
  const view: MyView = useCsView({
    // ... snip ...
    connectStatus: useCsRadioBoxItem(m("連絡手段"), useInit(""), stringRule(true),
      selectOptions(radioOptions, "value", "label")),
    // ... snip ...
   })
```

### コンポーネントへCsItemの渡し方

最もシンプルな場合は、viewから取得したitemクラスの変数を渡すだけです。

```tsx
  <AxInputText item={view.nickname}/>
```

また、Ant DesignのRow/Colと組み合わせて以下のように３列ずつ分割にしたり、大きなテキストエリアは１列で表示したりします。

```tsx
  <Row>
    <Col span={8}><AxInputText item={view.name} /></Col>
    <Col span={8}><AxInputText item={view.kana} /></Col>
    <Col span={8}><AxInputText item={view.wikiUrl} /></Col>
  </Row>
  <Row>
    <Col span={8}><AxSelectBox item={view.category1} /></Col>
    <Col span={8}><AxSelectBox item={view.category2} /></Col>
    <Col span={8}><AxInputNumber item={view.capital} /></Col>
  </Row>
  <Row>
    <Col span={8}><AxInputNumber item={view.limit} /></Col>
  </Row>
  <Row>
    <Col span={24}><AxTextArea item={view.description} /></Col>
  </Row>
```

コンポーネントに少し複雑な形でPropsを渡す場合は、antdPropsというAnt Designと同じPropsを透過的に渡すこともできます。 また、独自のshowRequiredTagのようなPropを指定することもできます。（antdPropsとXxxコンポーネントで同じ名前のonClickなどを渡すとantdPropが上書きするため同じ機能のものは指定しないようにしてください。ないものを指定するための機能で上書きを期待するものではありません。）

```tsx
  <AxInputText
   item={view.name}
   antdProps={{
     placeholder:"名前プレースホルダー",
   }}
   showRequiredTag="none"
  >
```

### `選択肢がある場合にAPIで取得して遅延する必要がある時`
useCsView の段階でセレクトボックスの選択肢をAPIから取るような場合が多々あると思います。
その場合は、useCsView の段階では設定せず、下の例のようにするか、該当APIのisLoadingなどがTrueに代わってから項目のsetOptions(options, valueKey, labelKey)を呼び出せば大丈夫です。
（選択肢はuseStateで管理される状態ではなく、メモリ上の変数値ですので描画前に設定されてさえいれば動作します）

```typescript
  // この例では、取得完了後にその状態でメモリ上の値を設定しなおして再描画される
  // セレクトボックスの設定
  const category1Query = useCategory1Query() // Tanstack QueryのuseQueryをラップしたコード
  const category2Query = useCategory2Query() //
  view.category1.setOptions(category1Query.data?.data ?? [], "id", "name")
  view.category2.setOptions(category2Query.data?.data ?? [], "id", "name")
```

## CsMutateButtonClickEvent, CsQueryButtonClickEventの定義と実装
ボタンは３種類あります。Tanstack-Queryに対応したボタンが次の２種です。もう一種は後述します。
Tanstack-Queryの useMutate に対応したボタンが AxMutateButton, useQuery に対応したボタンが、 AxQueryButtonです。

### AxMutateButton / CsMutateButtonClickEvent
先にAxMutateButtonとそのイベントから説明します。

#### CsMutateButtonClickEvent イベントの定義と初期化
イベントの定義はViewのフィールドとして定義し、useCsXxxMutateButtonClickEventで初期化します。(Xxxは、Rq＝Tanstack-Query、旧React-queryと、Orval=OpenApiから自動生成するライブラリの２種類があります。)

これらのカスタムフックに渡すのは、Tanstack-QueryやOvalで自動生成されたuseMutate関数の実行結果（`useCreatePetInfo()` や `useUpdatePetInfo()`）です。これは、useCsOrvalQueryButtonClickEventでも同様です。

```tsx
//PetInfoの画面項目の定義
export type PetInfoView {
  name: CsInputTextItem
  type: CsSelectBoxItem
  price: CsInputNumberItem
  // ... snip ...
  createButton: CsOrvalMutateButtonClickEvent<{ data: PetInfoCreateRequest; }, PetInfoResponse>
  editButton: CsOrvalMutateButtonClickEvent<{ id: string; data: PetInfoUpdateRequest; }, PetInfoResponse>
}


//PetInfoの画面項目の初期化
function usePetInfoView(): PetInfoView {
  return useCsView({
    name: useCsInputTextItem(m("名前"), useInit(), stringRule(true, 1, 20)),
    // ... snip ...
    createButton: useCsOrvalMutateButtonClickEvent(useCreatePetInfo()),
    editButton: useCsOrvalMutateButtonClickEvent(useUpdatePetInfo())
  })
}
```

#### APIリクエストの設定
```tsx
    view.createButton.setRequest({
      data: {
        name: view.name.value ?? "",
        petType: view.petType.value ?? "",
        price: view.price.value ?? 0,
      }
    })
```

#### AxMutateButtonの配置
ボタンタイプ、ボタンイベント、バリデーションを実行するLViewの配列（複数指定できるようにしてあるため配列で指定します）、エラーメッセージや成功メッセージ、確認ダイアログを出す場合はそのオプション、成功後の遷移パスなどを指定できます。
```tsx
  <AxMutateButton
    event={view.createButton}
    validationViews={[view]}
    // errorMessage="エラーが起こりました"
    // successMessage="成功しました"
  >
    ペットの新規作成
  </AxMutateButton>
```

### AxQueryButton / CsQueryButtonClickEvent
ほとんどの操作は、HTTPメソッドのPOST、PUT、DELETEに対応するAxMutateButtonを使いますが、ボタンによる検索等を行う場合は、Tanstack-QueryのuseQuery関数＝HTTPメソッドのGETに対応したボタンである、AxQueryButtonを使います。

カスタムフックを使う初期化操作がAxMutateButtonと異なります。（リクエストではなく検索条件をクエリパラメータとして渡すからです。）


#### CsQueryButtonClickEvent イベントの定義と初期化
CsQueryButtonClickEventの型変数を定義しておき、検索用関数（ここではuseFindPetInfos）を指定します。
（型変数は、最初定義しないでおき、先にuseCsXxxQueryButtonClickEvent(useFindPetInfos(省略))を書いておくとVSCodeなどのエディタでマウスホバー時などにPetInfoResponse[]が表示されるので、その型をコピーして貼り付けてください。）

```tsx
export interface OutsourcerSearhFormView  {
  keyword: CsInputTextItem
  petType: CsSelectBoxItem
  searchButton: CsQueryButtonClickEvent<PetInfoResponse[]>
}
```

また、今までのViewのItemの定義はuseCsView関数の中で行っていましたが、検索条件（useFindPetInfos関数のパラメータ）で使うため、useCsView関数の外部でkeyword, petType を定義しています。

```tsx
export function usePetInfoSearchView(): PetInfoSearhFormView {
  // 検索条件で使うため、itemをuseCsViewの外で定義する
  const keyword = useCsInputTextItem(m("名前のキーワード"), useInit(""), stringRule(false))
  const petType = useCsSelectBoxItem(m("種別"), useInit(""), stringRule(false), selectOptionStrings(["いぬ","ねこ","とり"]))
  const result = useCsView<PetInfoSearhFormView>({
    readonly: false,
    keyword: keyword,         // 外で定義したものを設定するだけ
    petType: petType, // 外で定義したものを設定するだけ
    searchButton: useCsOrvalQueryButtonClickEvent(useFindPetInfos({
      keyword: keyword.value ? keyword.value : undefined,              // 検索条件に使う
      petType: petType.value ? petType.value : undefined,   // 検索条件に使う
    }))
  })
```

#### AxQueryButton の配置
配置はシンプルにeventにイベントを渡すだけになります。
もちろん、AxMutateButtonと同じPropsを利用することもできます。
```tsx
  <AxQueryButton
    type="primary"
    event={view.onSearchButton}
  >
    "ペットの検索"
  </AxQueryButton>
```

### AxButtonの説明
onClickがカスタム可能なAxMutateButton/AxQueryButtonと同様のボタンです。APIを呼び出さない場合に使います。
バリデーションの実行等ももちろんできます。

