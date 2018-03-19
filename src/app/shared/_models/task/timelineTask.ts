import {Task} from './task';
export class TimelineTask {

    private _id: number;
    private _content: string;
    private _start: string;
    private _task: Task;
    private _className: string;

    constructor(id: number, task: Task, start: string) {
        this._id = id;
        this._task = task;
        this._start = start;
        this._content = this.getContent();
        this._className = 'active';
    }

    private getContent(): string {
        const head = '<div class="head"> <h1>' + 'Deferral' + '</h1><span><i class="material-icons">' + this.getContentIcon() + '</i></span> </div>';
        const body = '<p>' + this._task.ata + '/'  + this._task.barcode + '</p>' ;
        return head + body;
    }

    private getContentIcon() {
        return this._task.timelineStatus === 'OPEN' ? 'lock_open' : 'lock';
    }

    static getInstance() {
        return new TimelineTask(0, Task.getInstance(), '');
    }

    public getJson() {
        return JSON.parse(JSON.stringify(this).replace(/\b[_]/g, ''));
    }

    get id(): number {
        return this._id;
    }

    set id(value: number) {
        this._id = value;
    }

    get content(): string {
        return this._content;
    }

    get start(): string {
        return this._start;
    }

    set start(value: string) {
        this._start = value;
    }

    get className(): string {
        return this._className;
    }

    set className(value: string) {
        this._className = value;
    }
}
