import { useState } from "react";
import { ValueType, SetValueTypeOptional, SetValueTypeRequired } from ".";

export abstract class CsEvent {
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

export const useCsEventResult = <TApiResponse, TApiError>() => {
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

