import {CorrectiveAction} from '../detail/correctiveAction';
import {Step} from '../detail/step';
import {Part} from '../detail/part';
import {Task} from '../task';

export class DetailTask {


    private _task: Task;
    private _correctiveActions: CorrectiveAction[];
    private _steps: Step[];
    private _parts: Part[];
    private _report: string;


    private constructor() {
        this._task = Task.getInstance();
        this._correctiveActions = [];
        this._steps = [];
        this._parts = [];
        this._report = '';

    }

    public static getInstance() {
        return new DetailTask();
    }

    get correctiveActions(): CorrectiveAction[] {
        return this._correctiveActions;
    }

    set correctiveActions(value: CorrectiveAction[]) {
        this._correctiveActions = value;
    }

    get steps(): Step[] {
        return this._steps;
    }

    set steps(value: Step[]) {
        this._steps = value;
    }

    get task(): Task {
        return this._task;
    }

    set task(value: Task) {
        this._task = value;
    }

    get parts(): Part[] {
        return this._parts;
    }

    set parts(value: Part[]) {
        this._parts = value ? value.map(v =>
            Object.assign(Part.getInstance(), v)
        ) : [];
    }

    set report(value: string) {
        this._report = value;
    }

    get report(): string {
        return this._report;
    }
}

