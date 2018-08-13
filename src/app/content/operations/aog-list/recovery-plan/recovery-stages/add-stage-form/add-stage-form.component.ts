import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {TranslationService, TranslationParamInterface} from '../../../../../../shared/_services/translation.service';
import {CancelComponent} from '../../../../cancel/cancel.component';
import {MessageService} from '../../../../../../shared/_services/message.service';
import {DialogService} from '../../../../../_services/dialog.service';
import {RecoveryPlanService} from '../../_services/recovery-plan.service';
import {Observable} from 'rxjs/Observable';
import {TimeConverter} from '../../util/timeConverter';
import {Stage} from '../../../../../../shared/_models/aog/Stage';

@Component({
    selector: 'lsl-add-stage-form',
    templateUrl: './add-stage-form.component.html',
    styleUrls: ['./add-stage-form.component.scss', '../../../../../../../assets/style/modal.scss']
})
export class AddStageFormComponent implements OnInit {

    public static ADD_STAGE_DIALOG_TAG = 'addStage';
    private static CANCEL_COMPONENT_MESSAGE = 'OPERATIONS.CANCEL_COMPONENT.MESSAGE';

    private _addStageForm: FormGroup;
    private _groupLabel: TranslationParamInterface;

    constructor(
        private _fb: FormBuilder,
        private _translationService: TranslationService,
        private _messageService: MessageService,
        private _dialogService: DialogService,
        private _recoveryPlanService: RecoveryPlanService
    ) {
        this._addStageForm = _fb.group({
            'type': ['', [Validators.required]],
            'duration': ['', [Validators.required]]
        });
    }

    ngOnInit() {
        this._translationService.translate('AOG.LIST.RECOVERY_PLAN.GROUP').then(v => this.groupLabel = {value: v});
    }

    /**
     * Open a cancel message if there is a filled item
     */
    public openCancelDialog(): void {
        if (this.addStageForm.pristine) {
            this._dialogService.refList[AddStageFormComponent.ADD_STAGE_DIALOG_TAG].close();
        } else {
            this._translationService.translate(AddStageFormComponent.CANCEL_COMPONENT_MESSAGE)
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

    get addStageForm(): FormGroup {
        return this._addStageForm;
    }

    set addStageForm(value: FormGroup) {
        this._addStageForm = value;
    }

    get groupLabel(): TranslationParamInterface {
        return this._groupLabel;
    }

    set groupLabel(value: TranslationParamInterface) {
        this._groupLabel = value;
    }
}
