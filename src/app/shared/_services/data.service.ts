import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';

@Injectable()
export class DataService {

    private messageSourceString = new BehaviorSubject<string>('default message');
    private messageSourceNumber = new BehaviorSubject<number>(0);
    currentStringMessage = this.messageSourceString.asObservable();
    currentNumberMessage = this.messageSourceNumber.asObservable();

    constructor() { }

    activateLoadingBar(message: string) {
        this.messageSourceString.next(message);
    }

    changeTimeUTCMessage(message: number) {
        this.messageSourceNumber.next(message);
    }
}
