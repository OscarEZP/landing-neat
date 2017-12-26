import { Injectable } from '@angular/core';

@Injectable()
export class InfiniteScrollService {
    private _pageSize: number;
    private _pageSizeOptions: number[];
    private _pageIndex: number;
    private _length: number;
    private _offset: number;
    constructor() {
        this.pageSize = 10;
        this.length = 0;
        this.pageIndex = 0;
        this._pageSizeOptions = [1, 10, 25, 50, 100];
    }

    get offset(): number {
        return this._offset;
    }

    set pageIndex(value: number) {
        this._pageIndex = value;
        this._offset = this.pageIndex * this.pageSize;
    }

    get pageIndex(): number {
        return this._pageIndex;
    }

    get length(): number {
        return this._length;
    }

    set length(value: number) {
        this._length = value;
    }

    get pageSizeOptions(): number[] {
        return this._pageSizeOptions;
    }

    get pageSize(): number {
        return this._pageSize;
    }
    set pageSize(value: number) {
        this._pageSize = value;
    }
}
