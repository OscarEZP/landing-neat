import {Component, OnDestroy, OnInit} from '@angular/core';
import {ApiRestService} from '../../../../shared/_services/apiRest.service';
import {Subscription} from 'rxjs/Subscription';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Station} from '../../../../shared/_models/management/station';
import {StorageService} from '../../../../shared/_services/storage.service';
import {MatCheckbox, MatInput} from '@angular/material';
import {TechnicalStation} from '../../../../shared/_models/task/fleethealth/technical/technicalStation';
import {TechnicalAnalysis} from '../../../../shared/_models/task/fleethealth/technical/technicalAnalysis';

@Component({
    selector: 'lsl-atec-filter',
    templateUrl: './atec-filter.component.html',
    styleUrls: ['./atec-filter.component.scss']
})
export class AtecFilterComponent implements OnInit, OnDestroy {

    public static TECHNICAL_STATION_SEARCH_ENDPOINT = 'technicalStationSearch';
    public static TECHNICAL_NOT_CONFIGURED_AUTHORITY_ENDPOINT = 'technicalNotConfiguredAuthoritySearch';
    public static TECHNICAL_ANALYSIS_SEARCH = 'technicalAnalysisSearch';

    private _stations: Station[];
    private _technicalStations: TechnicalStation[];
    private _authoritiesNoRelated: string[];
    private _authoritiesMerged: string[];
    private _selectedAuthorities: string[];
    private _atecForm: FormGroup;
    private _technicalAnalyzes: TechnicalAnalysis[];
    private _originalAnalyzes: TechnicalAnalysis[];
    private _selectedStation: TechnicalStation;

    private _authoritiesSub: Subscription;
    private _authoritiesNoRelatedSub: Subscription;
    private _deferralClassesSub: Subscription;

    constructor(
        private _apiRestService: ApiRestService,
        private _fb: FormBuilder,
        private _storageService: StorageService
    ) {
        this.selectedStation = TechnicalStation.getInstance();
        this.technicalAnalyzes = [];
        this.technicalStations = [];
        this.authoritiesNoRelated = [];
        this.originalAnalyzes = [];
        this.atecForm = _fb.group({
            'authorities': [[], Validators.required],
            'station': [[], Validators.required],
        });
    }

    ngOnInit() {
        this.resetValues();
        this.stations = this._storageService.userStations;
        this._authoritiesSub = this.getAuthorities();
        this._authoritiesNoRelatedSub = this.getAuthoritiesNotRelated();
        this._deferralClassesSub = new Subscription();
        this._authoritiesNoRelatedSub = new Subscription();

    }

    ngOnDestroy() {
        this._authoritiesSub.unsubscribe();
        this._authoritiesNoRelatedSub.unsubscribe();
    }

    public checkAll(input: MatInput, check: MatCheckbox) {
        if (check.checked) {
            input.value = 0;
            input.disabled = true;
        } else {
            input.value = 1;
            input.disabled = false;
        }
    }

    /**
     *
     * @returns {Subscription}
     */
    private getAuthorities(): Subscription {
        const signature = {
            stations: this.stations
        };
        return this._apiRestService
            .search<TechnicalStation[]>(AtecFilterComponent.TECHNICAL_STATION_SEARCH_ENDPOINT, signature)
            .subscribe(res => {
                this.technicalStations = res;
            });
    }

    /**
     *
     * @returns {Subscription}
     */
    private getAuthoritiesNotRelated(): Subscription {
        return this._apiRestService
            .getAll<string[]>(AtecFilterComponent.TECHNICAL_NOT_CONFIGURED_AUTHORITY_ENDPOINT)
            .subscribe(res => {
                this.authoritiesNoRelated = res;
            });
    }

    /**
     *
     * @returns {Subscription}
     */
    private getDeferralClassesSub(): Subscription {
        const signature = {
            station: this.selectedStation.station
        };
        return this._apiRestService
            .search<TechnicalAnalysis[]>(AtecFilterComponent.TECHNICAL_ANALYSIS_SEARCH, signature)
            .subscribe(res => {
                this.technicalAnalyzes = res;
                this.originalAnalyzes = res;
            });
    }

