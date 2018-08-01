import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {DialogService} from '../../_services/dialog.service';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {StorageService} from '../../../shared/_services/storage.service';
import {ApiRestService} from '../../../shared/_services/apiRest.service';
import {Aog} from '../../../shared/_models/aog/aog';
import {CancelComponent} from '../cancel/cancel.component';
import {TranslationService} from '../../../shared/_services/translation.service';
import {MessageService} from '../../../shared/_services/message.service';
import {DataService} from '../../../shared/_services/data.service';
import {Validation} from '../../../shared/_models/validation';
import {TranslateService} from '@ngx-translate/core';
import {CloseAog} from '../../../shared/_models/aog/closeAog';

@Component({
    selector: 'lsl-close-aog',
    templateUrl: './close-aog.component.html',
    styleUrls: ['./close-aog.component.scss']
})
export class CloseAogComponent implements OnInit {

    private static CANCEL_COMPONENT_MESSAGE = 'OPERATIONS.CANCEL_COMPONENT.MESSAGE';
    private static VALIDATION_ERROR_MESSAGE = 'OPERATIONS.VALIDATION_ERROR_MESSAGE';
    private static FORM_FAILURE_MESSAGE = 'AOG.AOG_FORM.CLOSE_FAILURE_MESSAGE';
    private static FORM_SUCCESSFULLY_MESSAGE = 'AOG.AOG_FORM.CLOSE_SUCCESSFULLY_MESSAGE';

    private _aog: Aog;
    private _closeAogForm: FormGroup;
    private _validations: Validation;
    private _snackbarMessage: string;
    private _closeAog: CloseAog;

    constructor(
        private _dialogService: DialogService,
        private _storageService: StorageService,
        private _apiRestService: ApiRestService,
        private _fb: FormBuilder,
        private _translationService: TranslationService,
        private _messageService: MessageService,
        private _dataService: DataService,
        private _translate: TranslateService,
        @Inject(MAT_DIALOG_DATA) private _data: Aog,
        private _dialogRef: MatDialogRef<CloseAogComponent>
    ) {
        this._closeAogForm = _fb.group({
            'observation': [null, Validators.required],
            'barcode'   : [_data.barcode, [Validators.pattern('^([a-zA-Z0-9])+'), Validators.maxLength(80)]],
            'reason'    : [_data.reason, Validators.required]
        });

        this._aog = this._data;
        this._validations = Validation.getInstance();
        this._closeAog = CloseAog.getInstance();
    }

    public ngOnInit() {
        this.closeAog.aogId = this.aog.id;
        this.closeAog.audit.username = this._storageService.getCurrentUser().username;
    }

    public closeModal(): void {
        this._dialogRef.close();
    }

    public openCancelDialog(): void {
        if (!this.closeAogForm.pristine) {
            this._translationService.translate(CloseAogComponent.CANCEL_COMPONENT_MESSAGE)
                .then(res => this._messageService.openFromComponent(CancelComponent, {
                    data: {message: res},
                    horizontalPosition: 'center',
                    verticalPosition: 'top'
                }));
        } else {
            this.dismissCloseAog();
        }
    }

    public submitForm(value: any) {
        if (this.closeAogForm.valid) {
            this.closeAog.observation = this.closeAogForm.controls['observation'].value;
            this.validations.isSending = true;
            let res: Response;
            this._apiRestService
                .add<Response>('closeAog', this.closeAog)
                .subscribe(response => res = response,
                    err => {
                        this.getTranslateString(CloseAogComponent.FORM_FAILURE_MESSAGE);
                        const message: string = (err.error != null && err.error.message != null) ? err.error.message : this.snackbarMessage;
                        this._messageService.openSnackBar(message);
                        this.validations.isSending = false;
                    }, () => {
                        this.getTranslateString(CloseAogComponent.FORM_SUCCESSFULLY_MESSAGE);
                        this._messageService.openSnackBar(this.snackbarMessage);
                        this._dialogService.closeAllDialogs();
                        this._dataService.stringMessage('reload');
                        this.validations.isSending = false;
                    });
        } else {
            this.getTranslateString(CloseAogComponent.VALIDATION_ERROR_MESSAGE);
            this._messageService.openSnackBar(this.snackbarMessage);
            this.validations.isSending = false;
        }
    }

    private getTranslateString(toTranslate: string) {
        this._translate.get(toTranslate).subscribe((res: string) => {
            this.snackbarMessage = res;
        });
    }

    public dismissCloseAog(): void {
        this._dialogService.closeAllDialogs();
    }

    get aog(): Aog {
        return this._aog;
    }

    set aog(value: Aog) {
        this._aog = value;
    }

    get closeAogForm(): FormGroup {
        return this._closeAogForm;
    }

    set closeAogForm(value: FormGroup) {
        this._closeAogForm = value;
    }

    get validations(): Validation {
        return this._validations;
    }

    set validations(value: Validation) {
        this._validations = value;
    }

    get snackbarMessage(): string {
        return this._snackbarMessage;
    }

    set snackbarMessage(value: string) {
        this._snackbarMessage = value;
    }

    get closeAog(): CloseAog {
        return this._closeAog;
    }

    set closeAog(value: CloseAog) {
        this._closeAog = value;
    }

}
