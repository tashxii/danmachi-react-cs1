import React, { useCallback, useState } from "react";
import { MutationFunction, useMutation, UseMutationResult } from "react-query";
import { AvailableFiledType, ConstraintValidators, ValidationError } from "../validation/Validation";
import { ValueType, SetValueType, SetValueTypeOptional } from "./CsItem";
import CsView from "./CsView";

export default abstract class CsEvent { }

export type ValidationCallback = (event: React.FormEvent<HTMLFormElement>) => void

export class CsValidationEvent extends CsEvent {
    validationError: ValidationError<AvailableFiledType>
    validator: ConstraintValidators<AvailableFiledType>
    resetError: () => void
    private handleSubmit: (value: AvailableFiledType, callback: ValidationCallback, onError?: ValidationCallback) => ValidationCallback
    constructor(
        error: ValidationError<AvailableFiledType>,
        validator: ConstraintValidators<AvailableFiledType>,
        resetError: () => void,
        handleSubmit: (value: AvailableFiledType, callback: ValidationCallback, onError?: ValidationCallback) => ValidationCallback
    ) {
        super()
        this.validationError = error
        this.validator = validator
        this.resetError = resetError
        this.handleSubmit = handleSubmit
    }

    /** Form でのサブミットを使用する際に利用する。Formを使う意味はほとんどなく、
     *  XxButtonを使用してればOnClickまえに検証が行えるため、非推奨 */
    onHandleSubmit = (
        view: CsView,
        callback: ValidationCallback,
        onError?: ValidationCallback)
        : ValidationCallback => {
        const value = Object.fromEntries(view.validateFieldMap!)
        const result = this.handleSubmit(value, callback, onError)
        return result
    }

    /** XxButtonから呼び出すためのバリデーションメソッド 
     *  エラーがあったか、なかったかをbooleanとして返す */
    onValidateHasError = (view: CsView): boolean => {
        const value = Object.fromEntries(view.validateFieldMap!)
        return this.validator.validateAll(value)
    }
}

export class CsEventResult<TApiResponse = unknown, TApiError = unknown> {
    isSuccess: boolean
    setIsSuccess: SetValueType<boolean>
    response: ValueType<TApiResponse>
    setResponse: SetValueTypeOptional<TApiResponse>
    isError: boolean
    setIsError: SetValueType<boolean>
    error: ValueType<TApiError>
    setError: SetValueTypeOptional<TApiError>
    constructor(
        isSuccess: boolean, setIsSuccess: SetValueType<boolean>,
        response: ValueType<TApiResponse>, setResponse: SetValueTypeOptional<TApiResponse>,
        isError: boolean, setIsError: SetValueType<boolean>,
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

    onApiSuccess = (data: TApiResponse) => {
        //複数回実行時に両方設定されないようresetする
        this.reset()
        this.setIsSuccess(true)
        this.setResponse(data)
    }

    onApiError = (error: TApiError) => {
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


export class CsButtonClickEvent<
    TApiRequest = unknown, TApiResponse = unknown, TApiError = unknown, TContext = unknown
> extends CsEvent {
    callApiAsync: (apiRequest: TApiRequest) => Promise<void>
    result: CsEventResult<TApiResponse, TApiError>
    isLoading: boolean
    apiRequest?: TApiRequest
    constructor(
        callApiAsync: (apiRequest: TApiRequest) => Promise<void>,
        result: CsEventResult<TApiResponse, TApiError>,
        isLoading: boolean,
    ) {
        super()
        this.callApiAsync = callApiAsync
        this.result = result
        this.isLoading = isLoading
    }

    setApiRequest(data: TApiRequest) {
        this.apiRequest = data
    }
}

export function useRQCsButtonClickEvent<TApiRequest, TApiResponse, TApiError, TContext = unknown>
    (
        mutateKey: string,
        mutateTargetFunction: MutationFunction<TApiResponse, TApiRequest>
    )
    : CsButtonClickEvent<TApiRequest, TApiResponse, TApiError> {
    const result = useCsEventResult<TApiResponse, TApiError>()
    const mutate = useMutation<TApiResponse, TApiError, TApiRequest>(mutateKey, mutateTargetFunction, {
        onSuccess: useOnApiSuccess(result),
        onError: useOnApiError(result),
    })

    const callApiAync = async (apiRequest: TApiRequest) => {
        await mutate.mutateAsync(apiRequest)
    }

    return new CsButtonClickEvent<TApiRequest, TApiResponse, TApiError>(
        callApiAync, result, mutate.isLoading,
    )
}
