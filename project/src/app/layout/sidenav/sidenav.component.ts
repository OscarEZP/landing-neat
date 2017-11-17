import {Component, OnInit} from '@angular/core';
import {SidenavService} from '../_services/sidenav.service';
import {AuthService} from "../../auth/_services/auth.service";

@Component({
    selector: 'lsl-sidenav',
    templateUrl: './sidenav.component.html',
    styleUrls: ['./sidenav.component.scss']
})
export class SidenavComponent implements OnInit {

    private user: { username: string, name: string, email: string };
    private arrMenu: { label: string, link: string, icon: string }[];
    private arrFooterMenu: { label: string, link: string, icon: string }[];

    constructor(private sidenavService: SidenavService, private authService: AuthService) {
        this.authService = authService;
        this.user = {username: '', name: '', email: ''};
        this.user.username=this.authService.getCurrentUser().userName;
        this.user.email = authService.getCurrentUser().email;
        this.user.name = authService.getCurrentUser().firstName + " " + this.authService.getCurrentUser().lastName;

    }

    ngOnInit() {

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

    toggleSidenav() {
        this.sidenavService.closeSidenav().then(() => {
        });
    }

}
