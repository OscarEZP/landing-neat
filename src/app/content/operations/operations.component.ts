import {Component, OnInit, ViewChild} from '@angular/core';
import {ContingencyListComponent} from './contingency-list.component/contingency-list.component';
import {TranslateService} from '@ngx-translate/core';

@Component({
    selector: 'lsl-operations',
    templateUrl: './operations.component.html',
    styleUrls: ['./operations.component.scss']
})

export class OperationsComponent implements OnInit {

    constructor(private translate: TranslateService) {
        this.translate.setDefaultLang('en');
    }

    ngOnInit() {
    }

}
