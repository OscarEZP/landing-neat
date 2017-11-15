import { Component, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
    selector: 'app-contingence-form',
    templateUrl: './contingence-form.component.html',
    styleUrls: ['./contingence-form.component.scss']
})

export class ContingenceFormComponent implements OnInit {
    
    constructor(
        public dialogRef: MatDialogRef<ContingenceFormComponent>
    ) { }

    ngOnInit(): void {

    }

    onCancelClick(): void {
        this.dialogRef.close();
    }
}