export class Validation {

    private _isSubmited: boolean;
    private _isButtonDisabled: boolean;
    private _isComponentDisabled: boolean;
    private _isSending: boolean;

    constructor() {
        this.isSubmited = false;
        this.isButtonDisabled = false;
        this.isComponentDisabled = false;
        this.isSending = false;
    }

    get isSubmited(): boolean {
        return this._isSubmited;
    }

    set isSubmited(value: boolean) {
        this._isSubmited = value;
    }

    get isButtonDisabled(): boolean {
        return this._isButtonDisabled;
    }

    set isButtonDisabled(value: boolean) {
        this._isButtonDisabled = value;
    }

    get isComponentDisabled(): boolean {
        return this._isComponentDisabled;
    }

    set isComponentDisabled(value: boolean) {
        this._isComponentDisabled = value;
    }

    get isSending(): boolean {
        return this._isSending;
    }

    set isSending(value: boolean) {
        this._isSending = value;
    }
}
