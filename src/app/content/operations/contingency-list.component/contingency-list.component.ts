import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs/Subscription';
import { DetailsService } from '../../../details/_services/details.service';
import { Contingency } from '../../../shared/_models/contingency';
import { ApiRestService } from '../../../shared/_services/apiRest.service';
import { DataService } from '../../../shared/_services/data.service';
import { MessageService } from '../../../shared/_services/message.service';
import { DialogService } from '../../_services/dialog.service';
import { CloseContingencyComponent } from '../close-contingency/close-contingency.component';
import {ActivatedRoute} from '@angular/router';
import {HistoricalSearchService} from '../_services/historical-search.service';

@Component({
    selector: 'lsl-contingency-list',
    templateUrl: './contingency-list.component.html',
    styleUrls: ['./contingency-list.component.scss'],
    providers: [DialogService]
})

export class ContingencyListComponent implements OnInit, OnDestroy {

    private _messageSubscriptions: Subscription;
    private _reloadSubscription: Subscription;
    public contingencyList: Contingency[];
    public progressBarColor: string;
    public currentUTCTime: number;
    public itemsCount: number;

    constructor(
        private http: HttpClient,
        private messageData: DataService,
        private dialogService: DialogService,
        public translate: TranslateService,
        private messageService: MessageService,
        public detailsService: DetailsService,
        private _apiService: ApiRestService,
        private route: ActivatedRoute,
        private _historicalSearchService: HistoricalSearchService
    ) {
        translate.setDefaultLang('en');
        this.contingencyList = [];
        this.itemsCount = 0;
    }

    ngOnInit() {
        this.currentUTCTime = 0;
        this.progressBarColor = 'primary';
        this._messageSubscriptions = this.messageData.currentNumberMessage.subscribe(message => this.currentUTCTime = message);
        this._reloadSubscription = this.messageData.currentStringMessage.subscribe(message => this.reloadList(message));
        this.route.data.subscribe((data: any) => {
            this._historicalSearchService.active = data.historical;
        });
        this.getContingences();
    }

    openDetails(contingency: Contingency, section: string) {
        this.detailsService.contingency = contingency;
        this.detailsService.openDetails(section);
    }

    ngOnDestroy() {
        this._messageSubscriptions.unsubscribe();
        this._reloadSubscription.unsubscribe();
    }

    public openCloseContingency(contingency: any) {
        this.dialogService.openDialog(CloseContingencyComponent, {
            data: contingency,
            hasBackdrop: true,
            disableClose: true,
            height: '536px',
            width: '500px'
        });
    }

    public reloadList(message) {
        if (message === 'reload') {
            this.getContingences();
        }
    }

    private getContingences() {
        this.messageData.stringMessage('open');

        return this._apiService
                   .getAll<Contingency[]>('contingencyList')
                   .subscribe(data => {
                       this.messageData.stringMessage('close');
                       this.itemsCount = data.length;
                       return this.contingencyList = data;
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
