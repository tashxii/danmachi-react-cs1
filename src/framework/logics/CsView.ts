import { CsItem, CsRIValidationEvent, CsRIView, CsZodValidationEvent, CsZodView } from "."


export abstract class CsView {
  readonly?: boolean = false
  validationEvent?: CsValidationEvent
}

export abstract class CsValidationEvent {
  /** XxButtonから呼び出すためのバリデーションメソッド
   *  エラーがあったか、なかったかをbooleanとして返す
   */
  abstract onValidateHasError(view: CsView): boolean

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
        if (view.validationEvent.onValidateHasError(view)) {
          validationOK = false
        }
      }
    }
  }
  return validationOK
}
