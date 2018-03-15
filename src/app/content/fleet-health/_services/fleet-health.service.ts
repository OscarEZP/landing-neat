import {Task} from '../../../shared/_models/task/task';
import { Injectable } from '@angular/core';

@Injectable()
export class FleetHealthService {

    private _task: Task;
    private _newAta: string;

    constructor() {
        this.task = new Task();
        this.newAta = '';
    }

    get task(): Task {
        return this._task;
    }

    set task(value: Task) {
        this._task = value;
    }

    get newAta(): string {
        return this._newAta;
    }

    set newAta(value: string) {
        this._newAta = value;
    }
}
