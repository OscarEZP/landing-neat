import {Injectable} from '@angular/core';
import {MatSnackBar, MatSnackBarConfig} from '@angular/material';
import {MatSnackBarRef} from '@angular/material/snack-bar/typings/snack-bar-ref';

@Injectable()
export class MessageService {

    private _active: boolean;

    constructor(private  _matSnackBar: MatSnackBar) {
        this._matSnackBar = _matSnackBar;
        this.active = false;
    }

    /**
     * Method for show 'toast' message, get message and duration as arguments
     * @param message
     * @param time
     */
    openSnackBar(message: string, time: number = 5000) {
        if (!this.active) {
            this.active = true;
            this._matSnackBar.open(message, '', <MatSnackBarConfig>{
                duration: time,
                verticalPosition: 'top',
                horizontalPosition: 'center',
                panelClass: ['center']
            }).afterDismissed().subscribe(() => {
                this.active = false;
            });
        }
    }

    openFromComponent(component, config): MatSnackBarRef<any> {
        return this._matSnackBar.openFromComponent(component, config);
    }

    dismissSnackBar() {
        this._matSnackBar.dismiss();
    }


    get matSnackBar(): MatSnackBar {
        return this._matSnackBar;
    }

    set matSnackBar(value: MatSnackBar) {
        this._matSnackBar = value;
    }

    get active(): boolean {
        return this._active;
    }

    set active(value: boolean) {
        this._active = value;
    }
}
