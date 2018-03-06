import {Injectable} from '@angular/core';

@Injectable()
export class RoutingService {
    private _moduleTitle: string;

    constructor() {
        this._moduleTitle = '';
    }

    get moduleTitle() {
        return this._moduleTitle;
    }

    set moduleTitle(value: string) {
        this._moduleTitle = value;
    }
}
