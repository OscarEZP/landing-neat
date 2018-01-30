import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import { Contingency } from '../_models/contingency/contingency';

@Injectable()
export class DataService {

    private messageSourceString = new BehaviorSubject<string>('default message');
    private messageSourceContingency = new BehaviorSubject<Contingency>(null);
    private messageSourceNumber = new BehaviorSubject<number>(0);
    currentStringMessage = this.messageSourceString.asObservable();
    currentNumberMessage = this.messageSourceNumber.asObservable();
    currentSelectedContingency = this.messageSourceContingency.asObservable();

    constructor() { }

    stringMessage(message: string) {
        this.messageSourceString.next(message);
    }

    changeSelectedContingency(message: Contingency) {
        this.messageSourceContingency.next(message);
    }

    changeTimeUTCMessage(message: number) {
        this.messageSourceNumber.next(message);
    }
}
