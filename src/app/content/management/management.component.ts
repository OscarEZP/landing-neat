import {Component, OnInit} from '@angular/core';
import {RoutingService} from '../../shared/_services/routing.service';
import {LayoutService} from '../../layout/_services/layout.service';
import {TranslateService} from '@ngx-translate/core';

@Component({
    selector: 'lsl-management',
    templateUrl: './management.component.html',
    styleUrls: ['./management.component.scss']
})
export class ManagementComponent implements OnInit {

    public arrMenu: { label: string, link: string }[];

    constructor(
        private _routingService: RoutingService,
        private _translate: TranslateService,
        private _layoutService: LayoutService
    ) {
        this._translate.setDefaultLang('en');
        this.showAddButton = false;
        this.showRightNav = false;
        this.arrMenu = [
            {
                'label': 'MANAGEMENT.USER_MANAGEMENT',
                'link': '/management/user-management',
            }
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
