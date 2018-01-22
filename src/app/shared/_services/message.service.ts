import {Injectable} from '@angular/core';
import {MatSnackBar, MatSnackBarConfig} from '@angular/material';

@Injectable()
export class MessageService {

    constructor(private  matSnackBar: MatSnackBar) {
        this.matSnackBar = matSnackBar;

    }

    /**
     * Method for show 'toast' message, get message and duration as arguments
     * @param message
     * @param time
     */
    openSnackBar(message: string, time: number = 5000) {
        this.matSnackBar.open(message, '', <MatSnackBarConfig>{
            duration: time,
            verticalPosition: 'top',
            horizontalPosition: 'center'
        });

    }

    openFromComponent(component, config) {
        this.matSnackBar.openFromComponent(component, config);
    }

    dismissSnackBar() {
        this.matSnackBar.dismiss();
    }
}
