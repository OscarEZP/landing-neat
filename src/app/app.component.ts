import {Component} from '@angular/core';
import {environment} from '../environments/environment';

@Component({
    selector: 'lsl-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],

})
export class AppComponent {

    constructor(
    ) {
        if (environment.hotjarConfig.enabled) {
            this.initHotJar();
        }
    }

    public initHotJar() {
        const h = window;
        const o = document;
        const t = `//static.hotjar.com/c/hotjar-`;
        const j = `.js?sv=`;
        let a;
        let r;
        h['hj'] = h['hj'] || function () {
            (h['hj'].q = h['hj'].q || []).push(arguments);
        };
        h['_hjSettings'] = {hjid: environment.hotjarConfig.id, hjsv: 6};
        a = o.getElementsByTagName('head')[0];
        r = o.createElement('script');
        r.async = 1;
        r.src = t + h['_hjSettings'].hjid + j + h['_hjSettings'].hjsv;
        a.appendChild(r);
    }
}


