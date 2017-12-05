import { Injectable, OnInit } from '@angular/core';
import { ScrollToService, ScrollToConfigOptions } from '@nicky-lenaers/ngx-scroll-to';

@Injectable()
export class ScrollService implements OnInit {

    constructor(private _scrollToService: ScrollToService) {
    }

    ngOnInit() {
    }

    public scrollTo(section: string) {
        const config: ScrollToConfigOptions = {
            target: section,
            duration: 650,
            easing: 'easeInOutQuint',
            offset: -20
        };
        this._scrollToService.scrollTo(config);
    }

}