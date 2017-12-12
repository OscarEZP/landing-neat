import {Component, OnInit} from '@angular/core';
import {SidenavService} from '../_services/sidenav.service';
import {StorageService} from '../../shared/_services/storage.service';

@Component({
    selector: 'lsl-sidenav',
    templateUrl: './sidenav.component.html',
    styleUrls: ['./sidenav.component.scss']
})
export class SidenavComponent implements OnInit {

    public user: { username: string, name: string, email: string };
    public arrMenu: { label: string, link: string, icon: string }[];
    public arrFooterMenu: { label: string, link: string, icon: string }[];

    constructor(private sidenavService: SidenavService, private storageService: StorageService) {
        this.user = {username: '', name: '', email: ''};
        this.user.username = storageService.getCurrentUser() ? storageService.getCurrentUser().userName : '';
        this.user.email = storageService.getCurrentUser() ? storageService.getCurrentUser().email: '';
        this.user.name = storageService.getCurrentUser() ?
            storageService.getCurrentUser().firstName + ' ' + storageService.getCurrentUser().lastName :
            '';
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
        this.sidenavService.closeSidenav().then(() => {});
    }

}
