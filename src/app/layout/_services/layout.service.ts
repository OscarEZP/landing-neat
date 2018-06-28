import {Injectable} from '@angular/core';

@Injectable()
export class LayoutService {

    private _showAddButton: boolean;
    private _showRightNav: boolean;
    private _disableAddButton: boolean;
    private _disableRightNav: boolean;

    constructor() {
        this._showAddButton = false;
        this._showRightNav = true;
        this._disableAddButton = false;
        this._disableRightNav = false;
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


    get disableAddButton(): boolean {
        return this._disableAddButton;
    }

    set disableAddButton(value: boolean) {
        this._disableAddButton = value;
    }

    get disableRightNav(): boolean {
        return this._disableRightNav;
    }

    set disableRightNav(value: boolean) {
        this._disableRightNav = value;
    }
}
