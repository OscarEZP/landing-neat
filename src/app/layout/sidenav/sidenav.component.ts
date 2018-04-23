import {Component, OnInit} from '@angular/core';
import {User} from '../../shared/_models/user/user';
import {SidenavService} from '../_services/sidenav.service';
import {StorageService} from '../../shared/_services/storage.service';
import {Menu} from '../../shared/_models/menu';

@Component({
    selector: 'lsl-sidenav',
    templateUrl: './sidenav.component.html',
    styleUrls: ['./sidenav.component.scss']
})
export class SidenavComponent implements OnInit {

    private user: User;
    public userArray: { username: string, name: string, email: string };
    public arrMenu: Menu[];

    constructor(private sidenavService: SidenavService, private _storageService: StorageService) {
        this.userArray = {username: '', name: '', email: ''};
        this.user = this._storageService.getCurrentUser();

        this.userArray.username = this.user.username;
        this.userArray.email = this.user.email;
        this.userArray.name = this.user.firstName + ' ' + this.user.lastName;

    }

    ngOnInit() {
        this.arrMenu = [
            new Menu('Operations', 'build', '', false, [
                new Menu('Contingencies', '', '/operations/contingencies', false),
                new Menu('Pendings', '', '/operations/pendings', false)
            ]),
            new Menu('Fleet Health', 'airplanemode_active', '', false, [
                new Menu('Deferrals', '', '/fleet-health/deferrals', false)
            ]),
            new Menu('Management', 'settings', '', true, [
                new Menu('General', 'person ', '', false, [
                    new Menu('Users'),
                    new Menu('Rules'),
                ]),
                new Menu('Operations', 'build', '', false, [
                    new Menu('Emails Maintainer'),
                    new Menu('Meeting Mails')
                ]),
                new Menu('Fleet Health', 'airplanemode_active', '', false, [
                    new Menu('ATEC')
                ])
            ]),
            new Menu('Log Out', 'power_settings_new', '/logout'),
        ];
    }

    toggleSidenav() {
        this.sidenavService.closeSidenav().then(() => {
        });
    }

}
