import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material';
import {MatDialogRef} from '@angular/material/dialog/typings/dialog-ref';

@Injectable()
export class DialogService {

    private _refList: MatDialogRef<any>[];

    constructor(
        private dialog: MatDialog
    ) {
        this._refList = [];
    }

    public openDialog(dialogInstance, config, alias: string = 'active'): MatDialogRef<any> {
        this.refList[alias] = this.dialog.open(dialogInstance, config);
        return this.refList[alias];
    }

    public closeDialog(alias: string): void {
        if (this.refList[alias]) {
            this.refList[alias].close();
            this.removeByKey(this.refList, alias);
        }
    }

    /**
     * Method to remove element from the array based by his label
     * @param array that contains the element to be removed
     * @param params the key to search in the array
     */
    private removeByKey(array, params): MatDialogRef<any>[] {
        array.some(function(item, index) {
            if (array[index][params.key] === params.value) {
                // found it!
                array.splice(index, 1);
                return true; // stops the loop
            }
            return false;
        });
        return array;
    }

    public closeAllDialogs(): void {
        this.dialog.closeAll();
    }

    get refList(): MatDialogRef<any>[] {
        return this._refList;
    }

    set refList(value: MatDialogRef<any>[]) {
        this._refList = value;
    }
}
