import {Injectable} from '@angular/core';
import {MatSidenav} from '@angular/material';

@Injectable()
export class SidenavService {

    private _sidenav: MatSidenav;

    set sidenav(value: MatSidenav) {
        this._sidenav = value;
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

}
