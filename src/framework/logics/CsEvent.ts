import { useState } from "react";
import { UseMutationResult, UseQueryResult } from "react-query";
import { CsView } from ".";
import { ValueType, SetValueTypeOptional, SetValueTypeRequired } from ".";

export abstract class CsEvent {
  key: string = ""
  parentView?: CsView
}

export class CsEventResult<TApiResponse = unknown, TApiError = unknown> {
  isSuccess: boolean
  setIsSuccess: SetValueTypeRequired<boolean>
  response: ValueType<TApiResponse>
  setResponse: SetValueTypeOptional<TApiResponse>
  isError: boolean
  setIsError: SetValueTypeRequired<boolean>
  error: ValueType<TApiError>
  setError: SetValueTypeOptional<TApiError>
  constructor(
    isSuccess: boolean, setIsSuccess: SetValueTypeRequired<boolean>,
    response: ValueType<TApiResponse>, setResponse: SetValueTypeOptional<TApiResponse>,
    isError: boolean, setIsError: SetValueTypeRequired<boolean>,
    error: ValueType<TApiError>, setError: SetValueTypeOptional<TApiError>,
  ) {
    this.isSuccess = isSuccess
    this.setIsSuccess = setIsSuccess
    this.response = response
    this.setResponse = setResponse
    this.isError = isError
    this.setIsError = setIsError
    this.error = error
    this.setError = setError
  }

  onSuccess = (data: TApiResponse | undefined) => {
    //複数回実行時に両方設定されないようresetする
    this.reset()
    this.setIsSuccess(true)
    this.setResponse(data)
  }

  onError = (error: TApiError | undefined) => {
    //複数回実行時に両方設定されないようresetする
    this.reset()
    this.setIsError(true)
    this.setError(error)
  }

  resetFlag = () => {
    this.setIsError(false)
    this.setIsSuccess(false)
  }

  private reset = () => {
    this.setIsError(false)
    this.setIsSuccess(false)
    this.setError(undefined)
    this.setResponse(undefined)
  }
}

function useCsEventResult<TApiResponse, TApiError>() {
  const [isSuccess, setIsSuccess] = useState<boolean>(false)
  const [response, setResponse] = useState<TApiResponse>()
  const [isError, setIsError] = useState<boolean>(false)
  const [error, setError] = useState<TApiError>()
  return new CsEventResult<TApiResponse, TApiError>(
    isSuccess, setIsSuccess,
    response, setResponse,
    isError, setIsError,
    error, setError,
  )
}

export class CsRqMutateButtonClickEvent<
  TApiRequest, TApiResponse, TApiError = unknown, TContext = unknown
> extends CsEvent {
  private mutationResult: UseMutationResult<TApiResponse, TApiError, TApiRequest, TContext>
  result: CsEventResult<TApiResponse, TApiError>
  apiRequest?: TApiRequest
  constructor(
    mutationResult: UseMutationResult<TApiResponse, TApiError, TApiRequest, TContext>,
    result: CsEventResult<TApiResponse, TApiError>,
  ) {
    super()
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
> extends CsEvent {
  private queryResult: UseQueryResult<TApiResponse, TApiError>
  result: CsEventResult<TApiResponse, TApiError>

  constructor(
    queryResult: UseQueryResult<TApiResponse, TApiError>,
    result: CsEventResult<TApiResponse, TApiError>,
  ) {
    super()
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
