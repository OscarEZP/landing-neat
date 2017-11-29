import {Component, EventEmitter, OnDestroy, OnInit, Output} from '@angular/core';
import {Http, Response} from '@angular/http';
import {DataService} from '../../../shared/_services/data.service';
import {Subscription} from 'rxjs/Subscription';
import {environment} from '../../../../../environments/environment';
import {DialogService} from '../../_services/dialog.service';
import {ContingencyFormComponent} from '../contingency-form/contingency-form.component';
import {TranslateService} from '@ngx-translate/core';

@Component({
    selector: 'lsl-contingency-list',
    templateUrl: './contingency-list.component.html',
    styleUrls: ['./contingency-list.component.scss'],
    providers: [DialogService]
})

export class ContingencyListComponent implements OnInit, OnDestroy {

    private _messageSubscriptions: Subscription;
    private apiUrl = environment.apiUrl + environment.paths.contingencyList;
    public contingencyList: any = {};
    private errorMessage: string;
    private utcTime: number;
    public progressBarColor: string;

    @Output() messageEvent = new EventEmitter<number>();

    constructor(
        private http: Http,
        private messageData: DataService,
        private dialogService: DialogService,
        translate: TranslateService
    ) {
        this.getContingences();
        this.getData();
        this.utcTime = 0;
        this.progressBarColor = 'primary';
        translate.setDefaultLang('en');
    }



    getData() {
        this.messageData.activateLoadingBar('open');

        return this.http
            .get(this.apiUrl)
            .map((res: Response) => res.json());
    }

    getContingences() {
        this.getData().subscribe(data => {
            this.contingencyList = data;
            this.messageEvent.emit(data.length);
            this.messageData.activateLoadingBar('close');
        }, error => {
            this.errorMessage = error;
            this.messageData.activateLoadingBar('close');
        });
    }

    getTimeAverage(creationDate: any, duration: any, remain: boolean, limit: number) {
        const actualTime = this.utcTime;
        let average: number;
        const valueNumber = (creationDate + duration) - actualTime;
        let warning = false;

        if (valueNumber > 0) {
            if (valueNumber <= limit) {
                warning = true;
            }
            average = 100 - Math.round(((valueNumber * 100) / duration));
        } else {
            warning = true;
            average = 100;
        }

        return remain ? warning : average;
    }

    ngOnInit() {
        this._messageSubscriptions = this.messageData.currentNumberMessage.subscribe(message => this.utcTime = message);
    }

    ngOnDestroy() {
        this._messageSubscriptions.unsubscribe();
    }
}
