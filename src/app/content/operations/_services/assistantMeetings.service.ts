import { Injectable } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

@Injectable()
export class AssistantMeetingsService {
    private _searchForm: FormGroup;
    private _active: boolean;
    private _fields: any;

    constructor() {
        this.active = false;
        this._fields = {};
    }

    public initForm(fields: any) {
        this.fields = fields;
        this.searchForm = new FormGroup(fields);
    }

    set fields(value: any) {
        this._fields = value;
    }

    get fields(): any {
        return this._fields;
    }



    get mails(): any {
        return this.searchForm.value.mails ? this.searchForm.value.mails : [];
    }

    set searchForm(value){
        this._searchForm = value;
    }

    get searchForm(): FormGroup {
        return this._searchForm;
    }

    get active(): boolean {
        return this._active;
    }

    set active(value: boolean) {
        this._active = value;
    }

}

