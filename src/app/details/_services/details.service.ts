import { Injectable } from '@angular/core';
import { MatSidenav } from '@angular/material';
import { ScrollToConfigOptions, ScrollToService } from '@nicky-lenaers/ngx-scroll-to';
import { Subject } from 'rxjs/Subject';
import { Aircraft } from '../../shared/_models/aircraft';
import { Backup } from '../../shared/_models/backup';
import { Contingency } from '../../shared/_models/contingency/contingency';
import { Flight } from '../../shared/_models/flight';
import { Interval } from '../../shared/_models/interval';
import { Safety } from '../../shared/_models/safety';
import { Status } from '../../shared/_models/status';
import { TimeInstant } from '../../shared/_models/timeInstant';
import { DataService } from '../../shared/_services/data.service';

@Injectable()
export class DetailsService {

    private _sidenav: MatSidenav;
    private _activeTitle: string;
    private _selectedContingency: Contingency;
    private _section: string;
    private _scrollToConfig: ScrollToConfigOptions;
    private _isOpen: boolean;

    private _sidenavVisibilityChange: Subject<boolean> = new Subject<boolean>();
    private _selectedContingencyChange: Subject<Contingency> = new Subject<Contingency>();

    constructor(private _dataMessage: DataService, private _scrollToService: ScrollToService) {
        this.scrollToConfig = {
            target: this.section,
            duration: 650,
            easing: 'easeInOutQuint',
            offset: -20
        };

        this.selectedContingency = new Contingency(null, new Aircraft(null, null, null), null, new TimeInstant(null, null), null, new Flight(null, null, null, new TimeInstant(null, null)), null, false, false, new Backup(null, new TimeInstant(null, null)), null, new Safety(null, null), new Status(null, null, null, new TimeInstant(null, null), null, new Interval(null, null), new Interval(null, null), null), null, null, 0,false);

        this.isOpen = false;
        this.activeTitle = 'Follow Up';

        this.sidenavVisibilityChange.subscribe((value: boolean) => {
            this.isOpen = value;
        });
    }

    get sidenav(): MatSidenav {
        return this._sidenav;
    }

    set sidenav(value: MatSidenav) {
        this._sidenav = value;
    }

    get activeTitle(): string {
        return this._activeTitle;
    }

    set activeTitle(value: string) {
        this._activeTitle = value;
    }

    get selectedContingency(): Contingency {
        return this._selectedContingency;
    }

    set selectedContingency(value: Contingency) {
        this._selectedContingency = value;
    }

    get section(): string {
        return this._section;
    }

    set section(value: string) {
        this._section = value;
        this.setActiveTitle(value);
    }

    get scrollToConfig(): ScrollToConfigOptions {
        return this._scrollToConfig;
    }

    set scrollToConfig(value: ScrollToConfigOptions) {
        this._scrollToConfig = value;
    }

    get isOpen(): boolean {
        return this._isOpen;
    }

    set isOpen(value: boolean) {
        this._isOpen = value;
    }

    get sidenavVisibilityChange(): Subject<boolean> {
        return this._sidenavVisibilityChange;
    }

    set sidenavVisibilityChange(value: Subject<boolean>) {
        this._sidenavVisibilityChange = value;
    }

    get selectedContingencyChange(): Subject<Contingency> {
        return this._selectedContingencyChange;
    }

    set selectedContingencyChange(value: Subject<Contingency>) {
        this._selectedContingencyChange = value;
    }

    public activeContingencyChanged(contingency: Contingency) {
        if (contingency.id !== null) {
            this.selectedContingencyChange.next(contingency);
            this.selectedContingency = contingency;
        }
    }

    /**
     * Set the active title from section selected
     * @param value
     */
    private setActiveTitle(value) {
        switch (value) {
            case 'information':
                this.activeTitle = 'Information';
                break;
            case 'comments':
                this.activeTitle = 'Comments';
                break;
            case 'timeline':
                this.activeTitle = 'Timeline';
                break;
            case 'follow-up':
                this.activeTitle = 'Follow up';
                break;
        }
    }

    /**
     * Open sidenav
     * @return {Promise<void>}
     */
    public openSidenav(): Promise<void> {
        this.sidenavVisibilityChange.next(true);
        return this.sidenav.open();
    }

    /**
     * Close sidenav
     * @return {Promise<void>}
     */
    public closeSidenav(): Promise<any> {
        this.sidenavVisibilityChange.next(false);
        return this.sidenav.close();
    }

    /**
     *
     * @param {string} section
     */
    public openDetails(section: string = 'information') {
        this.section = section;
        if (!this.sidenav.opened) {
            this.openSidenav().then(() => {
                this._scrollToService.scrollTo(this.scrollToConfig);
            });
        }
    }

}
