import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {Subscription} from 'rxjs/Subscription';
import {DetailsService} from '../../../details/_services/details.service';
import {Contingency} from '../../../shared/_models/contingency';
import {DataService} from '../../../shared/_services/data.service';
import {DialogService} from '../../_services/dialog.service';
import {CloseContingencyComponent} from '../close-contingency/close-contingency.component';
import {ActivatedRoute} from '@angular/router';
import {HistoricalSearchService} from '../_services/historical-search.service';
import {ContingencyService} from '../_services/contingency.service';
import {InfiniteScrollService} from '../_services/infinite-scroll.service';
import {MatPaginator} from '@angular/material';

@Component({
    selector: 'lsl-contingency-list',
    templateUrl: './contingency-list.component.html',
    styleUrls: ['./contingency-list.component.scss'],
    providers: [DialogService]
})

export class ContingencyListComponent implements OnInit, OnDestroy {

    @ViewChild('contPaginator') public paginator: MatPaginator;

    private _messageSubscriptions: Subscription;
    private _reloadSubscription: Subscription;
    public contingencyList: Contingency[];
    public progressBarColor: string;
    public currentUTCTime: number;
    private _searchSignature: { from: { epochTime: number }, to: { epochTime: number }, offSet: number, limit: number };

    constructor(private messageData: DataService,
                private dialogService: DialogService,
                public translate: TranslateService,
                private route: ActivatedRoute,
                private _detailsService: DetailsService,
                private _historicalSearchService: HistoricalSearchService,
                private _contingencyService: ContingencyService,
                private _infiniteScrollService: InfiniteScrollService) {
        translate.setDefaultLang('en');
        this.contingencyList = [];
    }

    get infiniteScrollService(): InfiniteScrollService {
        return this._infiniteScrollService;
    }

    get detailsService(): DetailsService {
        return this._detailsService;
    }

    get historicalSearchService(): HistoricalSearchService {
        return this._historicalSearchService;
    }

    get contingencyService(): ContingencyService {
        return this._contingencyService;
    }

    ngOnInit() {
        this.currentUTCTime = 0;
        this.progressBarColor = 'primary';
        this._messageSubscriptions = this.messageData.currentNumberMessage.subscribe(message => this.currentUTCTime = message);
        this._reloadSubscription = this.messageData.currentStringMessage.subscribe(message => this.reloadList(message));
        this.route.data.subscribe((data: any) => {
            this.historicalSearchService.active = data.historical;
        });

        this.getContingencies();
        this._searchSignature = {
            from: {
                epochTime: this.historicalSearchService.fromTS
            },
            to: {
                epochTime: this.historicalSearchService.toTS
            },
            offSet: this.infiniteScrollService.offset,
            limit: this.infiniteScrollService.pageSize
        };
        this.paginator.page.subscribe((page) => {
            this.infiniteScrollService.pageSize = page.pageSize;
            this.infiniteScrollService.pageIndex = page.pageIndex;
            this.contingencyService.postHistoricalSearch(this._searchSignature).subscribe();
        });
    }

    public checkDataStatus(): boolean {
        return this.contingencyService.data.length > 0 && !this.contingencyService.loading;
    }

    public openDetails(contingency: Contingency, section: string) {
        this.detailsService.contingency = contingency;
        this.detailsService.openDetails(section);
    }

    public ngOnDestroy() {
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
            this.getContingencies();
        }
    }

    private getContingencies() {
        if (!this.historicalSearchService.active) {
            this.contingencyService.getContingencies().subscribe();
        }
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
