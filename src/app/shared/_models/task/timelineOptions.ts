export class TimelineOptions {

    private _end: string;
    private _max: string;
    private _min: string;
    private _stack: boolean;
    private _start: string;
    private _zoomMax: number;
    private _zoomMin: number;
    private _autoResize: boolean;

    constructor(start: string = '', end: string = '', zoomMin: number = 0, zoomMax: number = 0, stack: boolean = true) {
        this._start = start;
        this._end = end;
        this.zoomMin = zoomMin;
        this.zoomMax = zoomMax;
        this._stack = stack;
        this._autoResize = false;
    }

    public static getInstance() {
        return new TimelineOptions();
    }

    public getJson() {
        return JSON.parse(JSON.stringify(this).replace(/\b[_]/g, ''));
    }

    get start(): string {
        return this._start;
    }

    set start(value: string) {
        this._start = value;
    }

    get end(): string {
        return this._end;
    }

    set end(value: string) {
        this._end = value;
    }

    get zoomMin(): number {
        return this._zoomMin;
    }

    set zoomMin(value: number) {
        value = value > 0 ? 1000 * 60 * 60 * 24 * value : 0;
        this._zoomMin = value;
    }

    get zoomMax(): number {
        return this._zoomMax;
    }

    set zoomMax(value: number) {
        value = value > 0 ? 1000 * 60 * 60 * 24 * value : 0;
        this._zoomMax = value;
    }

    get max(): string {
        return this._max;
    }

    set max(value: string) {
        this._max = value;
    }

    get min(): string {
        return this._min;
    }

    set min(value: string) {
        this._min = value;
    }

    get stack(): boolean {
        return this._stack;
    }

    set stack(value: boolean) {
        this._stack = value;
    }

    get autoResize(): boolean {
        return this._autoResize;
    }

    set autoResize(value: boolean) {
        this._autoResize = value;
    }
}
