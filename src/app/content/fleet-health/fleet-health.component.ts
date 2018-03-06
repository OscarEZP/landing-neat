import {Component, OnInit} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {RoutingService} from '../../shared/_services/routing.service';

@Component({
    selector: 'lsl-fleet-health',
    templateUrl: '../fleet-health/fleet-health.component.html',
    styleUrls: ['../fleet-health/fleet-health.component.scss']
})

export class FleetHealthComponent implements OnInit {

    constructor(
        private translate: TranslateService,
        private _routingService: RoutingService
    ) {
        this.translate.setDefaultLang('en');
        this._routingService.moduleTitle = 'Fleet Health Module';
    }

    ngOnInit() {
    }
}
