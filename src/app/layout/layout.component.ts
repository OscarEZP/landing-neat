import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material';
import { SidenavService } from './_services/sidenav.service';
import { DataService } from '../shared/_services/data.service';
import { Subscription } from 'rxjs/Subscription';
import { ContingencyFormComponent } from '../content/operations/contingency-form/contingency-form.component';
import { DialogService } from '../content/_services/dialog.service';
import { DetailsService } from '../details/_services/details.service';

@Component({
    selector: 'lsl-layout',
    templateUrl: './layout.component.html',
    styleUrls: ['./layout.component.scss']
})
export class LayoutComponent implements OnInit, OnDestroy {
    @ViewChild('sidenav') public sidenav: MatSidenav;
    @ViewChild('details') public details: MatSidenav;
    private _messageDataSubscription: Subscription;
    public loading: boolean;
    public mode: string;
    public value: number;

    constructor(private sidenavService: SidenavService,
                private detailsService: DetailsService,
                private messageData: DataService,
                private dialogService: DialogService) {
        this.sidenavService = sidenavService;
        this.detailsService = detailsService;
        this.loading = true;
        this.mode = 'determinate';
        this.value = 100;
    }

    ngOnInit() {
        this.sidenavService.setSidenav(this.sidenav);
        this.detailsService.setSidenav(this.details);
        // this._messageDataSubscription = this.messageData.currentStringMessage.subscribe(message => this.activateLoadingBar(message));
    }

    ngOnDestroy() {
        // this._messageDataSubscription.unsubscribe();
    }

    activateLoadingBar(message: string) {
        if (message === 'open') {
            this.loading = true;
            this.mode = 'indeterminate';
            this.value = 20;
        } else if (message === 'close') {
            this.loading = false;
            this.mode = 'determinate';
            this.value = 100;
        }
    }

    public openCreationContingency() {
        this.dialogService.openDialog(ContingencyFormComponent, {
            maxWidth: '100vw',
            width: '100%',
            height: '100%',
            hasBackdrop: false
        });
    }
}
