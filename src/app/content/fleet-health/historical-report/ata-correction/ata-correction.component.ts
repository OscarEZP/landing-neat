import {Component, OnDestroy, OnInit} from '@angular/core';
import {Task} from '../../../../shared/_models/task/task';
import {FleetHealthService} from '../../_services/fleet-health.service';
import {Subscription} from 'rxjs/Subscription';
import {ApiRestService} from '../../../../shared/_services/apiRest.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {map} from 'rxjs/operators/map';
import {Observable} from 'rxjs/Observable';
import {AtaCorrection} from '../../../../shared/_models/task/ataCorrection';
import {StorageService} from '../../../../shared/_services/storage.service';


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

    private _atas: string[];
    private _ataForm: FormGroup;
    private _filteredAta: Observable<string[]>;
    private _open: boolean;

    constructor(
        private _fleetHealthService: FleetHealthService,
        private _apiRestService: ApiRestService,
        private _fb: FormBuilder,
        private _storageService: StorageService
    ) {
    }

    ngOnInit(): void {
        this._ataSub = this.getAtaSub(this._fleetHealthService.task.fleet);
        this.newAta = this._fleetHealthService.task.ata;
        this.open = false;
        this._ataForm = this._fb.group({
            ata: [this._fleetHealthService.task.ata, [Validators.pattern('^(\\d{1,2})$'), Validators.required]],
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
        .subscribe(atas => this.atas = atas);
    }

    private getTaskCorrectionSub(): Subscription {
        const signature = new AtaCorrection(this._fleetHealthService.task.id, this.newAta, this._storageService.getCurrentUser().username);
        return this._apiRestService.search(AtaCorrectionComponent.TASK_CORRECTION_ENDPOINT, signature).subscribe();
    }

    public getFilteredAta(): Observable<string[]> {
        return this.ataForm.controls['ata'].valueChanges.pipe(
            map(val => {
                const result = this.filter(val, this.atas);
                return result.length > 0 ? result : this.atas;
            })
        );
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
            this._taskCorrectionSub = this.getTaskCorrectionSub();
            this.open = false;
        }
    }

    get task(): Task {
        return this._fleetHealthService.task;
    }

    get atas(): string[] {
        return this._atas;
    }

    set atas(value: string[]) {
        this._atas = value;
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
        return this._fleetHealthService.newAta;
    }

    set newAta(value: string) {
        this._fleetHealthService.newAta = value;
    }

    get open(): boolean {
        return this._open;
    }

    set open(value: boolean) {
        this._open = value;
    }
}
