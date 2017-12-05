import { Component, OnInit } from '@angular/core';
import { DialogService } from '../../_services/dialog.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'lsl-close-contingency',
    templateUrl: './close-contingency.component.html',
    styleUrls: ['./close-contingency.component.scss']
})
export class CloseContingencyComponent implements OnInit {

    constructor(private dialogService: DialogService,
                public translate: TranslateService) {
        this.translate.setDefaultLang('en');
    }

    ngOnInit() {
    }

    dismissCloseContigency(): void {
        this.dialogService.closeAllDialogs();
    }

}
