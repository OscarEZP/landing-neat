import {Component, OnDestroy, OnInit} from '@angular/core';
import {User} from '../../shared/_models/user/user';
import {SidenavService} from '../_services/sidenav.service';
import {StorageService} from '../../shared/_services/storage.service';
import {Menu} from '../../shared/_models/menu';
import {Routing, RoutingService} from '../../shared/_services/routing.service';
import {TranslateService} from '@ngx-translate/core';
import {AuthService} from '../../auth/_services/auth.service';
import {Subscription} from 'rxjs/Subscription';

@Component({
    selector: 'lsl-sidenav',
    templateUrl: './sidenav.component.html',
    styleUrls: ['./sidenav.component.scss']
})
export class SidenavComponent implements OnInit, OnDestroy {

    private static LOGOUT_ENDPOINT = 'logout';
    private static MANAGEMENT_ENDPOINT = 'management';

    private _user: User;
    private _userArray: { username: string, name: string, email: string };
    private _arrMenu: Menu[];

    private _routingSubs: Subscription;
    private _routing: Routing;

    constructor(
        private _translate: TranslateService,
        private _sidenavService: SidenavService,
        private _storageService: StorageService,
        private _routingService: RoutingService,
        private _authService: AuthService
    ) {
        this._userArray = {username: '', name: '', email: ''};
        this._user = this._storageService.getCurrentUser();
        this._userArray.username = this._user.username;
        this._userArray.email = this._user.email;
        this._userArray.name = this._user.firstName + ' ' + this._user.lastName;
        this._routingSubs = this.getRoutingSubs();
    }

    ngOnInit() {
        this.arrMenu = this.filterMenu(this.routing.arrMenu);
    }

    ngOnDestroy() {
        this._routingSubs.unsubscribe();
    }

    private getRoutingSubs(): Subscription {
        return this._routingService.routing$
            .subscribe(v => this.routing = v);
    }

    /**
     * Filter for get just enabled sections
     * @param {Menu[]} arrMenu
     * @returns {Menu[]}
     */
    private filterMenu (arrMenu: Menu[]): Menu[] {
        return arrMenu
            .filter(menu =>
                this._authService.getIsAuth(menu.link   ) ||
                menu.slug === SidenavComponent.MANAGEMENT_ENDPOINT ||
                menu.slug === SidenavComponent.LOGOUT_ENDPOINT
            ).map(menu => {
            menu.submenu = menu.submenu.filter(submenu => this._authService.getIsAuth(submenu.link));
            return menu;
        }).filter(menu => !(menu.slug === SidenavComponent.MANAGEMENT_ENDPOINT && menu.submenu.length === 0));
    }

    toggleSidenav() {
        this._sidenavService.closeSidenav().then();
    }

    get arrMenu() {
        return this._arrMenu;
    }

    set arrMenu(value: Menu[]) {
        this._arrMenu = value;
    }

    get routing(): Routing {
        return this._routing;
    }

    set routing(value: Routing) {
        this._routing = value;
    }

    get userArray(): { username: string; name: string; email: string } {
        return this._userArray;
    }

    set userArray(value: { username: string; name: string; email: string }) {
        this._userArray = value;
    }
}
