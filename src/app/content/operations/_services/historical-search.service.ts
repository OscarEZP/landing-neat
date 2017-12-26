import { Injectable } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

@Injectable()
export class HistoricalSearchService {

    private _searchForm: FormGroup;
    private _active: boolean;
    private _fromTS: any;
    private _toTS: any;

    constructor(private fb: FormBuilder) {
        this.active = false;
        this._searchForm = this.fb.group({
            'tails': [null, Validators.required],
            'from': [null, Validators.required],
            'to': [null, Validators.required]
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
