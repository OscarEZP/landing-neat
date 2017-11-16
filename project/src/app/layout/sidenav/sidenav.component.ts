import {Component, OnInit} from '@angular/core';
import {SidenavService} from '../_services/sidenav.service';
import {AuthService} from "../../auth/_services/auth.service";

@Component({
    selector: 'lsl-sidenav',
    templateUrl: './sidenav.component.html',
    styleUrls: ['./sidenav.component.scss']
})
export class SidenavComponent implements OnInit {
    private name: string;
    private username: string
    private email: string;
    private arrMenu: { label: String, link: String, icon: String }[];
    private arrFooterMenu: { label: String, link: String, icon: String }[];

    constructor(private sidenavService: SidenavService, private authService: AuthService) {
        this.authService=authService;
        this.username = authService.getCurrentUser().userName;
        this.name = authService.getCurrentUser().firstName + " " + this.authService.getCurrentUser().lastName;
        this.email= authService.getCurrentUser().email;
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
