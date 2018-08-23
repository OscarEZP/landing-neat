import {Injectable} from '@angular/core';
import {MatSidenav} from '@angular/material';
import {ScrollToConfigOptions, ScrollToService} from '@nicky-lenaers/ngx-scroll-to';
import {Subject} from 'rxjs/Subject';
import {Aog} from '../../shared/_models/aog/aog';

@Injectable()
export class DetailsServiceAog {

    private _sidenav: MatSidenav;
    private _activeTitle: string;
    private _selectedAog: Aog;
    private _section: string;
    private _scrollToConfig: ScrollToConfigOptions;

    private _sidenavVisibilityChange: Subject<boolean> = new Subject<boolean>();
    private _selectedAogChange: Subject<Aog> = new Subject<Aog>();

    constructor(
        private _scrollToService: ScrollToService
    ) {
        this.scrollToConfig = {
            target: this.section,
            duration: 650,
            easing: 'easeInOutQuint',
            offset: -20
        };

        this.selectedAog = Aog.getInstance();
        this.activeTitle = 'Follow Up Aog';
    }

    public activeAogChanged(aog: Aog) {
        if (aog.id !== null) {
            this.selectedAogChange.next(aog);
            this.selectedAog = aog;
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
                this.activeTitle = 'Follow up Aog';
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
        return this.sidenav.opened;

    }

     get sidenavVisibilityChange(): Subject<boolean> {
        return this._sidenavVisibilityChange;
    }

    set sidenavVisibilityChange(value: Subject<boolean>) {
        this._sidenavVisibilityChange = value;
    }


    get selectedAog(): Aog {
        return this._selectedAog;
    }

    set selectedAog(value: Aog) {
        this._selectedAog = value;
    }

    get selectedAogChange(): Subject<Aog> {
        return this._selectedAogChange;
    }

    set selectedAogChange(value: Subject<Aog>) {
        this._selectedAogChange = value;
    }
}
