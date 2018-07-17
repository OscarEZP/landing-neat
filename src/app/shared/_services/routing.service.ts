import {Injectable} from '@angular/core';
import {Menu} from '../_models/menu';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {Observable} from 'rxjs/Observable';
import {Router} from '@angular/router';

export interface Routing {
    moduleTitle: string;
    arrMenu: Menu[];
    activeMenu: Menu;
}

@Injectable()
export class RoutingService {

    private _routing: BehaviorSubject<Routing>;
    private _routing$: Observable<Routing>;

    constructor(
        private _route: Router,
    ) {
        this._routing = new BehaviorSubject<Routing>({
            moduleTitle: '',
            activeMenu: null,
            arrMenu: [
                new Menu('MENU.OPERATIONS', 'build', '/operations/', false, [
                    new Menu('MENU.CONTINGENCIES', '', '/operations/contingencies', false),
                    new Menu('MENU.PENDINGS', '', '/operations/pendings', false),
                    new Menu('MENU.AOG', '', '/operations/aog', false)
                ]),
                new Menu('MENU.FLEET_HEALTH', 'airplanemode_active', '/fleet-health/', false, [
                    new Menu('MENU.DEFERRALS', '', '/fleet-health/deferrals', false)
                ]),
                new Menu('MENU.MANAGEMENT', 'settings', '/management/', true, [
                    new Menu('MENU.GENERAL', 'person ', '/management/general', false, [
                        new Menu('MENU.USERS', '', '/management/general/users'),
                        new Menu('MENU.RULES', '', '/management/general/rules'),
                    ]),
                    new Menu('MENU.OPERATIONS', 'build', '/management/operations', false, [
                        new Menu('MENU.EMAILS_MANTAINER', '', '/management/operations/emails'),
                    ]),
                    new Menu('MENU.FLEET_HEALTH', 'airplanemode_active', '/management/fleet-health', false, [
                        new Menu('MENU.ATEC', '', '/management/fleet-health/atec')
                    ])
                ]),
                new Menu('MENU.LOG_OUT', 'power_settings_new', '/logout'),
            ]
        });
        this._routing$ = this._routing.asObservable();
    }

    get routing$(): Observable<Routing> {
        return this._routing$;
    }

    private get routing(): Routing {
        return this._routing.getValue();
    }

    set moduleTitle(value: string) {
        this.routing.moduleTitle = value;
    }

    set arrMenu(value: Menu[]) {
        this.routing.arrMenu = value;
    }

}
