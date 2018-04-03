import {Component, EventEmitter, OnDestroy, OnInit, Output} from '@angular/core';
import {Task} from '../../../../shared/_models/task/task';
import {HistoricalReportService} from '../_services/historical-report.service';
import {Subscription} from 'rxjs/Subscription';
import {ApiRestService} from '../../../../shared/_services/apiRest.service';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {map} from 'rxjs/operators/map';
import {Observable} from 'rxjs/Observable';
import {AtaCorrection} from '../../../../shared/_models/task/ataCorrection';
import {StorageService} from '../../../../shared/_services/storage.service';
import {TranslateService} from '@ngx-translate/core';
import {MessageService} from '../../../../shared/_services/message.service';


@Component({
    selector: 'lsl-ata-correction',
    templateUrl: './ata-correction.component.html',
    styleUrls: ['./ata-correction.component.scss']
})

export class AtaCorrectionComponent implements OnInit, OnDestroy {

    private static ATA_BY_FLEET_ENDPOINT = 'ataByFleet';
    private static TASK_CORRECTION_ENDPOINT = 'tasksCorrection';

    private _ataSub: Subscription;
    private _taskCorrectionSub: Subscription;

    private _ataList: string[];
    private _ataForm: FormGroup;
    private _filteredAta: Observable<string[]>;
    private _open: boolean;
    private _isCorrected: boolean;

    @Output()
    corrected: EventEmitter<any> = new EventEmitter();

    constructor(
        private _historicalReportService: HistoricalReportService,
        private _apiRestService: ApiRestService,
        private _fb: FormBuilder,
        private _storageService: StorageService,
        private _translateService: TranslateService,
        private _messageService: MessageService
    ) {
        this.ataList = [];
        this.open = false;
    }

    ngOnInit(): void {
        this.newAta = this.task.ata;
        this._ataSub = this.getAtaSub(this.task.fleet);
        this._ataForm = this._fb.group({
            ata: [this.task.ata, [Validators.pattern('^(\\d{1,2})$'), Validators.required, this.ataValidator.bind(this)]],
        });
        this.filteredAta = this.getFilteredAta();
    }

    ngOnDestroy(): void {
        this._ataSub.unsubscribe();
        if (this._taskCorrectionSub) {
            this._taskCorrectionSub.unsubscribe();
        }
    }

    private getAtaSub(fleet: string): Subscription {
        return this._apiRestService
        .getParams<string[]>(AtaCorrectionComponent.ATA_BY_FLEET_ENDPOINT, fleet)
        .subscribe(ataList => this.ataList = ataList);
    }

    private getTaskCorrectionSub(): Subscription {
        const signature = new AtaCorrection(this.task.id, this.newAta, this._storageService.getCurrentUser().username);
        return this._apiRestService.search(AtaCorrectionComponent.TASK_CORRECTION_ENDPOINT, signature).subscribe(
            () => {
                this.task.ata = this.newAta;
                this.newAta = '';
            }
        );
    }

    public getFilteredAta(): Observable<string[]> {
        return this.ataForm.controls['ata'].valueChanges.pipe(
            map(val => {
                const result = this.filter(val, this.ataList);
                return result.length > 0 ? result : this.ataList;
            })
        );
    }

    /**
     * Validation for selecting values only from options
     * @param val
     * @param list
     * @return {string}
     */
    public comboValidation(val: string, list: string[]): string {
        return val && list.filter(v => (v.toLowerCase() === val.toLowerCase())).length > 0 ? val : '';
    }

    private ataValidator(control: FormControl) {
        const ata = control.value;
        return this.ataList.length > 0 && this.comboValidation(ata, this.ataList) !== '' ? null : { pattern: true };
    }

    /**
     * Filter for coincidencies
     * @param val
     * @return {string[]}
     */
    public filter(val: string, list: any[]): string[] {
        return list.filter(option => option.toLowerCase().indexOf(val.toLowerCase()) === 0);
    }

    public submitAta() {
        if (this.ataForm.valid) {
            this.task.ata = this.newAta;
            this.isCorrected = true;
            this.corrected.emit(true);
            this.open = false;
        } else {
            this._translateService.get('FLEET_HEALTH.REPORT.ERROR.REQUIRED_FIELDS').subscribe((res: string) => this._messageService.openSnackBar(res));
        }
    }

    get task(): Task {
        return this._historicalReportService.task;
    }

    get ataList(): string[] {
        return this._ataList;
    }

    set ataList(value: string[]) {
        this._ataList = value;
    }

    get ataForm(): FormGroup {
        return this._ataForm;
    }

    set ataForm(value: FormGroup) {
        this._ataForm = value;
    }

    get filteredAta(): Observable<string[]> {
        return this._filteredAta;
    }

    set filteredAta(value: Observable<string[]>) {
        this._filteredAta = value;
    }

    get newAta(): string {
        return this._historicalReportService.newAta;
    }

    set newAta(value: string) {
        this._historicalReportService.newAta = value;
    }

    get open(): boolean {
        return this._open;
    }

    set open(value: boolean) {
        this._open = value;
    }

    get isCorrected(): boolean {
        return this._historicalReportService.isAtaCorrected;
    }

    set isCorrected(value: boolean) {
        this._historicalReportService.isAtaCorrected = value;
    }
}
