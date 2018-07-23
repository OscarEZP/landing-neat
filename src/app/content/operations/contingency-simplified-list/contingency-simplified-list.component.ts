import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { IntervalObservable } from 'rxjs/observable/IntervalObservable';
import { Subscription } from 'rxjs/Subscription';
import { Contingency } from '../../../shared/_models/contingency/contingency';
import { ApiRestService } from '../../../shared/_services/apiRest.service';
import { DataService } from '../../../shared/_services/data.service';
import { MessageService } from '../../../shared/_services/message.service';
import { DialogService } from '../../_services/dialog.service';
import { GroupTypes } from '../../../shared/_models/configuration/groupTypes';
import {SearchContingency} from '../../../shared/_models/contingency/searchContingency';

@Component({
    selector: 'lsl-contingency-simplified-list',
    templateUrl: './contingency-simplified-list.component.html',
    styleUrls: ['./contingency-simplified-list.component.scss'],
    providers: [DialogService]
})

export class ContingencySimplifiedListComponent implements OnInit, OnDestroy {
    private static CONTINGENCY_SEARCH_ENDPOINT = 'contingencySearch';
    private _messageSubscriptions: Subscription;
    private _reloadSubscription: Subscription;
    private _alive: boolean;
    private _period: number;
    public contingencyList;
    public progressBarColor: string;
    public currentUTCTime: number;

    @Output() messageEvent = new EventEmitter<number>();

    constructor(private httpClient: HttpClient, private messageData: DataService, private dialogService: DialogService, public translate: TranslateService, private messageService: MessageService, private _apiService: ApiRestService) {
        translate.setDefaultLang('en');
        this.contingencyList = [];
        this._alive = true;
        this._period = 0;
    }

    ngOnInit() {
        this.currentUTCTime = 0;
        this.progressBarColor = 'primary';
        this._messageSubscriptions = this.messageData.currentNumberMessage.subscribe(message => this.currentUTCTime = message);
        this._reloadSubscription = this.messageData.currentStringMessage.subscribe(message => this.reloadList(message));
        this.getContingences();

        this._apiService.getSingle('configTypes', 'HEMICYCLE_PERIOD').subscribe(rs => {
            const res = rs as GroupTypes;
            this._period = Number(res.types[0].code);
            IntervalObservable.create(this._period * 60000)
                .takeWhile(() => this._alive)
                .subscribe(() => {
                    this.reloadList('reload');
                });
        });
    }

    ngOnDestroy() {
        this._messageSubscriptions.unsubscribe();
        this._reloadSubscription.unsubscribe();
    }

    public reloadList(message) {
        if (message === 'reload') {
            this.getContingences();
        }
    }

    private getContingences() {
        this.messageData.stringMessage('open');
        const search: SearchContingency = SearchContingency.getInstance();
        search.isClose = false;
        this._apiService
            .search<Contingency[]>(ContingencySimplifiedListComponent.CONTINGENCY_SEARCH_ENDPOINT, search)
            .subscribe((response: Contingency[]) => this.contingencyList = response,
                (response: HttpErrorResponse) => () => {
                    this.messageData.stringMessage('close');
                    this.messageService.openSnackBar(response.error.message);
                },
                () => {
                    this.messageData.stringMessage('close');
                    this.messageEvent.emit(this.contingencyList.length);
                });
    }

    public getTimeAverage(creationDate: any, duration: any, remain: boolean, limit: number) {
        const actualTime = this.currentUTCTime;
        let average: number;
        const valueNumber = creationDate - actualTime;
        let warning = false;

        if (valueNumber > 0) {
            if (valueNumber <= limit) {
                warning = true;
            }
            const minutesConsumed = duration - ((valueNumber / 1000) / 60);

            average = Math.round((minutesConsumed * 100) / duration);
        } else {
            warning = true;
            average = 100;
        }

        return remain ? warning : average;
    }

}
