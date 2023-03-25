import { CsItem, CsStringItem } from ".";

export class CsInputDateItem extends CsStringItem {
  //Genericの型変数だけで一致した場合でも、同一型とみなされるための回避用の識別子
  private identifier?: CsInputDateItem

  static dateValueFormat: string = "YYYY-MM-DDTHH:mm:ssZ"
  static dateDisplayFormat: string = "YYYY/MM/DD"
  static dateTimeValueFormat: string = "YYYY-MM-DDTHH:mm:ssZ"
  static dateTimeDisplayFormt: string = "YYYY/MM/DD HH:mm:ss"
}

export abstract class CsRangeItem<V extends string | number, T extends V[]> extends CsItem<T> {
  get lowerValue() {
    if (this.value && this.value.length === 2) {
      return this.value[0]
    }
    return undefined
  }

  setLowerValue = (value: V | undefined) => {
    this.setValue([value, this.upperValue] as T)
  }

  get upperValue() {
    if (this.value && this.value.length === 2) {
      return this.value[1]
    }
    return undefined
  }

  setUpperValue = (value: V | undefined) => {
    this.setValue([this.lowerValue, value] as T)
  }

  setRangeValue = (lower: V | undefined, upper: V | undefined) => {
    this.setValue([lower, upper] as T)
  }
}

export class CsNumberRangeItem extends CsRangeItem<number, number[]> {
  private itemIdentifier?: CsNumberRangeItem
}

export class CsInputNumberRangeItem extends CsNumberRangeItem {
  //Genericの型変数だけで一致した場合でも、同一型とみなされるための回避用の識別子
  private identifier?: CsInputNumberRangeItem
}

export class CsStringRangeItem extends CsRangeItem<string, string[]> {
  private itemIdentifier?: CsStringRangeItem
}

export class CsInputDateRangeItem extends CsStringRangeItem {
  //Genericの型変数だけで一致した場合でも、同一型とみなされるための回避用の識別子
  private identifier?: CsInputNumberRangeItem
}
