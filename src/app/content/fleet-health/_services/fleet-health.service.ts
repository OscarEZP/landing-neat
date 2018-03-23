import {Task} from '../../../shared/_models/task/task';
import { Injectable } from '@angular/core';

@Injectable()
export class FleetHealthService {

    private _task: Task;
    private _newAta: string;

    constructor() {
        this.task = Task.getInstance();
        this.newAta = '';
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


}
