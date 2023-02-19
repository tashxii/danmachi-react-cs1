import CsEvent from "./CsEvent"
import { CsItemBase } from "./CsItem"

export default abstract class CsView {
    readonly: boolean = false
}

export class CsViewBuilder {
    build<T extends CsView>(
        type: { new(): T ;},
        params?: Exclude<T, CsItemBase|CsEvent>,
        items?: Extract<T,CsItemBase>,
        events?: Extract<T,CsEvent>
    ) : T {
        const result = new type()
        Object.assign(result, params)
        Object.assign(result, items)
        Object.assign(result, events)
        return result
    }
}