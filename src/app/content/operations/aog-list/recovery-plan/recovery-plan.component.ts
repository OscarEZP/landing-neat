import {Component, ElementRef, Inject, OnInit, ViewChild} from '@angular/core';
import {Aog} from '../../../../shared/_models/aog/aog';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {RecoveryPlanService} from './_services/recovery-plan.service';

@Component({
  selector: 'lsl-recovery-plan',
  templateUrl: './recovery-plan.component.html',
  styleUrls: ['./recovery-plan.component.css']
})
export class RecoveryPlanComponent implements OnInit {

    private _aogData: Aog;
    @ViewChild('recoveryStageContainer') private _recoveryStageContainer: ElementRef;

    constructor(
        @Inject(MAT_DIALOG_DATA) private matDialogData: Aog,
        private _dialogRef: MatDialogRef<RecoveryPlanComponent>,
        private _recoveryPlanService: RecoveryPlanService
    ) {
        this._aogData = matDialogData;
    }

    ngOnInit() {
        this._recoveryPlanService.activeViewInHours = 24;
        this._recoveryPlanService.relativeStartTime = this.aogData.audit.time.epochTime;
        this._recoveryPlanService.activeViewInPixels = this._recoveryStageContainer.nativeElement.parentNode.offsetWidth;
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

}
