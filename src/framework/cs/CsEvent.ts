import React, { useCallback, useState } from "react";
import { MutationFunction, useMutation, UseMutationResult, UseQueryResult } from "react-query";
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

export function useOnApiSuccess<TApiResponse, TApiRequest, TApiError, TContext = unknown>(
    status: CsEventResult<TApiResponse, TApiError>,
    onSuccessCallback?: (data: TApiResponse, variables: TApiRequest, context: TContext | undefined) => void | Promise<unknown>,
) {
    return useCallback((data: TApiResponse, variables: TApiRequest, context: TContext | undefined) => {
        status.onSuccess(data)
        if (onSuccessCallback) {
            onSuccessCallback(data, variables, context)
        }
    }, [status, onSuccessCallback])
}

export function useOnApiError<TApiResponse, TApiRequest, TApiError, TContext>(
    status: CsEventResult<TApiResponse, TApiError>,
    onErrorCallback?: (error: TApiError, variables: TApiRequest, context: TContext | undefined) => void | Promise<unknown>
) {
    return useCallback((error: TApiError, variables: TApiRequest, context: TContext | undefined) => {
        status.onError(error)
        if (onErrorCallback) {
            onErrorCallback(error, variables, context)
        }
    }, [onErrorCallback, status])
}

export class CsButtonClickEvent<
    TApiRequest, TApiResponse, TApiError = unknown,
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

export class CsRQMutateButtonClickEvent<
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
        if(this.apiRequest) {
            this.reset()
            try{
                //this.result.setIsProcessing(true)
                await this.mutationResult.mutateAsync(this.apiRequest)
                console.log("!!!", this)
            } finally {
                //this.result.setIsProcessing(false)
            }
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

export class CsRQQueryButtonClickEvent<
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

export function useRQCsButtonClickEvent<TApiRequest, TApiResponse, TApiError, TContext = unknown>
    (
        mutateKey: string,
        mutateTargetFunction: MutationFunction<TApiResponse, TApiRequest>,
        callback?: {
            onSuccessCallback?: (data: TApiResponse, variables: TApiRequest, context: TContext | undefined) => void | Promise<unknown>
            onErrorCallback?: (error: TApiError, variables: TApiRequest, context: TContext | undefined) => void | Promise<unknown>
        }
    )
    : CsButtonClickEvent<TApiRequest, TApiResponse, TApiError> {
    const result = useCsEventResult<TApiResponse, TApiError>()
    const mutate = useMutation<TApiResponse, TApiError, TApiRequest, TContext | undefined>(mutateKey, mutateTargetFunction, {
        onSuccess: useOnApiSuccess(result, callback?.onSuccessCallback),
        onError: useOnApiError(result, callback?.onErrorCallback),
    })

    const callApiAync = async (apiRequest: TApiRequest) => {
        await mutate.mutateAsync(apiRequest)
    }

    return new CsButtonClickEvent<TApiRequest, TApiResponse, TApiError>(
        callApiAync, result, mutate.isLoading,
    )
}


export function useCsRQMutateButtonClickEvent<TApiRequest, TApiResponse, TApiError, TContext = unknown>
    (
        mutationResult: UseMutationResult<TApiResponse, TApiError, TApiRequest, TContext>,
    )
    : CsRQMutateButtonClickEvent<TApiRequest, TApiResponse, TApiError, TContext> {
    const result = useCsEventResult<TApiResponse, TApiError>()
    return new CsRQMutateButtonClickEvent<TApiRequest, TApiResponse, TApiError, TContext>(
        mutationResult, result,
    )
}


export function useCsRQQueryButtonClickEvent<TApiResponse, TApiError>
    (
        queryResult: UseQueryResult<TApiResponse, TApiError>,
    )
    : CsRQQueryButtonClickEvent<TApiResponse, TApiError> {
    const result = useCsEventResult<TApiResponse, TApiError>()
    return new CsRQQueryButtonClickEvent<TApiResponse, TApiError>(
        queryResult, result,
    )
}
