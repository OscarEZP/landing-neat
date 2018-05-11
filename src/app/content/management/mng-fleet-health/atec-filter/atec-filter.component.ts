import {Component, OnDestroy, OnInit} from '@angular/core';
import {ApiRestService} from '../../../../shared/_services/apiRest.service';
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

    private _arrTabs: { label: string }[];
    private _stations: Station[];
    private _selectedStation: string;
    private _authorities: object;
    private _authoritiesNoRelated: string[];
    private _authoritiesMerged: string[];
    private _selectedAuthorities: string[];
    private _atecForm: FormGroup;
    private _deferralClasses$: Observable;

    private _authoritiesSub: Subscription;
    private _authoritiesNoRelatedSub: Subscription;

    constructor(
        private _apiRestService: ApiRestService,
        private _fb: FormBuilder,
        private _storageService: StorageService
    ) {
        this.resetValues();
        this.authorities = {};
        this.authoritiesNoRelated = [];
        this.authoritiesMerged = [];
        this.selectedAuthorities = [];
        this.atecForm = _fb.group({
            'authorities': [[], Validators.required],
            'station': [[], Validators.required],
        });
    }

    ngOnInit() {
        this.stations = this.getInitStations();
        this._authoritiesSub = this.getAuthorities();
        this._authoritiesNoRelatedSub = this.getAuthoritiesNotRelated();
        this.deferralClasses$ = this.getDeferralClasses();
    }

    ngOnDestroy() {
        this._authoritiesSub.unsubscribe();
        this._authoritiesNoRelatedSub.unsubscribe();
    }

    private getInitStations(): Station[] {
        let result = [];
        result.push(this._storageService.userManagement.detailStation.defaults);
        result = result.concat(this._storageService.userManagement.detailStation.others);
        return result;
    }

    /**
     * Mock
     * @returns {Subscription}
     */
    private getAuthorities(): Subscription {
        const authorities = {
            SCL: ['j1'],
            MIA: ['j2', 'jb'],
            BRA: ['j3', 'ja', 'jb'],
        };
        return new Observable(x => x.next(authorities)).subscribe(res => {
            this.authorities = res;
        });
        /*
        return this._apiRestService
            .getAll<Authority[]>(AtecFilterComponent.AUTHORITIES_ENDPOINT)
            .subscribe(rs => this.authorities = rs);
        */
    }

    /**
     * Mock
     * @returns {Subscription}
     */
    private getAuthoritiesNotRelated(): Subscription {
        const authorities = ['a3', 'aa', 'ad'];
        return new Observable(x => x.next(authorities))
            .subscribe(res => {
                this.authoritiesNoRelated = res;
            });
    }

    /**
     * Mock
     * @returns {Subscription}
     */
    private getDeferralClasses(): Observable {
        const deferralClasses = ['a', 'b', 'c', 'd', 'tli'];
        return new Observable(x => x.next(deferralClasses));
    }

    public setSelectedStation(value: string) {
        this.selectedStation = value;
        this.authoritiesMerged = this.authorities[value].concat(this.authoritiesNoRelated);
        this.selectedAuthorities = this.selectedAuthorities.length === 0 ? this.authorities[value] : this.selectedAuthorities;
        this.addMenu(this.selectedAuthorities);
    }

    public addMenu(authorities: string[]): {label: string}[] {
        return this.arrTabs = authorities.map(a => ({label: a}));
    }

    public cancel(): void {
        this.resetValues();
    }

    private resetValues(): void {
        this.selectedStation = '';
        this.selectedAuthorities = [];
        this.arrTabs = [];
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

    get arrTabs(): { label: string }[] {
        return this._arrTabs;
    }

    set arrTabs(value: { label: string }[]) {
        this._arrTabs = value;
    }

    get selectedAuthorities(): string[] {
        return this._selectedAuthorities;
    }

    set selectedAuthorities(value: string[]) {
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

    get authoritiesNoRelated(): string[] {
        return this._authoritiesNoRelated;
    }

    set authoritiesNoRelated(value: string[]) {
        this._authoritiesNoRelated = value;
    }

    get authoritiesMerged(): string[] {
        return this._authoritiesMerged;
    }

    set authoritiesMerged(value: string[]) {
        this._authoritiesMerged = value;
    }

    get deferralClasses$(): Observable {
        return this._deferralClasses$;
    }

    set deferralClasses$(value: Observable) {
        this._deferralClasses$ = value;
    }
}

