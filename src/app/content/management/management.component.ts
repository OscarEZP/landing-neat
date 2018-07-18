import {AfterViewInit, Component, OnInit} from '@angular/core';
import {LayoutService} from '../../layout/_services/layout.service';
import {TranslateService} from '@ngx-translate/core';
import {RoutingService} from '../../shared/_services/routing.service';

@Component({
    selector: 'lsl-management',
    templateUrl: './management.component.html',
    styleUrls: ['./management.component.scss']
})
export class ManagementComponent implements OnInit, AfterViewInit {

    constructor(
        private _routingService: RoutingService,
        private _translate: TranslateService,
        private _layoutService: LayoutService
    ) {

    }

    ngOnInit() {
        this._translate.setDefaultLang('en');
        this._translate.get('MANAGEMENT.MANAGEMENT_MODULE')
            .toPromise()
            .then(res => {
                    this.moduleTitle = res;
                }
            );
        this.showAddButton = false;
        this.showRightNav = false;
    }

    ngAfterViewInit() {

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
