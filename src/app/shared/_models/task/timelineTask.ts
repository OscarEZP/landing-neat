import {Task} from "./task";
import {TimeInstant} from "../timeInstant";
import {DateUtil} from "../../util/dateUtil";

export class TimelineTask {

    private static OPEN_ICON = 'lock_open';
    private static CLOSE_ICON = 'lock';
    private static DATE_FORMAT = 'YYYY-MM-DD';

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
    private _subgroup: string;
    private _type: string;

    static getInstance() {
        return new TimelineTask(Task.getInstance(), false, false);
    }

    constructor(task: Task, active: boolean = false, corrected: boolean = false, apply: boolean | null = null) {
        this._task = task;

        this._start = DateUtil.formatDate(this.startDateEpochTime, TimelineTask.DATE_FORMAT);
        this._end = DateUtil.formatDate(this.endDateEpochTime, TimelineTask.DATE_FORMAT);
        this._id = task.id;
        this._content = this.getContent();
        this._active = active;
        this._corrected = corrected;
        this._apply = apply;
        this._className = this.generateClassName();
        this._group = task.barcode;
        this._subgroup = task.barcode;
        this._type = '';
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
        if (this.isOpen && this.extendedDueDate.epochTime !== null) {
            const extra = TimelineTask.getInstance();

            extra.end = DateUtil.formatDate(this.extendedDueDate.epochTime,TimelineTask.DATE_FORMAT);
            extra.start = DateUtil.formatDate(this.dueDate.epochTime,TimelineTask.DATE_FORMAT);
            extra.id = this.id + this.createDate.epochTime;
            extra.group = this.barcode;
            extra.subgroup = this.barcode;
            extra.type = 'background';
            extra.content = extra.getContent(false);
            arr.push(extra);
        }
        return arr;
    }

    public getContent(content: boolean = true): string {
        const head = '<div class="head"><h1>' + 'TASK' + '</h1> <span>' + (this.isOpen ? '<i class="material-icons icon-red">' : '<i class="material-icons">') + this.getContentIcon() + '</i></span> </div>';
        const body = '<p>' + this.task.ata + '/'  + this.task.barcode + '</p>' ;
        return content ? head + body : '';
    }

    private getContentIcon() {
        return this.isClose ? TimelineTask.CLOSE_ICON : TimelineTask.OPEN_ICON ;
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

    set content(value: string) {
        this._content = value;
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

    get subgroup(): string {
        return this._subgroup;
    }

    set subgroup(value: string) {
        this._subgroup = value;
    }

    get type(): string {
        return this._type;
    }

    set type(value: string) {
        this._type = value;
    }

    get isOpen(): boolean{
        return this.task.isOpen;

    }
    get isClose(): boolean{
        return this.task.isClose;

    }
    get endDateEpochTime(): number{

       return this.task.isClose ? this.task.revisionDate.epochTime : this.task.dueDate.epochTime;
    }
    get startDateEpochTime(): number{

        return this.task.createDate.epochTime;
    }

}
