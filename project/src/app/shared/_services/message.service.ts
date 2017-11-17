import {Injectable} from '@angular/core';
import {MatSnackBar, MatSnackBarConfig} from "@angular/material";

@Injectable()
export class MessageService {

    constructor(private  matSnackBar: MatSnackBar) {
        this.matSnackBar = matSnackBar;

    }

    openSnackBar(message: string) {
        this.matSnackBar.open(message, "", <MatSnackBarConfig>{
            duration: 1000,
            verticalPosition: "top",
            horizontalPosition: "center"
        });

    }
}
