import {Component, ElementRef, Inject, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Aog} from '../../../../shared/_models/aog/aog';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {RecoveryPlanInterface, RecoveryPlanService} from './_services/recovery-plan.service';
import {Subscription} from 'rxjs/Subscription';
import {StageConfiguration} from '../../../../shared/_models/recoveryplan/stageConfiguration';
import {RecoveryPlan} from '../../../../shared/_models/recoveryplan/recoveryPlan';
import {Stage} from '../../../../shared/_models/recoveryplan/stage';
import {Audit} from '../../../../shared/_models/common/audit';
import {StorageService} from '../../../../shared/_services/storage.service';
import {TranslationService} from '../../../../shared/_services/translation.service';
import moment = require('moment');

@Component({
  selector: 'lsl-recovery-plan',
  templateUrl: './recovery-plan.component.html',
  styleUrls: ['./recovery-plan.component.css']
})
export class RecoveryPlanComponent implements OnInit, OnDestroy {

    private static RECOVERY_PLAN_VERSION = 'AOG.LIST.RECOVERY_PLAN.VERSION';
    private static MESSAGE_ADDED_SUCCESS = 'FORM.MESSAGES.ADDED_SUCCESS';

    @ViewChild('recoveryStageContainer') private _recoveryStageContainer: ElementRef;
    private _aogData: Aog;
    private _recoveryStagesConfigSub: Subscription;
    private _recoveryPlanInterfaceSub: Subscription;
    private _recoveryPlanInterface: RecoveryPlanInterface;
    private _groupLabel: string;
    private _utcNow: number;

    constructor(
        @Inject(MAT_DIALOG_DATA) private matDialogData: Aog,
        private _dialogRef: MatDialogRef<RecoveryPlanComponent>,
        private _recoveryPlanService: RecoveryPlanService,
        private _storageService: StorageService,
        private _translationService: TranslationService
    ) {
        this._aogData = matDialogData;
        this._groupLabel = '';
    }

    ngOnInit() {
        this.activeViewInHours = 24;
        this.activeViewInPixels = this._recoveryStageContainer.nativeElement.parentNode.offsetWidth;
        this.recoveryStagesSub = this.getRecoveryStagesConfSubscription();
        this.slotSizeInPixels = this._recoveryStageContainer.nativeElement.parentNode.offsetWidth / 24;
        this.recoveryPlanInterfaceSub = this.getRecoveryPlanInterfaceSubscription();
        this.utcNow = moment.utc().valueOf();

        this._translationService.translate(RecoveryPlanComponent.RECOVERY_PLAN_VERSION)
            .then(v => this.groupLabel = v);
    }

    ngOnDestroy() {
        this.recoveryStagesSub.unsubscribe();
        this.recoveryPlanInterfaceSub.unsubscribe();
    }

    /**
     * Subscription for get recovery plan service interface
     * @return {Subscription}
     */
    private getRecoveryPlanInterfaceSubscription(): Subscription {
        return this._recoveryPlanService.recoveryPlanBehavior$
            .subscribe(v => this.recoveryPlanInterface = v);
    }

    /**
     * Subscription for get the data list with recovery stage configuration
     * @return {Subscription}
     */
    private getRecoveryStagesConfSubscription(): Subscription {
        return this._recoveryPlanService.getRecoveryStageConfig().subscribe(
            response => this.recoveryStagesConfig = response,
            err => console.error('Error loading recovery stage configuration', err)
        );
    }

    public saveRecovery() {
        return this._recoveryPlanService.saveRecovery(this.recoveryPlan)
            .then(() => this._translationService.translateAndShow(RecoveryPlanComponent.MESSAGE_ADDED_SUCCESS, 2500, {value: this.groupLabel}))
            .catch(err => console.error('Error submitting recovery stages', err));
    }

    get recoveryPlan(): RecoveryPlan {
        const recoveryPlan = RecoveryPlan.getInstance();
        recoveryPlan.enable = true;
        recoveryPlan.stages = this.planStages;
        recoveryPlan.audit = Audit.getInstance();
        recoveryPlan.audit.username = this.username;
        recoveryPlan.aogSeq = this.aogData.id;
        return recoveryPlan;
    }


    /**
     * Closes modal when the user clicks on the "X" in the view
     */
    public closeModal(): void {
        this._dialogRef.close();
    }

    get aogData(): Aog {
        return this._aogData;
    }

    set aogData(value: Aog) {
        this._aogData = value;
    }

    get recoveryStagesSub(): Subscription {
        return this._recoveryStagesConfigSub;
    }

    set recoveryStagesSub(value: Subscription) {
        this._recoveryStagesConfigSub = value;
    }

    set activeViewInPixels(value: number) {
        this._recoveryPlanService.activeViewInPixels = value;
    }

    set relativeStartTime(value: number) {
        this._recoveryPlanService.relativeStartTime = value;
    }

    set activeViewInHours(value: number) {
        this._recoveryPlanService.activeViewInHours = value;
    }

    set recoveryStagesConfig(value: StageConfiguration[]) {
        this._recoveryPlanService.recoveryStagesConfig = value;
    }

    set slotSizeInPixels(value: number) {
        this._recoveryPlanService.slotSizeInPixels = value;
    }

    set utcNow(value: number) {
        this._recoveryPlanService.utcNow = value;
    }

    get recoveryPlanInterfaceSub(): Subscription {
        return this._recoveryPlanInterfaceSub;
    }

    set recoveryPlanInterfaceSub(value: Subscription) {
        this._recoveryPlanInterfaceSub = value;
    }

    get recoveryPlanInterface(): RecoveryPlanInterface {
        return this._recoveryPlanInterface;
    }

    set recoveryPlanInterface(value: RecoveryPlanInterface) {
        this._recoveryPlanInterface = value;
    }

    get planStages(): Stage[] {
        return this.recoveryPlanInterface.planStagesInterfaces
            .filter(v => v.stage.code !== RecoveryPlanService.DEFAULT_GROUP)
            .map(v => v.stage);
    }

    get username(): string {
        return this._storageService.getCurrentUser().username;
    }

    get groupLabel(): string {
        return this._groupLabel;
    }

    set groupLabel(value: string) {
        this._groupLabel = value;
    }
}
