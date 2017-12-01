import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material';

@Injectable()
export class DialogService {

    constructor(private dialog: MatDialog) { }

    public openDialog(dialogInstance): void {
        this.dialog.open(dialogInstance, {

            maxWidth: '100vw',
            width:'100%',
            height: '100%',
            hasBackdrop: false
            
        });
    }

    public findDialogById(dialogId): void {
        this.dialog.getDialogById(dialogId);
    }

    public closeAllDialogs(): void {
        this.dialog.closeAll();
    }
}
