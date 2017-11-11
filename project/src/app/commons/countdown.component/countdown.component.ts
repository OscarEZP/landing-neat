import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnDestroy} from '@angular/core';

@Component({
    selector: 'lsl-countdown',
    templateUrl: './countdown.component.html',
    styleUrls: ['./countdown.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CountdownComponent implements OnDestroy {

    private _creationTime: number;
    private _duration: number;
    private _timing: number = 1000;
    private _interval;

    @Input()
    public set creationTime(value: string | number) {
        this._creationTime = parseInt(value as string, 10);
        //this._startTimer();
    }

    @Input()
    public set duration(value: string | number) {
        this._duration = parseInt(value as string, 10);
        this._startTimer();
    }

    @Input()
    public set timing(value: string | number) {
        this._timing = parseInt(value as string, 10);
        this._startTimer();
    }

    @Input()
    public format: string = '{hh}:{mm}:{ss}';

    public get delta() {
        let currentDate = new Date();

        return Math.max(0, Math.floor(((this._creationTime + this._duration) - currentDate.getTime()) / 1000));
    }

    public get displayTime() {
        let hours, minutes, seconds, delta = this.delta, creationTime = this.format;

        hours = Math.floor(delta  / 3600) % 24;
        delta -= hours * 3600;
        minutes = Math.floor(delta  / 60) % 60;
        delta -= minutes * 60;
        seconds = delta % 60;

        hours = hours.toString().length == 1 ? '0' + hours : hours;
        minutes = minutes.toString().length == 1 ? '0' + minutes : minutes;
        seconds = seconds.toString().length == 1 ? '0' + seconds : seconds;

        creationTime = creationTime.replace('{hh}', hours);
        creationTime = creationTime.replace('{mm}', minutes);
        creationTime = creationTime.replace('{ss}', seconds);

        return creationTime;
    }

    constructor(private _changeDetector: ChangeDetectorRef) {
    }

    ngOnDestroy() {
        this._stopTimer();
    }

    private _startTimer() {
        if(this.delta <= 0) return;

        this._stopTimer();
        this._interval = setInterval(() => {
            this._changeDetector.detectChanges();
            if(this.delta <= 0) {
                this._stopTimer();
            }
        }, this._timing)
    }

    private _stopTimer() {
        clearInterval(this._interval);
        this._interval = undefined;
    }

}
