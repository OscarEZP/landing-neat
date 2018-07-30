import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {Aog} from '../../../shared/_models/aog/aog';

@Component({
    selector: 'lsl-aog-recovery-plan',
    templateUrl: './aog-recovery-plan.component.html',
    styleUrls: ['./aog-recovery-plan.component.css']
})
export class AogRecoveryPlanComponent implements OnInit, OnDestroy {

    private _aogData: Aog;

    constructor(@Inject(MAT_DIALOG_DATA) private matDialogData: Aog,
                private _dialogRef: MatDialogRef<AogRecoveryPlanComponent>) {
        this._aogData = matDialogData;
    }

    ngOnInit() {

    }

    ngOnDestroy() {

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
