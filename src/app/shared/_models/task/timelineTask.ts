import {Task} from './task';
import {DatePipe} from '@angular/common';
import {TimeInstant} from '../timeInstant';

export class TimelineTask {

    private static CLOSE_STATUS = 'COMPLETE';
    private static OPEN_ICON = 'lock_open';
    private static CLOSE_ICON = 'lock';

    private _id: number;
    private _content: string;
    private _start: string;
    private _task: Task;
    private _className: string;
    private _end: string;
    private _active: boolean;
    private _corrected: boolean;
    private _apply: boolean | null;
    private _group: string;

    static getInstance() {
        return new TimelineTask(Task.getInstance(), false, false);
    }

    constructor(task: Task, active: boolean = false, corrected: boolean = false, apply: boolean | null = null) {
        this._task = task;
        const datePipe = new DatePipe('en');
        this._start = datePipe.transform(task.createDate.epochTime, 'yyyy-MM-dd');
        this._end = datePipe.transform(task.dueDate.epochTime, 'yyyy-MM-dd');
        this._id = task.id;
        this._content = this.getContent();
        this._active = active;
        this._corrected = corrected;
        this._apply = apply;
        this._className = this.generateClassName();
    }

    public generateClassName(): string {
        const arrStyles = [];
        if (this.active) {
            arrStyles.push('active');
            if (this.corrected) {
                arrStyles.push('full');
            }
        } else {
            arrStyles.push('related');
            if (this.apply === true) {
                arrStyles.push('full');
            }else if (this.apply === false) {
                arrStyles.push('dont-apply');
            }
        }
        return arrStyles.join(' ');
    }



    public getExtraTime(): TimelineTask[] {
        const arr = [];
        if (this.extendedDueDate.epochTime !== null) {
            const extra = TimelineTask.getInstance();
            const datePipe = new DatePipe('en');
            extra.end = datePipe.transform(this.extendedDueDate.epochTime, 'yyyy-MM-dd');
            extra.start = datePipe.transform(this.dueDate.epochTime, 'yyyy-MM-dd');
            extra.id = this.id + this.createDate.epochTime;
            arr.push(extra);
        }
        return arr;
    }

    private getContent(): string {
        const head = '<div class="head"> <h1>' + 'Deferral' + '</h1><span><i class="material-icons">' + this.getContentIcon() + '</i></span> </div>';
        const body = '<p>' + this._task.ata + '/'  + this._task.barcode + '</p>' ;
        return head + body;
    }

    private getContentIcon() {
        return this._task.status === TimelineTask.CLOSE_STATUS ? TimelineTask.CLOSE_ICON : TimelineTask.OPEN_ICON ;
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

    get end(): string {
        return this._end;
    }

    set end(value: string) {
        this._end = value;
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

    get task(): Task {
        return this._task;
    }

    get barcode(): string {
        return this._task.barcode;
    }

    get corrected(): boolean {
        return this._corrected;
    }

    set corrected(value: boolean) {
        this._corrected = value;
    }

    get apply(): boolean {
        return this._apply;
    }

    set apply(value: boolean) {
        this._apply = value;
    }

    get createDate(): TimeInstant{
        return this.task.createDate;
    }

    get group(): string {
        return this._group;
    }

    set group(value: string) {
        this._group = value;
    }

    get extendedDueDate(): TimeInstant {
        return this.task.extendedDueDate;
    }

    get dueDate(): TimeInstant{
        return this.task.dueDate;
    }
}
