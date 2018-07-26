import {Task} from '../../../../shared/_models/task/task';
import {Injectable} from '@angular/core';
import {QuillEditorComponent} from 'ngx-quill';
import {TimelineTask} from '../../../../shared/_models/task/timelineTask';
import {Review} from '../../../../shared/_models/task/fleethealth/analysis/review';
import {TimeInstant} from '../../../../shared/_models/timeInstant';
import {DetailTask} from '../../../../shared/_models/task/detail/detailTask';

@Injectable()
export class HistoricalReportService {

    private _task: Task;
    private _newAta: string;
    private _editorContent: string;
    private _quillEditor: QuillEditorComponent;
    private _isAtaCorrected: boolean;
    private _timelineData: TimelineTask[];
    private _historicalReportRelated: TimelineTask;
    private _detailTask: DetailTask;

    constructor() {
        this._task = Task.getInstance();
        this._newAta = '';
        this._editorContent = '';
        this._isAtaCorrected = false;
        this._timelineData = [];
        this._historicalReportRelated = null;
    }

    /**
     * Reviews from timeline data
     * @returns {Review[]}
     */
    get reviews(): Review[] {
        return this.timelineData
            .filter(data => data.active === false && !data.isHistoricalChildren)
            .map(data => {
                const children = this.historicalReportRelated && data.barcode === this.historicalReportRelated.barcode ?
                    this.childrenReviews :
                    [];
                return new Review(data.barcode, data.apply, children);
            });
    }

    /**
     * Get reviews from historical reviews
     * @returns {Review[]}
     */
    get childrenReviews(): Review[] {
        return this.timelineData
            .filter(tl => tl.isHistoricalChildren)
            .map(tl => new Review(tl.barcode, tl.apply));
    }

    /**
     * Get just related tasks from tineline data
     * @returns {Task[]}
     */
    get relatedTasks(): Task[] {
        return this.timelineData
            .filter(data => data.active === false)
            .map(data => data.task);
    }

    /**
     * Get a unparsed TimelineTask from timeline data
     * @returns {TimelineTask}
     */
    get unparsedTask(): TimelineTask {
        return this.timelineData
            .find(data => data.apply === null && data.active === false);
    }

    /**
     * Get just related TimelineTasks with apply true or false
     * @returns {TimelineTask[]}
     */
    get analyzedList(): TimelineTask[] {
        return this.timelineData
            .filter(data => data.apply !== null && data.active === false);
    }

    /**
     * Validation if the task information is displayed (Parts, Step, Description,Actions)
     * @returns {boolean}
     */
    get isDisplayedDetailTask(): boolean {
        return (this.isAtaCorrected || this.isCloseTimeline || this.hasChronic);
    }

    /**
     * Validation which ata is sent to the service
     * @returns {string}
     */
    get validationAta(): string {
        return (this.isCloseTimeline || this.hasChronic) ? this.task.ata : this.newAta;
    }

    /**
     *Validation if the correction option ata is displayed
     * @returns {boolean}
     */
    get isDisplayedCorrectedAta(): boolean {
        return this.isOpenTimeline && !this.hasChronic;
    }

    /**
     *Get date associated to the Detail task
     * @returns {TimeInstant}
     */
    public getDetailTaskDate(): TimeInstant {
        /**
         * Close Task : ResivionDate
         * Open Task without corrective actions : CreateDate
         * Open Task with corrective actions : Action Date associated to the Last corrective actions
         * @type {TimeInstant}
         */
        let detailTaskDate: TimeInstant = TimeInstant.getInstance();
        if (this.detailTask.task.isClose) {
            detailTaskDate = this.detailTask.task.revisionDate;
        } else if (this.detailTask.task.isOpen) {
            if (this.detailTask.correctiveActions.length === 0) {
                detailTaskDate = this.detailTask.task.createDate;
            } else {
                this.detailTask.correctiveActions.sort((r1, r2) => r1.actionDate.epochTime < r2.actionDate.epochTime ? 1 : -1);
                detailTaskDate = this.detailTask.correctiveActions[0].actionDate;
            }
        }
        return detailTaskDate;
    }

    get hasChronic(): boolean {
        return this.task.chronic.hasChronic;
    }

    get isOpenTimeline(): boolean {
        return this.task.timelineStatus === Task.OPEN_STATUS;
    }

    get isCloseTimeline(): boolean {
        return this.task.timelineStatus === Task.CLOSE_STATUS;
    }

    get task(): Task {
        return this._task;
    }

    set task(value: Task) {
        this._task = Object.assign(Task.getInstance(), value);
    }

    get newAta(): string {
        return this._newAta;
    }

    set newAta(value: string) {
        this._newAta = value;
    }

    get editorContent(): string {
        return this._editorContent;
    }

    set editorContent(value: string) {
        this._editorContent = value === null ? '' : value;
    }

    get quillEditor(): QuillEditorComponent {
        return this._quillEditor;
    }

    get qEditorInstance(): any {
        return this._quillEditor.quillEditor;
    }

    set quillEditor(value: QuillEditorComponent) {
        this._quillEditor = value;
    }

    get isAtaCorrected(): boolean {
        return this._isAtaCorrected;
    }

    set isAtaCorrected(value: boolean) {
        this._isAtaCorrected = value;
    }

    get timelineData(): TimelineTask[] {
        return this._timelineData;
    }

    set timelineData(value: TimelineTask[]) {
        this._timelineData = value;
    }

    get historicalReportRelated(): TimelineTask {
        return this._historicalReportRelated;
    }

    set historicalReportRelated(value: TimelineTask) {
        this._historicalReportRelated = value;
    }

    get detailTask(): DetailTask {
        return this._detailTask;
    }

    set detailTask(value: DetailTask) {
        this._detailTask = value;
    }
}
