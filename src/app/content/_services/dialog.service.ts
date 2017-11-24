import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material';

@Injectable()
export class DialogService {

    constructor(private dialog: MatDialog) { }

    public openDialog(dialogInstance): void {
        this.dialog.open(dialogInstance, {
            panelClass: 'full-dialog'
        });
    }

    public findDialogById(dialogId): void {
        this.dialog.getDialogById(dialogId);
    }

    public closeAllDialogs(): void {
        this.dialog.closeAll();
    }
}
