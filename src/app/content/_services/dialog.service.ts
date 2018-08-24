import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material';
import {MatDialogRef} from '@angular/material/dialog/typings/dialog-ref';

export interface DialogInterface {
    alias: string;
    matDialogRef: MatDialogRef<any>;
}


@Injectable()
export class DialogService {

    private _refList: DialogInterface[];

    constructor(
        private dialog: MatDialog
    ) {
        this._refList = [];
    }

    public openDialog(dialogInstance, config, alias: string = 'active'): MatDialogRef<any> {
        this.refList.push({ alias: alias, matDialogRef: this.dialog.open(dialogInstance, config) });
        return this.refList.find(v => v.alias === alias).matDialogRef;
    }

    public closeDialog(alias: string): void {
        const matDialogInterface = this.refList.find(v => v.alias === alias);
        if (matDialogInterface) {
            matDialogInterface.matDialogRef.close();
            this.refList = this.refList.filter(ref => ref.alias !== alias);
        }
        console.log(this.refList);
    }

    public closeAllDialogs(): void {
        this.dialog.closeAll();
    }

    get refList(): DialogInterface[] {
        return this._refList;
    }

    set refList(value: DialogInterface[]) {
        this._refList = value;
    }
}
