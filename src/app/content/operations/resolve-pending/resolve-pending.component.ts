import {Component, Inject, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {DialogService} from '../../_services/dialog.service';
import {TranslateService} from '@ngx-translate/core';
import {MAT_DIALOG_DATA} from '@angular/material';
import {StorageService} from '../../../shared/_services/storage.service';
import {MessageService} from '../../../shared/_services/message.service';
import {DataService} from '../../../shared/_services/data.service';
import {ApiRestService} from '../../../shared/_services/apiRest.service';
import {Subscription} from 'rxjs/Subscription';
import {Contingency} from '../../../shared/_models/contingency/contingency';
import {PendingSearch} from '../../../shared/_models/pending/pendingSearch';
import {Pending} from '../../../shared/_models/pending/pending';

@Component({
    selector: 'lsl-resolve-pending',
    templateUrl: './resolve-pending.component.html',
    styleUrls: ['./resolve-pending.component.scss']
})
export class ResolvePendingComponent implements OnInit, OnDestroy {

    private static SEARCH_ENDPOINT = 'pendingSearch';
    private static RESOLVE_ENDPOINT = 'pendingResolve';
    private snackBarMessage: string;
    private _resolveForm: FormGroup;
    private _pendingsSubscription: Subscription;

    private _contingencyId: number;
    private _groupPendingByArea: Map<string, Pending[]>;

    constructor(private _dialogService: DialogService,
                private _translate: TranslateService,
                private _storageService: StorageService,
                private _messageService: MessageService,
                private _dataService: DataService,
                private _apiRestService: ApiRestService,
                private _fb: FormBuilder,
                @Inject(MAT_DIALOG_DATA) private _contingency: Contingency) {
        this._translate.setDefaultLang('en');

        const username = this._storageService.getCurrentUser().username;
        const contingencyId = this._contingency.id;

        this.groupPendingByArea = new Map<string, Pending[]>();
        this.snackBarMessage = '';

    }


    static groupPendingByArea(pendings: Pending[]): Map<string, Pending[]> {
        const pendingsByGroup: Map<string, Pending[]> = new Map<string, Pending[]>();
        for (const pending of pendings) {
            if (pendingsByGroup.has(pending.area)) {
                pendingsByGroup.get(pending.area).push(pending);
            } else {
                const items: Pending[] = [];
                items.push(pending);
                pendingsByGroup.set(pending.area, items);
            }
        }
        return pendingsByGroup;
    }
    ngOnInit() {
        this._pendingsSubscription = this.searchPendings(this.contingencyId);
    }

    ngOnDestroy() {
        if (this._pendingsSubscription) {
            this._pendingsSubscription.unsubscribe();
        }
    }
    private searchPendings(contingencyId: number): Subscription {

        const pendingSearch: PendingSearch = PendingSearch.getInstance();
        pendingSearch.isResolve = false;
        pendingSearch.contingencyId = contingencyId;

        return this._apiRestService.search<Pending[]>(ResolvePendingComponent.SEARCH_ENDPOINT, pendingSearch)
            .subscribe(rs => {
                const res = rs as Pending[];
                this.groupPendingByArea = ResolvePendingComponent.groupPendingByArea(res);
            });

    }


    private validateFilledItems(): boolean {
        let counterFilled = 0;
        const defaultValid = 0;
        Object.keys(this.resolveForm.controls).forEach(elem => {
            if (this.resolveForm.controls[elem].valid) {
                counterFilled = counterFilled + 1;
            }
        });
        return counterFilled > defaultValid;
    }


    get resolveForm(): FormGroup {
        return this._resolveForm;
    }

    set resolveForm(value: FormGroup) {
        this._resolveForm = value;
    }

    get contingencyId(): number {
        return this._contingencyId;
    }

    get groupPendingByArea(): Map<string, Pending[]> {
        return this._groupPendingByArea;
    }

    set groupPendingByArea(value: Map<string, Pending[]>) {
        this._groupPendingByArea = value;
    }

}
