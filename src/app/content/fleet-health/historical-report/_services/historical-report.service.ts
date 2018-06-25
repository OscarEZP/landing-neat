import {Task} from '../../../../shared/_models/task/task';
import { Injectable } from '@angular/core';
import {QuillEditorComponent} from 'ngx-quill';
import {TimelineTask} from '../../../../shared/_models/task/timelineTask';
import {Review} from '../../../../shared/_models/task/analysis/review';

@Injectable()
export class HistoricalReportService {

    private _task: Task;
    private _newAta: string;
    private _editorContent: string;
    private _quillEditor: QuillEditorComponent;
    private _isAtaCorrected: boolean;
    private _timelineData: TimelineTask[];
    private _historicalReportRelated: TimelineTask;

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
                    this.timelineData
                        .filter(tl => tl.isHistoricalChildren)
                        .map(tl => new Review(tl.barcode, tl.apply)) :
                    [];
                return new Review(data.barcode, data.apply, children);
            });
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
}
