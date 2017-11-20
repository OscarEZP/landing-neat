import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { Http, Response } from '@angular/http';
import { DataService } from '../../../shared/_services/data.service';
import { Subscription } from 'rxjs/Subscription';
import { environment } from "../../../../../environments/environment";

@Component({
    selector: 'lsl-contingency-list',
    templateUrl: './contingency-list.component.html',
    styleUrls: ['./contingency-list.component.scss']
})

export class ContingencyListComponent implements OnInit, OnDestroy {

    private _messageSubscriptions: Subscription;
    private apiUrl = environment.apiUrl + environment.paths.contingencyList;
    private contingenceList: any = {};
    private utcTime: number;

    @Output() messageEvent = new EventEmitter<number>();

    constructor(private http: Http, private messageData: DataService) {
        this.getContingences();
        this.getData();
        this.utcTime = 0;
    }

    getData() {
        return this.http
            .get(this.apiUrl)
            .map((res: Response) => res.json());
    }

    getContingences() {
        this.getData().subscribe(data => {
            this.contingenceList = data;
            this.messageEvent.emit(data.length);
        });
    }

    getTimeAverage(creationDate: any, duration: any) {
        const actualTime = this.utcTime;
        let average: number;
        let valueNumber = (creationDate + duration) - actualTime;

        if (valueNumber > 0) {
            average = 100 - Math.round(((valueNumber * 100) / duration));
        } else {
            average = 100;
        }

        return average;
    }

    ngOnInit() {
        this._messageSubscriptions = this.messageData.currentNumberMessage.subscribe(message => this.utcTime = message)
    }

    ngOnDestroy() {
        this._messageSubscriptions.unsubscribe();
    }
}
