import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {CancelComponent} from '../../../content/operations/cancel/cancel.component';
import {TranslationService} from '../../_services/translation.service';
import {DialogService} from '../../../content/_services/dialog.service';
import {MessageService} from '../../_services/message.service';

@Component({
    selector: 'lsl-edit-field',
    templateUrl: './edit-field.component.html',
    styleUrls: ['./edit-field.component.css']
})
export class EditFieldComponent implements OnInit {

    private static CANCEL_COMPONENT_MESSAGE = 'OPERATIONS.CANCEL_COMPONENT.MESSAGE';

    private _editFieldForm: FormGroup;

    constructor(
        private _fb: FormBuilder,
        private _translationService: TranslationService,
        private _dialogService: DialogService,
        private _messageService: MessageService
    ) {
        this._editFieldForm = _fb.group({});
    }

    ngOnInit() {

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

    get editFieldForm(): FormGroup {
        return this._editFieldForm;
    }

    set editFieldForm(value: FormGroup) {
        this._editFieldForm = value;
    }
}
