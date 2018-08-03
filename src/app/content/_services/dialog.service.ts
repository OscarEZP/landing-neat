import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material';
import {MatDialogRef} from '@angular/material/dialog/typings/dialog-ref';

@Injectable()
export class DialogService {

    constructor(private dialog: MatDialog) {
    }

    public openDialog(dialogInstance, config): MatDialogRef<any> {
        return this.dialog.open(dialogInstance, config);
    }

    public findDialogById(dialogId): void {
        this.dialog.getDialogById(dialogId);
    }

    public closeAllDialogs(): void {
        this.dialog.closeAll();
    }
}
