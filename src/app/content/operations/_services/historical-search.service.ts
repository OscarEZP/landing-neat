import { Injectable } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

@Injectable()
export class HistoricalSearchService {


    private _searchForm: FormGroup;
    private _active: boolean;
    private _fromTS: any;
    private _toTS: any;
    private _fields: any;

    constructor(private fb: FormBuilder) {
        this.active = false;
        this._fields = {};
    }

    public initForm(fields: any) {
        this.fields = fields;
        // this._searchForm = this.fb.group(this._fields);
        this._searchForm = new FormGroup(fields);
    }

    set fields(value: any) {
        this._fields = value;
    }

    public setValidators() {
        Object.keys(this._fields).forEach((field) => {
            this.searchForm.get(field).setValidators([Validators.required]);
        });
    }

    public clearValidators() {
        Object.keys(this._fields).forEach((field) => {
            this.searchForm.get(field).setValidators(null);
        });
    }

    get fromTS(): any {
        return this._searchForm.value.from ? this._searchForm.value.from.getTime() : 0;
    }

    get toTS(): any {
        return this._searchForm.value.to ? this._searchForm.value.to.getTime() : Date.now();
    }

    get tails(): any {
        return this._searchForm.value.tails ? this._searchForm.value.tails : [];
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
