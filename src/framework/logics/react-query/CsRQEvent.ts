import { UseMutationResult, UseQueryResult } from "react-query"
import { CsEventResult, useCsEventResult } from ".."

export class CsRqMutateButtonClickEvent<
  TApiRequest, TApiResponse, TApiError = unknown, TContext = unknown
> {
  private mutationResult: UseMutationResult<TApiResponse, TApiError, TApiRequest, TContext>
  result: CsEventResult<TApiResponse, TApiError>
  apiRequest?: TApiRequest
  constructor(
    mutationResult: UseMutationResult<TApiResponse, TApiError, TApiRequest, TContext>,
    result: CsEventResult<TApiResponse, TApiError>,
  ) {
    this.mutationResult = mutationResult
    this.result = result
  }

  setRequest(data: TApiRequest) {
    this.apiRequest = data
  }

  get isLoading() {
    return this.mutationResult.isLoading
  }

  get isError() {
    return this.mutationResult.isError
  }

  get isSuccess() {
    return this.mutationResult.isSuccess
  }

  onClick = async () => {
    if (this.apiRequest) {
      this.reset()
      await this.mutationResult.mutateAsync(this.apiRequest)
    }
  }

  setError() {
    this.result.onError(this.mutationResult.error ?? undefined)
    this.mutationResult.reset()
  }

  setResponse() {
    this.result.onSuccess(this.mutationResult.data)
    this.mutationResult.reset()
  }

  reset() {
    this.result.resetFlag()
    this.result.setError(undefined)
    this.result.setResponse(undefined)
  }
}

export class CsRqQueryButtonClickEvent<
  TApiResponse, TApiError = unknown,
> {
  private queryResult: UseQueryResult<TApiResponse, TApiError>
  result: CsEventResult<TApiResponse, TApiError>

  constructor(
    queryResult: UseQueryResult<TApiResponse, TApiError>,
    result: CsEventResult<TApiResponse, TApiError>,
  ) {
    this.queryResult = queryResult
    this.result = result
  }

  get isRefetching() {
    return this.queryResult.isRefetching
  }

  get isError() {
    return this.queryResult.isError
  }

  get isSuccess() {
    return this.queryResult.isSuccess
  }

  get response() {
    return this.result.response
  }

  onClick = async () => {
    this.reset()
    this.queryResult.isSuccess = false
    this.queryResult.isError = false
    await this.queryResult.refetch()
  }

  setError() {
    this.result.onError(this.queryResult.error ?? undefined)
  }

  setResponse() {
    this.result.onSuccess(this.queryResult.data)
  }

  reset() {
    this.result.resetFlag()
    this.result.setError(undefined)
    this.result.setResponse(undefined)
  }
}

export function useCsRqMutateButtonClickEvent<TApiRequest, TApiResponse, TApiError, TContext = unknown>
  (
    mutationResult: UseMutationResult<TApiResponse, TApiError, TApiRequest, TContext>,
  )
  : CsRqMutateButtonClickEvent<TApiRequest, TApiResponse, TApiError, TContext> {
  const result = useCsEventResult<TApiResponse, TApiError>()
  return new CsRqMutateButtonClickEvent<TApiRequest, TApiResponse, TApiError, TContext>(
    mutationResult, result,
  )
}

export function useCsRqQueryButtonClickEvent<TApiResponse, TApiError>
  (
    queryResult: UseQueryResult<TApiResponse, TApiError>,
  )
  : CsRqQueryButtonClickEvent<TApiResponse, TApiError> {
  const result = useCsEventResult<TApiResponse, TApiError>()
  return new CsRqQueryButtonClickEvent<TApiResponse, TApiError>(
    queryResult, result,
  )
}
