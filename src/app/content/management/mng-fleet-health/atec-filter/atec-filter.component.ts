import {Component, OnDestroy, OnInit} from '@angular/core';
import {ApiRestService} from '../../../../shared/_services/apiRest.service';
import {Subscription} from 'rxjs/Subscription';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Station} from '../../../../shared/_models/management/station';
import {StorageService} from '../../../../shared/_services/storage.service';
import {MatCheckbox, MatInput} from '@angular/material';
import {TechnicalStation} from '../../../../shared/_models/task/fleethealth/technical/technicalStation';
import {TechnicalAnalysis} from '../../../../shared/_models/task/fleethealth/technical/technicalAnalysis';
import {AnalysisDetail} from '../../../../shared/_models/task/fleethealth/technical/analysisDetail';
import {Audit} from '../../../../shared/_models/common/audit';

@Component({
    selector: 'lsl-atec-filter',
    templateUrl: './atec-filter.component.html',
    styleUrls: ['./atec-filter.component.scss']
})
export class AtecFilterComponent implements OnInit, OnDestroy {

    public static TECHNICAL_STATION_SEARCH_ENDPOINT = 'technicalStationSearch';
    public static TECHNICAL_NOT_CONFIGURED_AUTHORITY_ENDPOINT = 'technicalNotConfiguredAuthoritySearch';
    public static TECHNICAL_ANALYSIS_SEARCH_ENDPOINT = 'technicalAnalysisSearch';
    public static TECHNICAL_DEFAULT_CONFIG_ENDPOINT = 'technicalDefaultConfig';
    public static TECHNICAL_ANALYSIS_SAVE_ALL_ENDPOINT = 'technicalAnalysisSaveAll';

    private _stations: Station[];
    private _technicalStations: TechnicalStation[];
    private _authoritiesNoRelated: string[];
    private _authoritiesMerged: string[];
    private _selectedAuthorities: string[];
    private _atecForm: FormGroup;
    private _technicalAnalyzes: TechnicalAnalysis[];
    private _originalAnalyzes: TechnicalAnalysis[];
    private _selectedStation: TechnicalStation;
    private _defaultConfiguration: AnalysisDetail[];

    private _authoritiesSub: Subscription;
    private _authoritiesNoRelatedSub: Subscription;
    private _deferralClassesSub: Subscription;
    private _defaultConfigurationSub: Subscription;
    private _audit: Audit;

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
        this.authoritiesMerged = [];
        this.atecForm = _fb.group({
            'authorities': [[], Validators.required],
            'station': [this.selectedStation, Validators.required],
        });
        this.audit = Audit.getInstance();
        this.audit.username = this._storageService.username;
    }

    ngOnInit() {
        this.resetValues();
        this.stations = this._storageService.userStations;
        this.authoritiesSub = this.getAuthorities();
        this.authoritiesNoRelatedSub = this.getAuthoritiesNotRelated();
        this.deferralClassesSub = new Subscription();
        this.defaultConfigurationSub = this.getDefaultConfiguration();
    }

    ngOnDestroy() {
        this.authoritiesSub.unsubscribe();
        this.authoritiesNoRelatedSub.unsubscribe();
        this.deferralClassesSub.unsubscribe();
        this.defaultConfigurationSub.unsubscribe();
    }

    public checkAll(input: MatInput, check: MatCheckbox): number {
        let day = 0;
        if (check.checked) {
            input.disabled = true;
        } else {
            day = 1;
            input.disabled = false;
        }
        return day;
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
            .search<TechnicalAnalysis[]>(AtecFilterComponent.TECHNICAL_ANALYSIS_SEARCH_ENDPOINT, signature)
            .subscribe(res => {
                this.technicalAnalyzes = res;
                this.originalAnalyzes = res;
            });
    }

    /**
     *
     * @returns {Subscription}
     */
    private getDefaultConfiguration(): Subscription {
        return this._apiRestService
            .getAll<AnalysisDetail[]>(AtecFilterComponent.TECHNICAL_DEFAULT_CONFIG_ENDPOINT)
            .subscribe(res => {
                this.defaultConfiguration = res;
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
        this.deferralClassesSub.unsubscribe();
        this.deferralClassesSub = this.getDeferralClassesSub();
        this.authoritiesNoRelatedSub.unsubscribe();
        this.authoritiesNoRelatedSub = this.getAuthoritiesNotRelated().add(() => {
            this.authoritiesMerged = this.concatAuthorities();
        });
    }

    public updateTabs(authorities: string[]): TechnicalAnalysis[] {
        authorities
            .filter(a => !this.technicalAnalyzes.find(ta => ta.authority === a))
            .forEach(a => {
                const originalAnalysis = this.originalAnalyzes.find(oa => oa.authority === a);
                if (!originalAnalysis) {
                    this.technicalAnalyzes.push(new TechnicalAnalysis(this.selectedStation.station, a, this.defaultConfiguration, this.audit));
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
        console.log('sent!', this.atecForm.valid, this.technicalAnalyzes);
        if (this.atecForm.valid) {
            this._apiRestService
                .add<any>(AtecFilterComponent.TECHNICAL_ANALYSIS_SAVE_ALL_ENDPOINT, this.technicalAnalyzes, this.selectedStation.station)
                .toPromise()
                .then(res => {
                    this.authoritiesSub = this.getAuthorities();
                    console.log('s', res);
                })
                .catch(error => {
                    console.log('e', error);
                })
            ;
        }
    }

    get technicalStations(): TechnicalStation[] {
        return this._technicalStations;
    }

    set technicalStations(value: TechnicalStation[]) {
        this._technicalStations = value;
    }

    get selectedAuthorities(): string[] {
        return this._selectedAuthorities.sort((r1, r2) => r1 > r2 ? 1 : -1);
    }

    set selectedAuthorities(value: string[]) {
        value = value.sort((r1, r2) => r1 > r2 ? 1 : -1);
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
        return this._technicalAnalyzes.sort((r1, r2) => r1.authority > r2.authority ? 1 : -1);
    }

    set technicalAnalyzes(value: TechnicalAnalysis[]) {
        this._technicalAnalyzes = value.map(v => Object.assign(TechnicalAnalysis.getInstance(), v));
    }

    get authoritiesMerged(): string[] {
        return this._authoritiesMerged.length ?
            this._authoritiesMerged.sort((r1, r2) => r1 > r2 ? 1 : -1) :
            this._authoritiesMerged;
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

    get authoritiesSub(): Subscription {
        return this._authoritiesSub;
    }

    set authoritiesSub(value: Subscription) {
        this._authoritiesSub = value;
    }

    get authoritiesNoRelatedSub(): Subscription {
        return this._authoritiesNoRelatedSub;
    }

    set authoritiesNoRelatedSub(value: Subscription) {
        this._authoritiesNoRelatedSub = value;
    }

    get deferralClassesSub(): Subscription {
        return this._deferralClassesSub;
    }

    set deferralClassesSub(value: Subscription) {
        this._deferralClassesSub = value;
    }

    get defaultConfigurationSub(): Subscription {
        return this._defaultConfigurationSub;
    }

    set defaultConfigurationSub(value: Subscription) {
        this._defaultConfigurationSub = value;
    }

    get defaultConfiguration(): AnalysisDetail[] {
        return this._defaultConfiguration;
    }

    set defaultConfiguration(value: AnalysisDetail[]) {
        this._defaultConfiguration = value;
    }

    get audit(): Audit {
        return this._audit;
    }

    set audit(value: Audit) {
        this._audit = value;
    }
}

