import { Component, OnInit } from '@angular/core';
import { DialogService } from '../../_services/dialog.service';

@Component({
    selector: 'lsl-close-contingency',
    templateUrl: './close-contingency.component.html',
    styleUrls: ['./close-contingency.component.scss']
})
export class CloseContingencyComponent implements OnInit {

    constructor(private dialogService: DialogService) {
    }

    ngOnInit() {
    }

    dismissCloseContigency(): void {
        this.dialogService.closeAllDialogs();
    }

}
