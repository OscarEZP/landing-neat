import {Component, OnInit} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {DetailsService} from '../_services/details.service';

@Component({
    selector: 'lsl-information',
    templateUrl: './information.component.html',
    styleUrls: ['./information.component.scss'],
    providers: [TranslateService]
})

export class InformationComponent implements OnInit {

    private _primary: string;

    constructor(
        public translate: TranslateService,
        public detailsService: DetailsService
    ) {
        this.translate.setDefaultLang('en');
    }

    ngOnInit() {
    }


    get primary(): string {
        return this._primary;
    }

    set primary(value: string) {
        this._primary = value;
    }
}
