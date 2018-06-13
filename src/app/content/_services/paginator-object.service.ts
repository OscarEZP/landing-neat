import {Injectable} from '@angular/core';

export class PaginatorObjectService {
    private _pageSize: number;
    private _pageSizeOptions: number[];
    private _pageIndex: number;
    private _length: number;
    private _offset: number;

    constructor(pageIndex: number, pageSize: number, length: number, offset: number, pageSizeOptions: number[]) {
        this._pageIndex = pageIndex;
        this._pageSize = pageSize;
        this._length = length;
        this._offset = offset;
        this._pageSizeOptions = pageSizeOptions;
    }

    static getInstance(): PaginatorObjectService {
        return new PaginatorObjectService(0, 10, 0, 0, [1, 10, 25, 50, 100, 300]);
    }

    get viewedRecords(): number {
        const viewedRecords = this.pageSize * (this.pageIndex + 1);
        return viewedRecords < this.length ? viewedRecords : this.length;
    }

    set offset(value: number) {
        this._offset = value;
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
