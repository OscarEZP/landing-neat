import { Injectable } from '@angular/core';
import { MatSidenav } from '@angular/material';

@Injectable()
export class DetailsService {

    private _sidenav: MatSidenav;
    private _opened: boolean;
    private _active: string;

    public getActive() {
        return this._active;
    }

    public setActive(value) {
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

    public getOpened(): boolean {
        return this._opened;
    }

    public setOpened(value: boolean) {
        this._opened = value;
    }

}
