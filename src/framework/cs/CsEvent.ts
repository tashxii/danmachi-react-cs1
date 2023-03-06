import { AvailableFiledType, ValidationError } from "../validation/Validation";
import CsView from "./CsView";

export default abstract class CsEvent { }

export class CsValidationEvent extends CsEvent {
    validationError: ValidationError<AvailableFiledType>
    resetError: () => void
    private handleSubmit: (value: AvailableFiledType, callback: (event: React.FormEvent<HTMLFormElement>) => void, onError?: (event: React.FormEvent<HTMLFormElement>) => void) => (event: React.FormEvent<HTMLFormElement>) => void
    constructor(
        error: ValidationError<AvailableFiledType>,
        resetError: () => void,
        handleSubmit: (value: AvailableFiledType, callback: (event: React.FormEvent<HTMLFormElement>) => void, onError?: (event: React.FormEvent<HTMLFormElement>) => void) => (event: React.FormEvent<HTMLFormElement>) => void
    ) {
        super()
        this.validationError = error
        this.resetError = resetError
        this.handleSubmit = handleSubmit
    }

    onHandleSubmit = (
        view: CsView,
        callback: (event: React.FormEvent<HTMLFormElement>) => void,
        onError?: (event: React.FormEvent<HTMLFormElement>) => void)
        : (event: React.FormEvent<HTMLFormElement>) => void => {
        const value = Object.fromEntries(view.validateFieldMap!)
        const result = this.handleSubmit(value, callback, onError)
        return result
    }
}
