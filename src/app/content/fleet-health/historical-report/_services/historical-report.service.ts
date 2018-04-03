import {Task} from '../../../../shared/_models/task/task';
import { Injectable } from '@angular/core';
import {QuillEditorComponent} from 'ngx-quill';

@Injectable()
export class HistoricalReportService {

    private _task: Task;
    private _newAta: string;
    private _editorContent: string;
    private _quillEditor: QuillEditorComponent;
    private _isAtaCorrected: boolean;

    constructor() {
        this.task = Task.getInstance();
        this.newAta = '';
        this.editorContent = '';
        this.isAtaCorrected = false;
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
        this._editorContent = value;
    }

    get quillEditor(): QuillEditorComponent {
        return this._quillEditor;
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
}
