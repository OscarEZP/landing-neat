import {Injectable} from '@angular/core';
import {MatSidenav} from '@angular/material';

@Injectable()
export class SidenavService {

    private sidenav: MatSidenav;

    public setSidenav(sidenav: MatSidenav) {
        this.sidenav = sidenav;
    }

    public openSidenav(): Promise<void> {
        return this.sidenav.open();
    }

    public closeSidenav(): Promise<void> {
        return this.sidenav.close();
    }

    public toggleSidenav(isOpen?: boolean): Promise<void> {
        return this.sidenav.toggle(isOpen);
    }

}
