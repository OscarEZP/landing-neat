export class Validation {

    private _isSubmited: boolean;
    private _isButtonDisabled: boolean;
    private _isComponentDisabled: boolean;
    private _isSending: boolean;


    constructor(isSubmited: boolean, isButtonDisabled: boolean, isComponentDisabled: boolean, isSending: boolean) {
        this._isSubmited = isSubmited;
        this._isButtonDisabled = isButtonDisabled;
        this._isComponentDisabled = isComponentDisabled;
        this._isSending = isSending;
    }
    static getInstance():Validation{
        return new Validation(false,true,true,false);
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