    /**
     *
     * @returns {Subscription}
     */
    private getDeafultConfiguration(): Subscription {
        return this._apiRestService
            .getAll<TechnicalAnalysis[]>(AtecFilterComponent.TECHNICAL_ANALYSIS_SEARCH)
            .subscribe(res => {
                this.technicalAnalyzes = res;
            });
    }

    private concatAuthorities(): string[] {
        return this.selectedStation && this.selectedStation.authorities.length > 0 ?
            this.selectedStation.authorities.concat(this.authoritiesNoRelated) :
            this.authoritiesNoRelated;
    }

    public setSelectedStation(value: string) {
        const selectedStation = this.technicalStations.find(a => a.station === value);
        this.selectedStation = selectedStation ? selectedStation : new TechnicalStation(value, []);
        this.selectedAuthorities = this.selectedStation.authorities.length > 0 ? this.selectedStation.authorities : [];
        this._deferralClassesSub.unsubscribe();
        this._deferralClassesSub = this.getDeferralClassesSub();
        this._authoritiesNoRelatedSub.unsubscribe();
        this._authoritiesNoRelatedSub = this.getAuthoritiesNotRelated().add(() => {
            this.authoritiesMerged = this.concatAuthorities();
        });
    }

    public updateTabs(authorities: string[]): TechnicalAnalysis[] {
        authorities
            .filter(a => !this.technicalAnalyzes.find(ta => ta.authority === a))
            .forEach(a => {
                const originalAnalysis = this.originalAnalyzes.find(oa => oa.authority === a);
                if (!originalAnalysis) {
                    this.technicalAnalyzes.push(new TechnicalAnalysis(this.selectedStation.station, a));
                } else {
                    this.technicalAnalyzes.push(originalAnalysis);
                }
            });

        this.technicalAnalyzes = this.technicalAnalyzes
            .filter(ta => !!authorities.find(a => a === ta.authority));

        return this.technicalAnalyzes;
    }

    public cancel(): void {
        this.resetValues();
    }

    private resetValues(): void {
        this.selectedStation = TechnicalStation.getInstance();
        this.selectedAuthorities = [];
        this.technicalAnalyzes = [];
    }

    public getAuthoritiesLbl(station: string): string {
        const ts = this.technicalStations.find(s => s.station === station);
        return ts ? ts.authorities.sort((r1, r2) => r1 > r2 ? 1 : -1).join(', ') : '';
    }

    public submitForm(): void {
        console.log('sent!',
            // this.selectedAuthorities,
            this.selectedStation);
    }

    get technicalStations(): TechnicalStation[] {
        return this._technicalStations;
    }

    set technicalStations(value: TechnicalStation[]) {
        this._technicalStations = value;
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

    get selectedStation(): TechnicalStation {
        return this._selectedStation;
    }

    set selectedStation(value: TechnicalStation) {
        this._selectedStation = value;
    }

    get authoritiesNoRelated(): string[] {
        return this._authoritiesNoRelated;
    }

    set authoritiesNoRelated(value: string[]) {
        this._authoritiesNoRelated = value;
    }

    get technicalAnalyzes(): TechnicalAnalysis[] {
        return this._technicalAnalyzes;
    }

    set technicalAnalyzes(value: TechnicalAnalysis[]) {
        value = value.sort((r1, r2) => r1.authority > r2.authority ? 1 : -1);
        this._technicalAnalyzes = value.map(v => Object.assign(TechnicalAnalysis.getInstance(), v));
    }

    get authoritiesMerged(): string[] {
        return this._authoritiesMerged;
    }

    set authoritiesMerged(value: string[]) {
        this._authoritiesMerged = value;
    }

    get originalAnalyzes(): TechnicalAnalysis[] {
        return this._originalAnalyzes;
    }

    set originalAnalyzes(value: TechnicalAnalysis[]) {
        value = value.sort((r1, r2) => r1.authority > r2.authority ? 1 : -1);
        this._originalAnalyzes = value;
    }
}

