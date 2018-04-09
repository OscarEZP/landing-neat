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
    private _analyzedTask: Task;
    private _timelineData: TimelineTask[];

    constructor() {
        this.task = Task.getInstance();
        this.analyzedTask = Task.getInstance();
        this.newAta = '';
        this.editorContent = '';
        this.isAtaCorrected = false;
        this.timelineData = [];
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

    set analyzedTask(value: Task) {
        this._analyzedTask = value;
    }

    get timelineData(): TimelineTask[] {
        return this._timelineData;
    }

    set timelineData(value: TimelineTask[]) {
        this._timelineData = value;
    }

    get reviews(): Review[] {
        return this.timelineData
            .filter( data => data.active === false)
            .map(data => {
            const review = new Review(data.barcode, data.apply);
            return review;
        });
    }

}
