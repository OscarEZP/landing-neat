import {Analysis} from "./analysis";

export class TaskReport {

    private _username: string;
    private _report: string;
    private _analysis: Analysis[];


    constructor() {
        this._report = '';
        this._analysis = [];
        this._username='';

    }

    public static getInstance() {
        return new TaskReport();
    }


    get report(): string {
        return this._report;
    }

    set report(value: string) {
        this._report = value;
    }


    get analysis(): Analysis[] {
        return this._analysis;
    }

    set analysis(value: Analysis[]) {
        this._analysis = value;
    }

    get username(): string {
        return this._username;
    }

    set username(value: string) {
        this._username = value;
    }
}

