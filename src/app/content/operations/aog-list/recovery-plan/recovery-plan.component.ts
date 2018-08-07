import {Component, Inject, OnInit} from '@angular/core';
import {Aog} from '../../../../shared/_models/aog/aog';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';

@Component({
  selector: 'lsl-recovery-plan',
  templateUrl: './recovery-plan.component.html',
  styleUrls: ['./recovery-plan.component.css']
})
export class RecoveryPlanComponent implements OnInit {

    private _aogData: Aog;

    constructor(@Inject(MAT_DIALOG_DATA) private matDialogData: Aog,
                private _dialogRef: MatDialogRef<RecoveryPlanComponent>) {
        this._aogData = matDialogData;
    }

    ngOnInit() {

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
