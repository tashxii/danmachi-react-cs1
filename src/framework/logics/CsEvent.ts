export abstract class CsEvent {
}

export abstract class CsLoadEvent<TApiResponse = unknown, TApiError = unknown> extends CsEvent {
  abstract get isLoading(): boolean
  abstract get isSuccess(): boolean
  abstract get isError(): boolean
  abstract get response(): TApiResponse | undefined
  abstract get error(): TApiError | null
}

export abstract class CsQueryLoadEvent<TApiResponse, TApiError = unknown> extends CsLoadEvent<TApiResponse, TApiError> {
  abstract reload(): void
}

export abstract class CsMutateLoadEvent<TApiResponse, TApiError = unknown> extends CsLoadEvent<TApiResponse, TApiError> {
  abstract start(): void
}

export abstract class CsActionEvent<TApiResponse = unknown, TApiError = unknown> extends CsEvent {
  abstract get isLoading(): boolean
  abstract get isSuccess(): boolean
  abstract get isError(): boolean
  abstract get response(): TApiResponse | undefined
  abstract get error(): TApiError | null
  abstract onClick(): void
}

export abstract class CsMutateButtonClickEvent<
  TApiRequest, TApiResponse = unknown, TApiError = unknown
> extends CsActionEvent<TApiResponse, TApiError> {
  apiRequest: TApiRequest | undefined
  setRequest(data: TApiRequest) {
    this.apiRequest = data
  }
}

export abstract class CsQueryButtonClickEvent<
  TApiResponse = unknown, TApiError = unknown
> extends CsActionEvent<TApiResponse, TApiError> {
}