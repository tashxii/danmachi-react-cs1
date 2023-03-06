import CsEvent, { CsCallback, CsEffect } from "./CsEvent"
import { CsItem, CsCheckBoxItem, CsItemBase, CsPasswordItem, CsRadioBoxItem, CsSelectBoxItem, CsTextAreaItem, CsInputTextItem } from "./CsItem"
import CsView from "./CsView"

export namespace Cs {
    export type View = CsView
    export namespace Item {
        export type Base = CsItemBase
        export type Item<T> = CsItem<T>
        export type TextBox = CsInputTextItem
        export type PasswordBox = CsPasswordItem
        export type TextArea = CsTextAreaItem
        export type SelectBox = CsSelectBoxItem
        export type CheckBox = CsCheckBoxItem
        export type RadioBox = CsRadioBoxItem
    }
    export namespace Event {
        export type Base = CsEvent
        export type Effect = CsEffect
        export type Callback = CsCallback
    }
}

export {
    CsItemBase,
    CsItem,
    CsInputTextItem,
    CsTextAreaItem,
    CsPasswordItem,
    CsCheckBoxItem,
    CsSelectBoxItem,
    CsRadioBoxItem,
    CsEvent,
    CsEffect,
    CsCallback,
    CsView,
}
