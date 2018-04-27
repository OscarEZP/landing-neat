import {Component, OnInit} from '@angular/core';
import {User} from '../../shared/_models/user/user';
import {SidenavService} from '../_services/sidenav.service';
import {StorageService} from '../../shared/_services/storage.service';
import {Menu} from '../../shared/_models/menu';
import {RoutingService} from '../../shared/_services/routing.service';
import {TranslateService} from '@ngx-translate/core';
import {AuthService} from '../../auth/_services/auth.service';

@Component({
    selector: 'lsl-sidenav',
    templateUrl: './sidenav.component.html',
    styleUrls: ['./sidenav.component.scss']
})
export class SidenavComponent implements OnInit {

    private static LOGOUT_ENDPOINT = 'logout';
    private static MANAGEMENT_ENDPOINT = 'management';

    private user: User;
    public userArray: { username: string, name: string, email: string };
    private _arrMenu: Menu[];

    constructor(
        private _translate: TranslateService,
        private _sidenavService: SidenavService,
        private _storageService: StorageService,
        private _routingService: RoutingService,
        private _authService: AuthService
    ) {
        this.userArray = {username: '', name: '', email: ''};
        this.user = this._storageService.getCurrentUser();
        this.userArray.username = this.user.username;
        this.userArray.email = this.user.email;
        this.userArray.name = this.user.firstName + ' ' + this.user.lastName;
    }


    ngOnInit() {
        this.arrMenu = this.filterMenu(this._routingService.arrMenu);
        this.arrMenu.map(menu => this.translateMenu(menu));
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

    /**
     * Translate all labels
     * @param {Menu} menu
     */
    private translateMenu(menu: Menu) {
        this._translate
            .get(menu.label)
            .toPromise()
            .then(res => {
                menu.label = res;
                menu.submenu.map(m => this.translateMenu(m));
            });
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
}
