import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { Http, Response } from "@angular/http";
import { DataService } from "../../../commons/data.service/data.service";
import { Subscription } from "rxjs/Subscription";

@Component({
    selector: 'lsl-contingence-list',
    templateUrl: './contingenceList.component.html',
    styleUrls: ['./contingenceList.component.css']
})

export class ContingenceListComponent implements OnInit, OnDestroy {

    private _messageSubscriptions: Subscription;
    private apiUrl: string = "http://localhost:9002/api/contingences?userName=a&idToken=a";
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
        })
    }

    getTimeAverage(creationDate: number, duration: number) {
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
