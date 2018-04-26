import {Injectable} from '@angular/core';
import {Menu} from '../_models/menu';

@Injectable()
export class RoutingService {
    private _moduleTitle: string;
    private _arrMenu: Menu[];

    constructor() {
        this._moduleTitle = '';
        this.arrMenu = [
            new Menu('MENU.OPERATIONS', 'build', '/operations/', false, [
                new Menu('MENU.CONTINGENCIES', '', '/operations/contingencies', false),
                new Menu('MENU.PENDINGS', '', '/operations/pendings', false)
            ]),
            new Menu('MENU.FLEET_HEALTH', 'airplanemode_active', '/fleet-health/', false, [
                new Menu('MENU.DEFERRALS', '', '/fleet-health/deferrals', false)
            ]),
            new Menu('MENU.MANAGEMENT', 'settings', '/management/', true, [
                new Menu('MENU.GENERAL', 'person ', '', false, [
                    new Menu('MENU.USERS', '', '/management/general/users'),
                    new Menu('MENU.RULES'),
                ]),
                new Menu('MENU.OPERATIONS', 'build', '', false, [
                    new Menu('MENU.EMAILS_MANTAINER'),
                ]),
                new Menu('MENU.FLEET_HEALTH', 'airplanemode_active', '', false, [
                    new Menu('MENU.ATEC')
                ])
            ]),
            new Menu('MENU.LOG_OUT', 'power_settings_new', '/logout'),
        ];
    }

    get moduleTitle() {
        return this._moduleTitle;
    }

    set moduleTitle(value: string) {
        this._moduleTitle = value;
    }

    get arrMenu(): Menu[] {
        return this._arrMenu;
    }

    set arrMenu(value: Menu[]) {
        this._arrMenu = value;
    }
}
