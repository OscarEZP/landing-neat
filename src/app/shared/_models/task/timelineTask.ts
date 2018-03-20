import {Task} from './task';
import {DatePipe} from '@angular/common';

export class TimelineTask {

    private static OPEN_STATUS = 'OPEN';
    private static OPEN_ICON = 'lock_open';
    private static CLOSE_ICON = 'lock';

    private _id: number;
    private _content: string;
    private _start: string;
    private _task: Task;
    private _className: string;
    private _end: string;
    private _active: boolean;

    constructor(task: Task, active: boolean = false, corrected: boolean = false) {
        this._task = task;
        const datePipe = new DatePipe('en');
        this._start = datePipe.transform(task.createDate.epochTime, 'yyyy-MM-dd');
        this._end = datePipe.transform(task.dueDate.epochTime, 'yyyy-MM-dd');
        this._id = task.id;
        this._content = this.getContent();
        this._active = active;
        this._className = this.active && corrected ? ' active ' : ' related ';
    }

    private getContent(): string {
        const head = '<div class="head"> <h1>' + 'Deferral' + '</h1><span><i class="material-icons">' + this.getContentIcon() + '</i></span> </div>';
        const body = '<p>' + this._task.ata + '/'  + this._task.barcode + '</p>' ;
        return head + body;
    }

    private getContentIcon() {
        return this._task.timelineStatus === TimelineTask.OPEN_STATUS ? TimelineTask.OPEN_ICON : TimelineTask.CLOSE_ICON;
    }

    static getInstance() {
        return new TimelineTask(Task.getInstance());
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

    get active(): boolean {
        return this._active;
    }

    set active(value: boolean) {
        this._active = value;
    }
}
