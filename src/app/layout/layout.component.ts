import { Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import { MatSidenav } from '@angular/material';
import { SidenavService } from './_services/sidenav.service';
import { DataService } from '../shared/_services/data.service';
import { Subscription } from 'rxjs/Subscription';
import { ContingencyFormComponent } from '../content/operations/create-contingency/create-contingency.component';
import { DialogService } from '../content/_services/dialog.service';
import { DetailsService } from '../details/_services/details.service';
import {HttpErrorResponse} from '@angular/common/http';
import {MessageService} from '../shared/_services/message.service';
import {TranslateService} from '@ngx-translate/core';
import {StorageService} from '../shared/_services/storage.service';
import {Router} from '@angular/router';
import {AuthService} from '../auth/_services/auth.service';

@Component({
    selector: 'lsl-layout',
    templateUrl: './layout.component.html',
    styleUrls: ['./layout.component.scss']
})
export class LayoutComponent implements OnInit, OnDestroy {
    @ViewChild('sidenav') public sidenav: MatSidenav;
    @ViewChild('details') public details: MatSidenav;
    private _messageDataSubscription: Subscription;
    private _errorDataSubscription: Subscription;
    private _handleErrorSubscription: Subscription;

    public loading: boolean;
    public mode: string;
    public value: number;

    private static SESSION_ERROR = {code: 472, message: 'ERRORS.SESSION'};
    private static BAD_REQUEST_ERROR = {code: 400, message: 'ERRORS.BAD_REQUEST'};
    private static UNAUTHORIZED_ERROR = {code: 401, message: 'ERRORS.UNAUTHORIZED'};
    private static CUSTOM_ERROR = {code: 500, message: ''};
    private static DEFAULT_ERROR = 'ERRORS.DEFAULT';

    constructor(
        private _sidenavService: SidenavService,
        private _detailsService: DetailsService,
        private messageData: DataService,
        private _messageService: MessageService,
        private _translate: TranslateService,
        private _dialogService: DialogService,
        private _storageService: StorageService,
        private _authService: AuthService,
        private _router: Router
    ) {
        this.loading = true;
        this.mode = 'determinate';
        this.value = 100;
    }

    public ngOnInit() {
        this.sidenavService.setSidenav(this.sidenav);
        this.detailsService.sidenav = this.details;
        this._messageDataSubscription = this.messageData
            .currentStringMessage
            .subscribe(message => setTimeout(() => this.activateLoadingBar(message), 0));
        this._errorDataSubscription = this.messageData
            .currentError
            .subscribe(error => {
                if (error) {
                    this.loading = false;
                    this._handleErrorSubscription = this.handleError(error);
                }
            });
    }

    public ngOnDestroy() {
        this._messageDataSubscription.unsubscribe();
        this._errorDataSubscription.unsubscribe();
        if (this._handleErrorSubscription) {
            this._handleErrorSubscription.unsubscribe();
        }
    }

    private handleError(error: HttpErrorResponse): Subscription {
        let subscription: Subscription;
        switch (error.status) {
            case LayoutComponent.SESSION_ERROR.code: {
                this._storageService.removeCurrentUser();
                this._router.navigate([this._authService.getLoginUrl()]);
                this._dialogService.closeAllDialogs();
                subscription = this.showMessage(LayoutComponent.SESSION_ERROR.message);
                break;
            }
            case LayoutComponent.BAD_REQUEST_ERROR.code: {
                subscription = this.showMessage(LayoutComponent.BAD_REQUEST_ERROR.message);
                break;
            }
            case LayoutComponent.UNAUTHORIZED_ERROR.code: {
                subscription = this.showMessage(LayoutComponent.UNAUTHORIZED_ERROR.message);
                break;
            }
            case LayoutComponent.CUSTOM_ERROR.code: {
                if (typeof error.error !== 'undefined' && typeof error.error.message !== 'undefined' && error.error.message !== '') {
                    subscription = this.showMessage(error.error.message);
                }
                break;
            }
            default: {
                subscription = this.showMessage(LayoutComponent.DEFAULT_ERROR);
                break;
            }
        }
        return subscription;
    }

    public showMessage(message: string): Subscription {
        return this._translate.get(message).subscribe((res: string) => {
            this._messageService.openSnackBar(res);
        });
    }

    public activateLoadingBar(message: string) {
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
        this._dialogService.openDialog(ContingencyFormComponent, {
            maxWidth: '100vw',
            width: '100%',
            height: '100%',
            hasBackdrop: false
        });
    }

    get sidenavService(): SidenavService {
        return this._sidenavService;
    }

    get detailsService(): DetailsService {
        return this._detailsService;
    }

}
