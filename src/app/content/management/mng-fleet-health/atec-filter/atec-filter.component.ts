import {Component, OnInit} from '@angular/core';
import {ApiRestService} from '../../../../shared/_services/apiRest.service';
import {Authority} from '../../../../shared/_models/management/authority';
import {Subscription} from 'rxjs/Subscription';

@Component({
    selector: 'lsl-atec-filter',
    templateUrl: './atec-filter.component.html',
    styleUrls: ['./atec-filter.component.scss']
})
export class AtecFilterComponent implements OnInit {

    public static AUTHORITIES_ENDPOINT = 'authorities';

    private _arrMenu: { label: string }[];
    private _operators: Authority[];
    // private _

    constructor(
        private _apiRestService: ApiRestService
    ) {

        this.arrMenu = [
            // {
            //     'label': 'LA',
            //
            // },
            // {
            //     'label': '4M',
            //
            // }
        ];

        this.operators = [];
        this.getAuthorities();
    }

    ngOnInit() {
    }

    public selectOperator() {

    }

    private getAuthorities(): Subscription {
        return this._apiRestService
            .getAll<Authority[]>('authorities')
            .subscribe(rs => this.operators = rs);
    }

    get operators(): Authority[] {
        return this._operators;
    }

    set operators(value: Authority[]) {
        this._operators = value;
    }

    get arrMenu(): { label: string }[] {
        return this._arrMenu;
    }

    set arrMenu(value: { label: string }[]) {
        this._arrMenu = value;
    }
}

