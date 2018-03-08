import {Injectable} from '@angular/core';

@Injectable()
export class LayoutService {

    private _showAddButton: boolean;
    private _showRightNav: boolean;

    constructor() {
        this.showAddButton = false;
        this.showRightNav = true;
    }

    get showAddButton(): boolean {
        return this._showAddButton;
    }

    set showAddButton(value: boolean) {
        this._showAddButton = value;
    }

    get showRightNav(): boolean {
        return this._showRightNav;
    }

    set showRightNav(value: boolean) {
        this._showRightNav = value;
    }
}
