import { UseMutationResult } from "react-query";
import { AvailableFiledType, ConstraintValidators, ValidationError } from "../validation/Validation";
import CsView from "./CsView";

export default abstract class CsEvent { }

export class CsValidationEvent extends CsEvent {
    validationError: ValidationError<AvailableFiledType>
    resetError: () => void
    validator: ConstraintValidators<AvailableFiledType>
    private handleSubmit: (value: AvailableFiledType, callback: (event: React.FormEvent<HTMLFormElement>) => void, onError?: (event: React.FormEvent<HTMLFormElement>) => void) => (event: React.FormEvent<HTMLFormElement>) => void
    constructor(
        error: ValidationError<AvailableFiledType>,
        validator: ConstraintValidators<AvailableFiledType>,
        resetError: () => void,
        handleSubmit: (value: AvailableFiledType, callback: (event: React.FormEvent<HTMLFormElement>) => void, onError?: (event: React.FormEvent<HTMLFormElement>) => void) => (event: React.FormEvent<HTMLFormElement>) => void
    ) {
        super()
        this.validationError = error
        this.validator = validator
        this.resetError = resetError
        this.handleSubmit = handleSubmit
    }

    /** Form でのサブミットを使用する際に利用する。Formを使う意味はほとんどなく、XxButtonを使用してればOnClickまえに検証が行えるため、非推奨 */
    onHandleSubmit = (
        view: CsView,
        callback: (event: React.FormEvent<HTMLFormElement>) => void,
        onError?: (event: React.FormEvent<HTMLFormElement>) => void)
        : (event: React.FormEvent<HTMLFormElement>) => void => {
        const value = Object.fromEntries(view.validateFieldMap!)
        const result = this.handleSubmit(value, callback, onError)
        return result
    }

    /** XButtonから呼び出すためのバリデーションメソッド 成功か、失敗かをbooleanとして返す */
    onValidateHasError = (view: CsView): boolean => {
        const value = Object.fromEntries(view.validateFieldMap!)
        return this.validator.validateAll(value)
    }
}

export class CsButtonClickEvent<TRequest> extends CsEvent {
    context?: any
    data?: any
    error?: null | any
    //    failureCount: number
    isError: boolean
    isIdle: boolean
    isLoading: boolean
    isPaused: boolean
    isSuccess: boolean
    mutate: (variables: any, mutateOptions: any) => any
    mutateAsync: Function
    reset: Function
    status: string
    //    variables?: any
    requestData?: TRequest

    constructor(context: any, data: any, error: any,
        isError: boolean, isIdle: boolean, isLoading: boolean, isPaused: boolean,
        isSuccess: boolean, mutate: (variables: any, mutateOptions: any) => any, mutateAsync: Function,
        reset: Function, status: string) {
        super()
        this.context = context
        this.data = data
        this.error = error
        this.isError = isError
        this.isIdle = isIdle
        this.isLoading = isLoading
        this.isPaused = isPaused
        this.isSuccess = isSuccess
        this.mutate = mutate
        this.mutateAsync = mutateAsync
        this.reset = reset
        this.status = status
    }

    setRequestData(data: TRequest) {
        this.requestData = data
    }

    async onMutateAsync(data: any) {
        await this.mutateAsync(data)
    }
}

export function useCsButtonClickEvent<TRequestData, TData = unknown, TError = unknown, TContext = unknown, TRequest = unknown>
    (result: UseMutationResult<TData, TError, TRequestData, TContext>): CsButtonClickEvent<TRequestData> {
    return new CsButtonClickEvent<TRequestData>(
        result.context, result.data, result.error,
        result.isError, result.isIdle, result.isLoading, result.isPaused,
        result.isSuccess, result.mutate, result.mutateAsync, result.reset, result.status
    );
}
