import { CsEvent, CsItem, CsItemBase, useCsRIValidationEvent } from "."


export abstract class CsView {
  readonly?: boolean = false
  validationEvent?: CsValidationEvent
}

export abstract class CsValidationEvent {
  /** XxButtonから呼び出すためのバリデーションメソッド
   *  エラーがあったか、なかったかをbooleanとして返す
   */
  abstract onValidateHasError(): boolean

  /**
   * 項目単体のみのバリデーションメソッド
   * エラーがあったか、なかったかをbooleanとして返す
   * @param newValue 新しい値
   * @param item 項目
   */
  abstract onValidateItemHasError<T>(
    newValue: T | undefined, item: CsItem<T>
  ): boolean

  abstract validationErrorMessage(item: CsItem<any>): string

  abstract resetError(name?: string): void
}

export const executeValidation = (validationViews: CsView[] | undefined) => {
  let validationOK = true
  if (validationViews) {
    for (const view of validationViews) {
      if (view.validationEvent) {
        if (view.validationEvent.onValidateHasError()) {
          validationOK = false
        }
      }
    }
  }
  return validationOK
}

export const useCsView = <T extends CsView>(
  instance: T,
  validationEventHook: (instance: T) => CsValidationEvent = useCsRIValidationEvent
) => {
  Object.entries(instance).forEach(([key, value]) => {
    if (value instanceof CsItemBase) {
      value.key = key
      value.parentView = instance
    }
    if (value instanceof CsEvent) {
      value.key = key
      value.parentView = instance
    }
  })
  instance.validationEvent = validationEventHook(instance)
  return instance
}