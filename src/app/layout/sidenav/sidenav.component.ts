import {Component, OnInit} from '@angular/core';
import { User } from '../../shared/_models/user/user';
import {SidenavService} from '../_services/sidenav.service';
import {StorageService} from '../../shared/_services/storage.service';

@Component({
    selector: 'lsl-sidenav',
    templateUrl: './sidenav.component.html',
    styleUrls: ['./sidenav.component.scss']
})
export class SidenavComponent implements OnInit {

    private user: User;
    public userArray: { username: string, name: string, email: string };
    public arrMenu: { label: string, link: string, icon: string }[];

    constructor(private sidenavService: SidenavService, private _storageService: StorageService) {
        this.userArray = {username: '', name: '', email: ''};
        this.user = this._storageService.getCurrentUser();

        this.userArray.username = this.user.username;
        this.userArray.email = this.user.email;
        this.userArray.name = this.user.firstName + ' ' + this.user.lastName;

    }

    ngOnInit() {
        this.arrMenu = [
            /*{
                'label': 'Dashboard',
                'link': '/dashboard/',
                'icon': 'assessment'
            },*/
            {
               'label': 'Management',
               'link': '/management/',
               'icon': 'settings'
            },
            {
                'label': 'Operations Module',
                'link': '/operations/',
                'icon': 'build'
            },
            {
                'label': 'Fleet Health Module',
                'link': '/fleet-health/',
                'icon': 'airplanemode_active'
            },
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
