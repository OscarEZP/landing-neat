import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {CancelComponent} from '../../../content/operations/cancel/cancel.component';
import {DialogService} from '../../../content/_services/dialog.service';
import {TranslationParamInterface, TranslationService} from '../../../shared/_services/translation.service';
import {MessageService} from '../../../shared/_services/message.service';
import {MAT_DIALOG_DATA} from '@angular/material';

export interface EditFieldDataInterface {
    domain: any;
    attribute: string;
    promise: Promise<any>;
    translation: EditFieldTranslationInterface;
}

export interface EditFieldTranslationInterface {
    title: string;
    field: TranslationParamInterface;
    placeholder: string;
}

export interface EditFieldTypesInterface {
    textarea?: string;
}

@Component({
    selector: 'lsl-edit-field',
    templateUrl: './edit-field.component.html',
    styleUrls: ['./edit-field.component.scss']
})
export class EditFieldComponent implements OnInit {

    private static CANCEL_COMPONENT_MESSAGE = 'OPERATIONS.CANCEL_COMPONENT.MESSAGE';

    private _editFieldForm: FormGroup;
    private _type: string;
    private _types: EditFieldTypesInterface;
    private _maxTextAreaLength: number;

    constructor(
        @Inject(MAT_DIALOG_DATA) public data: EditFieldDataInterface,
        private _fb: FormBuilder,
        private _translationService: TranslationService,
        private _dialogService: DialogService,
        private _messageService: MessageService
    ) {
        this._editFieldForm = _fb.group({});
        this._types = { textarea: 'textarea' };
        this._type = this.types.textarea;
        this._maxTextAreaLength = 400;
    }

    ngOnInit() {
        this.addValidator(this.type);
    }

    private addValidator(type: string) {
        this.editFieldForm.addControl(type, new FormControl('', [Validators.required, Validators.maxLength(this.maxTextAreaLength)]));
    }

    /**
     * Open a cancel message if there is a filled item
     */
    public openCancelDialog(): void {
        if (this.editFieldForm.pristine) {
            this._dialogService.closeAllDialogs();
        } else {
            this._translationService.translate(EditFieldComponent.CANCEL_COMPONENT_MESSAGE)
                .then((res: string) => {
                    this._messageService.openFromComponent(CancelComponent, {
                        data: {message: res},
                        horizontalPosition: 'center',
                        verticalPosition: 'top'
                    });
                })
                .catch(err => console.error(err));
        }
    }

    public submitForm(): void {
        this.data.promise
            .then(x => {
                this._dialogService.closeAllDialogs();
                this._translationService.translateAndShow('FORM.MESSAGE.EDIT_SUCCESS', 2500, this.translation.field);
            })
            .catch(err => {
                console.error(err);
                this._translationService.translateAndShow('ERRORS.DEFAULT');
            });
    }

    get editFieldForm(): FormGroup {
        return this._editFieldForm;
    }

    set editFieldForm(value: FormGroup) {
        this._editFieldForm = value;
    }

    get type(): string {
        return this._type;
    }

    set type(value: string) {
        this._type = value;
    }

    get types(): EditFieldTypesInterface {
        return this._types;
    }

    set types(value: EditFieldTypesInterface) {
        this._types = value;
    }

    get translation(): EditFieldTranslationInterface {
        return this.data.translation;
    }

    get maxTextAreaLength(): number {
        return this._maxTextAreaLength;
    }

    set maxTextAreaLength(value: number) {
        this._maxTextAreaLength = value;
    }
}
