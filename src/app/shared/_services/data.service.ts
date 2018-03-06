import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import { Contingency } from '../_models/contingency/contingency';
import {HttpErrorResponse} from '@angular/common/http';
import {Subject} from 'rxjs/Subject';

@Injectable()
export class DataService {

    private messageSourceString = new BehaviorSubject<string>('default message');
    private messageSourceContingency = new BehaviorSubject<Contingency>(null);
    private messageSourceNumber = new BehaviorSubject<number>(0);
    private messageSourceError = new Subject<HttpErrorResponse>();

    public currentStringMessage = this.messageSourceString.asObservable();
    public currentNumberMessage = this.messageSourceNumber.asObservable();
    public currentSelectedContingency = this.messageSourceContingency.asObservable();
    public currentError = this.messageSourceError.asObservable();

    constructor() { }

    public stringMessage(message: string) {
        this.messageSourceString.next(message);
    }

    public changeSelectedContingency(message: Contingency) {
        this.messageSourceContingency.next(message);
    }

    public changeTimeUTCMessage(message: number) {
        this.messageSourceNumber.next(message);
    }

    public triggerError(message: HttpErrorResponse) {
        this.messageSourceError.next(message);
    }
}
