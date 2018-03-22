import {Component, OnInit} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {RoutingService} from '../../shared/_services/routing.service';
import {LayoutService} from '../../layout/_services/layout.service';

@Component({
    selector: 'lsl-fleet-health',
    templateUrl: '../fleet-health/fleet-health.component.html',
    styleUrls: ['../fleet-health/fleet-health.component.scss']
})

export class FleetHealthComponent implements OnInit {

    constructor(
        private translate: TranslateService,
        private _routingService: RoutingService,
        private _layoutService: LayoutService,
    ) {
        this.translate.setDefaultLang('en');
        this.moduleTitle = 'Fleet Health Module';
        this.showAddButton = false;
        this.showRightNav = false;
    }

    ngOnInit() {
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
