import {Component, ElementRef, Inject, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Aog} from '../../../../shared/_models/aog/aog';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {RecoveryPlanService} from './_services/recovery-plan.service';
import {Subscription} from 'rxjs/Subscription';
import {StageConfiguration} from '../../../../shared/_models/recoveryplan/StageConfiguration';

@Component({
  selector: 'lsl-recovery-plan',
  templateUrl: './recovery-plan.component.html',
  styleUrls: ['./recovery-plan.component.css']
})
export class RecoveryPlanComponent implements OnInit, OnDestroy {

    @ViewChild('recoveryStageContainer') private _recoveryStageContainer: ElementRef;
    private _aogData: Aog;
    private _recoveryStagesConfigSub: Subscription;

    constructor(
        @Inject(MAT_DIALOG_DATA) private matDialogData: Aog,
        private _dialogRef: MatDialogRef<RecoveryPlanComponent>,
        private _recoveryPlanService: RecoveryPlanService
    ) {
        this._aogData = matDialogData;
    }

    ngOnInit() {
        this.activeViewInHours = 24;
        this.relativeStartTime = this.aogData.audit.time.epochTime;
        this.activeViewInPixels = this._recoveryStageContainer.nativeElement.parentNode.offsetWidth;
        this.recoveryStagesSub = this.getRecoveryStagesConfSubscription();
    }

    ngOnDestroy() {
        this.recoveryStagesSub.unsubscribe();
    }

    /**
     * Subscription for get the data list with recovery stage configuration
     * @return {Subscription}
     */
    private getRecoveryStagesConfSubscription(): Subscription {
        return this._recoveryPlanService.getRecoveryStageConfig().subscribe(
            (response) => {
                console.log('conf ->', response);
                this.recoveryStagesConfig = response;
            },
            () => {
                console.error('Error loading recovery stage configuration');
            });
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

}
