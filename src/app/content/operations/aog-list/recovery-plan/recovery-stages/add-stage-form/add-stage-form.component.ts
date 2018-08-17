import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {TranslationService, TranslationParamInterface} from '../../../../../../shared/_services/translation.service';
import {CancelComponent} from '../../../../cancel/cancel.component';
import {MessageService} from '../../../../../../shared/_services/message.service';
import {DialogService} from '../../../../../_services/dialog.service';
import {MAT_DIALOG_DATA} from '@angular/material';
import {Stage} from '../../../../../../shared/_models/aog/Stage';
import {DurationInterface, TimeService} from '../../../../../../shared/_services/timeService';
import {DateRange} from '../../../../../../shared/_models/common/dateRange';
import {TimeInstant} from '../../../../../../shared/_models/timeInstant';

export interface InjectAddStageInterface {
    stagesList: Stage[];
    triggerStage: Stage;
}

@Component({
    selector: 'lsl-add-stage-form',
    templateUrl: './add-stage-form.component.html',
    styleUrls: ['../../../../../../../assets/style/modal.scss', './add-stage-form.component.scss']
})
export class AddStageFormComponent implements OnInit {

    public static ADD_STAGE_DIALOG_TAG = 'addStage';
    private static CANCEL_COMPONENT_MESSAGE = 'OPERATIONS.CANCEL_COMPONENT.MESSAGE';
    private static VALIDATION_ERROR_MESSAGE = 'OPERATIONS.VALIDATION_ERROR_MESSAGE';
    private static INTERVAL_DURATION = 30;
    private static INTERVAL_LIMIT = 360;
    private static INTERVAL_DEFAULT = 180;

    private _addStageForm: FormGroup;
    private _groupLabel: TranslationParamInterface;
    private _stage: Stage;
    private _durationIntervals: DurationInterface[];

    constructor(
        private _fb: FormBuilder,
        private _translationService: TranslationService,
        private _messageService: MessageService,
        private _dialogService: DialogService,
        private _timeService: TimeService,
        @Inject(MAT_DIALOG_DATA) private _data: InjectAddStageInterface
    ) {
        this._durationIntervals = [];
        this._addStageForm = _fb.group({
            'group': [this.firstGroup, [Validators.required, this.groupValidator.bind(this)]],
            'duration': [AddStageFormComponent.INTERVAL_DEFAULT, [Validators.required, this.durationValidator.bind(this)]]
        });
        this._stage = null;
    }

    ngOnInit() {
        this._translationService.translate('AOG.LIST.RECOVERY_PLAN.GROUP').then(v => this.groupLabel = {value: v});
        this.durationIntervals = this._timeService.getDurationIntervals(AddStageFormComponent.INTERVAL_DURATION, AddStageFormComponent.INTERVAL_LIMIT);
    }

    getStageFromForm(): Stage {
        const dateRange = new DateRange(
            new TimeInstant(this.triggerStage.fromEpochtime, ''),
            new TimeInstant(this.triggerStage.fromEpochtime + (this.addStageForm.controls['duration'].value * 60 * 1000), '')
        );
        return new Stage(this.addStageForm.controls['group'].value, 1, dateRange);
    }

    submitForm() {
        if (this.addStageForm.valid) {
            this.stage = this.getStageFromForm();
            this._dialogService.closeDialog(AddStageFormComponent.ADD_STAGE_DIALOG_TAG);
        } else {
            this._translationService.translateAndShow(AddStageFormComponent.VALIDATION_ERROR_MESSAGE);
        }
    }

    /**
     * Validator to group data
     * @param {FormControl} control
     * @returns {object}
     */
    public groupValidator(control: FormControl): object {
        return !this.groups.find(v => v === control.value) ? {noGroup: true} : null;
    }

    /**
     * Validator to duration data
     * @param {FormControl} control
     * @returns {object}
     */
    public durationValidator(control: FormControl): object {
        return !this.durationIntervals.find(v => v.duration === control.value) ? {noDuration: true} : null;
    }

    /**
     * Open a cancel message if there is a filled item
     */
    public openCancelDialog(): void {
        if (this.addStageForm.pristine) {
            this._dialogService.closeDialog(AddStageFormComponent.ADD_STAGE_DIALOG_TAG);
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

    private get firstGroup(): string {
        return this._data.stagesList[0] ? this._data.stagesList[0].code : '';
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

    get groups(): string[] {
        return this._data.stagesList.map(v => v.code);
    }

    get stage(): Stage {
        return this._stage;
    }

    set stage(value: Stage) {
        this._stage = value;
    }

    get durationIntervals(): DurationInterface[] {
        return this._durationIntervals;
    }

    set durationIntervals(value: DurationInterface[]) {
        this._durationIntervals = value;
    }

    get triggerStage(): Stage {
        return this._data.triggerStage;
    }

}
