import { QueryKey, UseMutationResult, UseQueryResult } from "@tanstack/react-query"
import { AxiosResponse } from "axios"
import { useEffect, useMemo, useState } from "react"
import { CsEvent, CsLoadEvent, CsMutateButtonClickEvent } from ".."

type OvMutationResult<TApiResponse, TApiError = unknown, TApiRequest = unknown, TContext = unknown>
  = UseMutationResult<AxiosResponse<TApiResponse, any>, TApiError, TApiRequest, TContext>

export class CsOvMutateButtonClickEvent<
  TApiRequest, TApiResponse, TApiError = unknown, TContext = unknown
> extends CsMutateButtonClickEvent<TApiRequest, TApiResponse, TApiError> {
  private mutationResult: OvMutationResult<TApiResponse, TApiError, TApiRequest, TContext>
  constructor(mutationResult: OvMutationResult<TApiResponse, TApiError, TApiRequest, TContext>) {
    super()
    this.mutationResult = mutationResult
  }

  get isLoading() {
    // https://tanstack.com/query/v5/docs/framework/react/guides/migrating-to-v5
    // For mutations as well the status has been changed from loading to pending and the isLoading flag has been changed to isPending.
    return this.mutationResult.isPending
  }

  get isError() {
    return this.mutationResult.isError
  }

  get isSuccess() {
    return this.mutationResult.isSuccess
  }

  get response() {
    return this.mutationResult.data?.data
  }

  get error() {
    return this.mutationResult.error
  }

  onClick = async () => {
    if (this.apiRequest) {
      await this.mutationResult.mutateAsync(this.apiRequest)
    }
  }
}

export type OvQueryResult<TApiResponse, TApiError = unknown> = UseQueryResult<AxiosResponse<TApiResponse, any>, TApiError> & { queryKey: QueryKey }

export class CsOvQueryButtonClickEvent<TApiResponse, TApiError = unknown> extends CsEvent {
  private queryResult: OvQueryResult<TApiResponse, TApiError>

  constructor(queryResult: OvQueryResult<TApiResponse, TApiError>) {
    super()
    this.queryResult = queryResult
  }

  get isLoading() {
    return this.queryResult.isRefetching
  }

  get isError() {
    return this.queryResult.isError
  }

  get isSuccess() {
    return this.queryResult.isSuccess
  }

  get error(): TApiError | null {
    return this.queryResult.error
  }

  get response(): TApiResponse | undefined {
    return this.queryResult.data?.data
  }

  onClick = async () => {
    await this.queryResult.refetch()
  }
}

export class CsOvQueryLoadEvent<TApiResponse, TApiError = unknown> extends CsLoadEvent {
  private queryResult: OvQueryResult<TApiResponse, TApiError>

  constructor(queryResult: OvQueryResult<TApiResponse, TApiError>) {
    super()
    this.queryResult = queryResult
  }

  get queryKey(): QueryKey {
    return this.queryResult.queryKey
  }

  get isLoading(): boolean {
    return this.queryResult.isFetching || this.queryResult.isRefetching
  }

  get isError(): boolean {
    return this.queryResult.isError
  }

  get isSuccess(): boolean {
    return this.queryResult.isSuccess
  }

  get response(): TApiResponse | undefined {
    return this.queryResult.data?.data
  }

  get error(): TApiError | null {
    return this.queryResult.error
  }

  reload = async () => {
    await this.queryResult.refetch()
  }
}

export class CsOvMutateLoadEvent<TApiRequest, TApiResponse, TApiError = unknown, TContext = unknown> extends CsLoadEvent {
  private mutationResult: OvMutationResult<TApiResponse, TApiError, TApiRequest, TContext>
  apiRequest?: TApiRequest
  constructor(mutationResult: OvMutationResult<TApiResponse, TApiError, TApiRequest, TContext>) {
    super()
    this.mutationResult = mutationResult
  }

  setRequest(data: TApiRequest) {
    this.apiRequest = data
  }

  get isLoading() {
    // https://tanstack.com/query/v5/docs/framework/react/guides/migrating-to-v5
    // For mutations as well the status has been changed from loading to pending and the isLoading flag has been changed to isPending.
    return this.mutationResult.isPending
  }

  get isError(): boolean {
    return this.mutationResult.isError
  }

  get isSuccess(): boolean {
    return this.mutationResult.isSuccess
  }

  get response(): TApiResponse | undefined {
    return this.mutationResult.data?.data
  }

  get error(): TApiError | null {
    return this.mutationResult.error
  }

  start = async () => {
    if (this.apiRequest) {
      await this.mutationResult.mutateAsync(this.apiRequest)
    }
  }
}

export function useCsOvMutateButtonClickEvent<TApiRequest, TApiResponse, TApiError, TContext = unknown>(
  mutationResult: OvMutationResult<TApiResponse, TApiError, TApiRequest, TContext>,
): CsOvMutateButtonClickEvent<TApiRequest, TApiResponse, TApiError, TContext> {
  return new CsOvMutateButtonClickEvent<TApiRequest, TApiResponse, TApiError, TContext>(mutationResult)
}

export function useCsOvQueryButtonClickEvent<TApiResponse>(
  queryResult: OvQueryResult<TApiResponse>
): CsOvQueryButtonClickEvent<TApiResponse> {
  return new CsOvQueryButtonClickEvent<TApiResponse>(queryResult)
}

export function useCsOvMutateLoadEvent<TApiRequest, TApiResponse, TApiError, TContext = unknown>(
  mutationResult: OvMutationResult<TApiResponse, TApiError, TApiRequest, TContext>,
  request: TApiRequest,
): CsOvMutateLoadEvent<TApiRequest, TApiResponse, TApiError, TContext> {
  const mutateLoadEvent = useMemo(() => {
    return new CsOvMutateLoadEvent<TApiRequest, TApiResponse, TApiError, TContext>(mutationResult)
  }, [mutationResult])
  const [init, setInit] = useState(false)
  mutateLoadEvent.setRequest(request)
  useEffect(() => {
    (async () => {
      if (!init) {
        setInit(true)
        await mutateLoadEvent.start()
      }
    })()
  }, [init, mutateLoadEvent])
  return mutateLoadEvent
}

export function useCsOvQueryLoadEvent<TApiResponse>(
  queryResult: OvQueryResult<TApiResponse>
): CsOvQueryLoadEvent<TApiResponse> {
  const queryLoadEvent = new CsOvQueryLoadEvent<TApiResponse>(queryResult)
  return queryLoadEvent
}
