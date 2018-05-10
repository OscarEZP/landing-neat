import {Component, OnDestroy, OnInit} from '@angular/core';
import {ApiRestService} from '../../../../shared/_services/apiRest.service';
import {Authority} from '../../../../shared/_models/management/authority';
import {Subscription} from 'rxjs/Subscription';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Station} from '../../../../shared/_models/management/station';
import {StorageService} from '../../../../shared/_services/storage.service';
import {Observable} from 'rxjs/Observable';

@Component({
    selector: 'lsl-atec-filter',
    templateUrl: './atec-filter.component.html',
    styleUrls: ['./atec-filter.component.scss']
})
export class AtecFilterComponent implements OnInit, OnDestroy {

    public static AUTHORITIES_ENDPOINT = 'authorities';

    private _arrMenu: { label: string }[];
    private _stations: Station[];
    private _selectedStation: string;
    private _authorities: object;
    private _selectedAuthorities: Authority[];
    private _atecForm: FormGroup;

    private _authoritiesSub: Subscription;

    constructor(
        private _apiRestService: ApiRestService,
        private _fb: FormBuilder,
        private _storageService: StorageService
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
        this.stations = [];
        this.selectedStation = '';
        this.authorities = {};
        this.selectedAuthorities = [];
        this.atecForm = _fb.group({
            'authorities': [[], Validators.required],
            'station': [[], Validators.required],
        });
    }

    ngOnInit() {
        this.stations = this.getInitStations();
        this._authoritiesSub = this.getAuthorities();
    }

    ngOnDestroy() {
        this._authoritiesSub.unsubscribe();
    }

    private getInitStations(): Station[] {
        let result = [];
        result.push(this._storageService.userManagement.detailStation.defaults);
        result = result.concat(this._storageService.userManagement.detailStation.others);
        return result;
    }

    private getAuthorities(): Subscription {
        const authorities = {
            SCL: ['j1'],
            MIA: ['j2', 'jb'],
            BRA: ['j3', 'ja', 'jb'],
        };
        return new Observable(x => x.next(authorities)).subscribe(res => {
            this.authorities = res;
            console.log('auth', this.authorities);
        });
        /*
        return this._apiRestService
            .getAll<Authority[]>(AtecFilterComponent.AUTHORITIES_ENDPOINT)
            .subscribe(rs => this.authorities = rs);
        */
    }

    private getAuthoritiesNotRelated() {
        const authorities = {
            SCL: ['j1'],
            MIA: ['j2', 'jb'],
            BRA: ['j3', 'ja', 'jb'],
        };
        return new Observable(x => x.next(authorities)).subscribe(res => {
            this.authorities = res;
            console.log('auth', this.authorities);
        });
    }

    public setSelectedStation(value: string) {
        this.selectedStation = value;
        console.log(value);
    }

    public cancel() {
        this.selectedStation = '';
    }

    public submitForm(): void {
        console.log('sent!', this.selectedAuthorities, this.selectedStation);
    }

    get authorities(): object {
        return this._authorities;
    }

    set authorities(value: object) {
        this._authorities = value;
    }

    get arrMenu(): { label: string }[] {
        return this._arrMenu;
    }

    set arrMenu(value: { label: string }[]) {
        this._arrMenu = value;
    }

    get selectedAuthorities(): Authority[] {
        return this._selectedAuthorities;
    }

    set selectedAuthorities(value: Authority[]) {
        this._selectedAuthorities = value;
    }

    get atecForm(): FormGroup {
        return this._atecForm;
    }

    set atecForm(value: FormGroup) {
        this._atecForm = value;
    }

    get stations(): Station[] {
        return this._stations;
    }

    set stations(value: Station[]) {
        this._stations = value;
    }

    get selectedStation(): string {
        return this._selectedStation;
    }

    set selectedStation(value: string) {
        this._selectedStation = value;
    }
}

