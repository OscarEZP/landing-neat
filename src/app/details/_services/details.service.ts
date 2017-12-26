import { Injectable, OnInit } from '@angular/core';
import { MatSidenav } from '@angular/material';
import { Contingency } from '../../shared/_models/contingency';
import { DataService } from '../../shared/_services/data.service';
import { ScrollService } from '../../shared/_services/scrolling.service';

@Injectable()
export class DetailsService implements OnInit {

    private _sidenav: MatSidenav;
    private _open: boolean;
    private _active: string;
    private _activeTitle: string;
    private _contingency: Contingency;
    public safetyEvent: string;

    constructor(private _scrollService: ScrollService, private _dataMessage: DataService) {
    }

    ngOnInit() {
        this._dataMessage.currentSelectedContingency.subscribe(message => this._contingency = message);
        this._dataMessage.currentSafeEventMessage.subscribe(message => this.safetyEvent = message);
    }

    public get contingency(): Contingency {
        return this._contingency;
    }

    public set contingency(value: Contingency) {
        this._contingency = value;
        this._dataMessage.changeSelectedContingency(value);
        this._dataMessage.changeSafeEventMessage(value.safetyEvent.code);
    }

    public getActiveTitle(): string {
        return this._activeTitle;
    }

    public getActive() {
        return this._active;
    }

    public setActive(value) {
        switch (value) {
            case 'information':
                this._activeTitle = 'Information';
                break;
            case 'comments':
                this._activeTitle = 'Comments';
                break;
            case 'timeline':
                this._activeTitle = 'Timeline';
                break;
            case 'follow-up':
                this._activeTitle = 'Follow up';
                break;
        }
        this._active = value;
    }

    public setSidenav(sidenav: MatSidenav) {
        this._sidenav = sidenav;
    }

    public openSidenav(): Promise<void> {
        return this._sidenav.open();
    }

    public closeSidenav(): Promise<void> {
        return this._sidenav.close();
    }

    public toggleSidenav(isOpen?: boolean): Promise<void> {
        return this._sidenav.toggle(isOpen);
    }

    public get open(): boolean {
        return this._open;
    }

    public set open(value: boolean) {
        this._open = value;
    }

    public openDetails(section: string = 'information') {
        this.setActive(section);
        if (!this.open) {
            this.openSidenav().then(() => {
                this._scrollService.scrollTo(section);
                this.open = true;
            });
        } else {
            this._scrollService.scrollTo(section);
        }
    }

}
