import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';

@Injectable()
export class ClockService {

    private clock: Observable<Date>;
    private currentDate: Date;

    constructor() {
        this.clock = Observable.interval(1000).map(tick => new Date()).share();
    }

    getClock(): Observable<Date> {
        return this.clock;
    }

    setClock(time: number): Observable<Date> {
        this.currentDate = new Date(time);
        this.clock = Observable.interval(1000).map(tick => this.currentDate).share();
        return this.clock;
    }
}
