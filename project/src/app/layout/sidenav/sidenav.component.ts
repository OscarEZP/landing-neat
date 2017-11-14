import {Component, OnInit} from '@angular/core';

@Component({
    selector: 'lsl-sidenav',
    templateUrl: './sidenav.component.html',
    styleUrls: ['./sidenav.component.scss']
})
export class SidenavComponent implements OnInit {
    private username: String;
    private mail: String;
    private arrMenu: { label: String, link: String, icon: String }[];
    private arrFooterMenu: { label: String, link: String, icon: String }[];

    constructor() {
    }

    ngOnInit() {
        this.username = 'Ignacio Pardo';
        this.mail = 'ignacio.pardo@gmail.com';
        this.arrMenu = [
            {
                'label': 'Dashboard',
                'link': '/dashboard/',
                'icon': 'assessment'
            },
            {
                'label': 'Operations Module',
                'link': '/operations/',
                'icon': 'build'
            },
        ];

        this.arrFooterMenu = [
            {
                'label': 'Log Out',
                'link': '/logout',
                'icon': 'power_settings_new'
            }
        ];

    }

    logOut() {

    }

    navigateTo(page: String) {

    }

}
