export class ActualTimeModel {

    private _currentTime: string;
    private _currentTimeLong: number;

    constructor(currentTime: string, currentTimeLong: number) {
        this._currentTime = currentTime;
        this._currentTimeLong = currentTimeLong;
    }


    get currentTime(): string {
        return this._currentTime;
    }

    set currentTime(value: string) {
        this._currentTime = value;
    }

    get currentTimeLong(): number {
        return this._currentTimeLong;
    }

    set currentTimeLong(value: number) {
        this._currentTimeLong = value;
    }
}
