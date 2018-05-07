import {Component, OnInit} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {RoutingService} from '../../../../shared/_services/routing.service';
import {LayoutService} from '../../../../layout/_services/layout.service';
import {Menu} from '../../../../shared/_models/menu';

@Component({
    selector: 'lsl-user-management',
    templateUrl: './user-management.component.html',
    styleUrls: ['./user-management.component.scss']
})
export class UserManagementComponent implements OnInit {

    public arrMenu: Menu[];

    constructor(
        private _routingService: RoutingService,
        private _translate: TranslateService,
        private _layoutService: LayoutService
    ) {
        this._translate.setDefaultLang('en');
        this.showAddButton = false;
        this.showRightNav = false;
        this.arrMenu = [
            new Menu('MANAGEMENT.USER.USER_LIST', '', '/management/general/users/user-list'),
            new Menu('MANAGEMENT.USER.ADD_USER', '', '/management/general/users/add-user'),
            new Menu('MANAGEMENT.USER.BULK_LOAD', '', '/management/general/users/bulk-load')
        ];
    }

    ngOnInit() {
        this._translate.get('MANAGEMENT.MANAGEMENT_MODULE')
            .toPromise()
            .then(res => {
                    this.moduleTitle = res;
                }
            );
    }


    set moduleTitle(value: string) {
        this._routingService.moduleTitle = value;
    }

    set showAddButton(value: boolean) {
        this._layoutService.showAddButton = value;
    }

    set showRightNav(value: boolean) {
        this._layoutService.showRightNav = value;
    }

}
