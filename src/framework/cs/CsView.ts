import CsEvent, { CsCallback, CsEffect } from "./CsEvent"
import CsItem, { CsItemBase } from "./CsItem"
import React, { useState } from "react"

export default abstract class CsView {
    readonly: boolean = false
}

export function useInitView<T extends CsView>(
    type: { new(): T },
    params?: Exclude<T, CsItemBase | CsEvent>,
    items?: Extract<T, CsItemBase>,
    events?: Extract<T, CsEffect | CsEvent>
): T {
    const result = new type()
    Object.assign(result, params)
    Object.assign(result, items)
    Object.assign(result, events)
    result.readonly = false
    return result
}
