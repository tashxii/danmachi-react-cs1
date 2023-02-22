import CsEvent, { CsCallback, CsEffect } from "./CsEvent"
import CsItem, { CsCheckBoxItem, CsItemBase, CsPasswordBoxItem, CsRadioBoxItem, CsSelectBoxItem, CsTextAreaItem, CsTextBoxItem } from "./CsItem"
import CsView from "./CsView"

export namespace Cs {
    export type View = CsView
    export namespace Item {
        export type Base = CsItemBase
        export type Item<T> = CsItem<T>
        export type TextBox = CsTextBoxItem
        export type PasswordBox = CsPasswordBoxItem
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
    CsTextBoxItem,
    CsTextAreaItem,
    CsPasswordBoxItem,
    CsCheckBoxItem,
    CsSelectBoxItem,
    CsRadioBoxItem,
    CsEvent,
    CsEffect,
    CsCallback,
    CsView,
}
