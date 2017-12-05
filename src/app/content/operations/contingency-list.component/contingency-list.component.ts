import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { Http } from '@angular/http';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs/Subscription';
import { environment } from '../../../../../environments/environment';
import { Aircraft } from '../../../shared/_models/aircraft';
import { Contingency } from '../../../shared/_models/contingency';
import { Flight } from '../../../shared/_models/flight';
import { Interval } from '../../../shared/_models/interval';
import { Safety } from '../../../shared/_models/safety';
import { Status } from '../../../shared/_models/status';
import { TimeInstant } from '../../../shared/_models/timeInstant';
import { DataService } from '../../../shared/_services/data.service';
import { MessageService } from '../../../shared/_services/message.service';
import { DialogService } from '../../_services/dialog.service';
import { CloseContingencyComponent } from '../close-contingency/close-contingency.component';
import { DetailsService } from '../../../details/_services/details.service';
import { HttpClient } from '@angular/common/http';

@Component({
    selector: 'lsl-contingency-list',
    templateUrl: './contingency-list.component.html',
    styleUrls: ['./contingency-list.component.scss'],
    providers: [DialogService]
})

export class ContingencyListComponent implements OnInit, OnDestroy {

    private _messageSubscriptions: Subscription;
    private _reloadSubscription: Subscription;
    private apiUrl = environment.apiUrl + environment.paths.contingencyList;
    public contingencyList;
    public progressBarColor: string;
    public currentUTCTime: number;

    @Output() messageEvent = new EventEmitter<number>();

    constructor(private http: Http,
                private httpClient: HttpClient,
                private messageData: DataService,
                private dialogService: DialogService,
                public translate: TranslateService,
                private messageService: MessageService,
                public detailsService: DetailsService) {
        translate.setDefaultLang('en');
        this.contingencyList = [];
    }

    openDetails(contingency: Contingency, section: string){
        this.detailsService.contingency = contingency;
        this.detailsService.openDetails(section);
    }

    ngOnInit() {
        this.currentUTCTime = 0;
        this.progressBarColor = 'primary';
        this._messageSubscriptions = this.messageData.currentNumberMessage.subscribe(message => this.currentUTCTime = message);
        this._reloadSubscription = this.messageData.currentStringMessage.subscribe(message => this.reloadList(message));
        this.showContingencies();
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
            this.showContingencies();
        }
    }

    private showContingencies() {
        this.messageData.stringMessage('open');
        this.httpClient.get(this.apiUrl).subscribe(
            data => {
                this.contingencyList = data;
                this.messageData.stringMessage('close');
                console.log('alerts length: ' + (<any>data).length);
                this.messageEvent.emit((<any>data).length);
            }, reason => {
                this.messageData.stringMessage('close');
                this.messageService.openSnackBar(reason);
            }
        );
    }

    private getContingences() {
        this.messageData.stringMessage('open');

        return new Promise((resolve, reject) => {
            this.http
                .get(this.apiUrl)
                .toPromise()
                .then(data => {
                    this.applyRs({data: data.json()});
                    this.messageData.stringMessage('close');
                    console.log('alerts length: ' + data.json().length);
                    this.messageEvent.emit(data.json().length);
                    if (data.json().length) {
                        this.detailsService.contingency = this.contingencyList[0];
                    }
                    resolve();
                }, reason => { // error
                    this.messageData.stringMessage('close');
                    this.messageService.openSnackBar(reason);
                    reject(reason);
                });
        });
    }

    private applyRs(parameters: { data: any }) {
        const data = parameters.data;

        for (let i = 0; i < data.length; i++) {

            this.contingencyList[i] = new Contingency(
                data[i].id,
                new Aircraft(
                    data[i].aircraft.tail,
                    data[i].aircraft.fleet,
                    data[i].aircraft.operator
                ),
                data[i].barcode,
                new TimeInstant(
                    data[i].creationDate.epochTime,
                    data[i].creationDate.label
                ),
                data[i].failure,
                new Flight(
                    data[i].flight.flightNumber,
                    data[i].flight.origin,
                    data[i].flight.destination,
                    new TimeInstant(
                        data[i].flight.etd.epochTime,
                        data[i].flight.etd.label
                    )
                ),
                data[i].informer,
                data[i].isBackup,
                data[i].reason,
                new Safety(
                    data[i].safetyEvent.code,
                    data[i].safetyEvent.description
                ),
                new Status(
                    data[i].status.code,
                    data[i].status.contingencyId,
                    new TimeInstant(
                        data[i].status.creationDate.epochTime,
                        data[i].status.creationDate.label
                    ),
                    data[i].status.observation,
                    new Interval(
                        new TimeInstant(
                            data[i].status.realInterval.dt.epochTime,
                            data[i].status.realInterval.dt.label
                        ),
                        data[i].status.realInterval.duration
                    ),
                    new Interval(
                        new TimeInstant(
                            data[i].status.requestedInterval.dt.epochTime,
                            data[i].status.requestedInterval.dt.label
                        ),
                        data[i].status.requestedInterval.duration
                    ),
                    data[i].status.username
                ),
                data[i].type,
                data[i].username
            );
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
