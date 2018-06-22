import {Task} from './task';
import {TimeInstant} from '../timeInstant';
import {DateUtil} from '../../util/dateUtil';

export class TimelineTask {

    private static HISTORICAL_ICON = 'assignment';
    private static DATE_FORMAT = 'YYYY-MM-DD';
    public static TASK_DEFAULT_TITLE = 'TASK';

    private static ACTIVE_CLASS = 'active';
    private static FULL_CLASS = 'full';
    private static RELATED_CLASS = 'related';
    private static DONT_APPLY_CLASS = 'dont-apply';
    private static DISABLED_CLASS = 'disabled';
    private static HIDE_CLASS = 'hide';
    private static HIDDEN_ICON_CLASS = 'hidden-icon';

    private static MIN_LABEL_WIDTH = 62;
    private static MIN_ICON_WIDTH = 28;

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
    private _historicalEnabled: boolean;
    private _width: number;

    static getInstance() {
        return new TimelineTask(Task.getInstance(), false, false);
    }

    constructor(task: Task, active: boolean = false, corrected: boolean = false, apply: boolean | null = null) {
        this._task = task;
        this._start = DateUtil.formatDate(this.startDateEpochTime, TimelineTask.DATE_FORMAT);
        this._end = DateUtil.formatDate(this.endDateEpochTime, TimelineTask.DATE_FORMAT);
        this._id = task.id;
        this._active = active;
        this._corrected = corrected;
        this._apply = !apply && this.task.review ? this.task.review.apply : apply;
        this._className = this.generateClassName();
        this._group = task.barcode;
        this._type = '';
        this._content = this.getContent();
        this._historicalEnabled = true;
    }

    public generateClassName(): string {
        const arrStyles = [];
        if (this.active) {
            arrStyles.push(TimelineTask.ACTIVE_CLASS);
            if (this.corrected) {
                arrStyles.push(TimelineTask.FULL_CLASS);
            }
        } else {
            arrStyles.push(this.task.taskType.toLowerCase());
            arrStyles.push(TimelineTask.RELATED_CLASS);
            if (this.apply === true) {
                arrStyles.push(TimelineTask.FULL_CLASS);
            } else if (this.apply === false) {
                arrStyles.push(TimelineTask.DONT_APPLY_CLASS);
            }
            if (!this.historicalEnabled) {
                arrStyles.push(TimelineTask.DISABLED_CLASS);
            }
        }
        if (this.width < TimelineTask.MIN_LABEL_WIDTH) {
            arrStyles.push(TimelineTask.HIDE_CLASS);
        }
        if (this.width < TimelineTask.MIN_ICON_WIDTH) {
            arrStyles.push(TimelineTask.HIDDEN_ICON_CLASS);
        }
        return arrStyles.join(' ');
    }

    public getContent(): string {
        const type = this.task.taskType ? this.task.taskType : TimelineTask.TASK_DEFAULT_TITLE;
        let html = '<h1>' + type.toUpperCase().substr(0, 3) + '</h1>';
        html += this.task.hasHistorical ? '<i class="material-icons">' + TimelineTask.HISTORICAL_ICON + '</i>' : '';
        return html;
    }

    public getJson() {
        this.className = this.generateClassName();
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

    set start(value: string) {
        this._start = value;
    }

    get end(): string {
        return this._end;
    }

    set end(value: string) {
        this._end = value;
    }

    get active(): boolean {
        return this._active;
    }

    set active(value: boolean) {
        this._active = value;
    }

    set task(value: Task) {
        this._task = value;
    }

    set corrected(value: boolean) {
        this._corrected = value;
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

    get apply(): boolean {
        return this._apply;
    }

    set apply(value: boolean) {
        this._apply = value;
    }

    get createDate(): TimeInstant {
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

    get dueDate(): TimeInstant {
        return this.task.dueDate;
    }

    set subgroup(value: string) {
        this._subgroup = value;
    }

    get subgroup(): string {
        return this._subgroup;
    }

    get type(): string {
        return this._type;
    }

    set type(value: string) {
        this._type = value;
    }

    get isOpen(): boolean {
        return this.task.isOpen;

    }
    get isClose(): boolean {
        return this.task.isClose;
    }

    private calculateDateEndTaskNotDeferred(task: Task): number {
        return DateUtil.addTime(task.createDate.epochTime, 1, 'day');
    }

    get endDateEpochTime(): number {
        let endDate: number = null;
        if (this.task.dueDate.epochTime) {
            if (this.task.isClose) {
                endDate = this.task.revisionDate.epochTime;
            } else {
                endDate = this.extendedDueDate.epochTime ? this.extendedDueDate.epochTime : this.dueDate.epochTime;
            }
        } else {
            endDate = this.calculateDateEndTaskNotDeferred(this.task);
        }
        return endDate;
    }

    get startDateEpochTime(): number {
        return this.task.createDate.epochTime;
    }

    get className(): string {
        return this._className;
    }

    set className(value: string) {
        this._className = value;
    }

    get hasHistorical(): boolean {
        return this.task.hasHistorical;
    }

    get historicalEnabled(): boolean {
        return this._historicalEnabled;
    }

    set historicalEnabled(value: boolean) {
        this._historicalEnabled = value;
    }

    get width(): number {
        return this._width;
    }

    set width(value: number) {
        this._width = value;
    }
}
