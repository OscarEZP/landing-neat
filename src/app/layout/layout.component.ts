import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {MatProgressBar, MatSidenav} from '@angular/material';
import { SidenavService } from './_services/sidenav.service';
import { DataService } from '../shared/_services/data.service';
import { Subscription } from 'rxjs/Subscription';
import { DialogService } from '../content/_services/dialog.service';
import { DetailsService } from '../details/_services/details.service';
import {HttpErrorResponse} from '@angular/common/http';
import {MessageService} from '../shared/_services/message.service';
import {TranslateService} from '@ngx-translate/core';
import {StorageService} from '../shared/_services/storage.service';
import {Router} from '@angular/router';
import {AuthService} from '../auth/_services/auth.service';
import {Layout, LayoutService} from './_services/layout.service';
import {Routing, RoutingService} from '../shared/_services/routing.service';

@Component({
    selector: 'lsl-layout',
    templateUrl: './layout.component.html',
    styleUrls: ['./layout.component.scss']
})
export class LayoutComponent implements OnInit, OnDestroy {
    @ViewChild('sidenav') public sidenav: MatSidenav;
    @ViewChild('details') public details: MatSidenav;
    @ViewChild('progressBar') public progressBar: MatProgressBar;

    private static SESSION_ERROR = {code: 472, message: 'ERRORS.SESSION'};
    private static BAD_REQUEST_ERROR = {code: 400, message: 'ERRORS.BAD_REQUEST'};
    private static UNAUTHORIZED_ERROR = {code: 401, message: 'ERRORS.UNAUTHORIZED'};
    private static NOT_FOUND_ERROR = {code: 404, message: 'ERRORS.NOT_FOUND'};
    private static TIMEOUT_ERROR = {code: 408, message: 'ERRORS.TIMEOUT'};
    private static CUSTOM_ERROR = {code: 500, message: ''};
    private static DEFAULT_ERROR = 'ERRORS.DEFAULT';

    private _messageDataSubscription: Subscription;
    private _errorDataSubscription: Subscription;

    private _layoutSubs: Subscription;
    private _layout: Layout;

    private _routingSubs: Subscription;
    private _routing: Routing;

    constructor(
        private _sidenavService: SidenavService,
        private _detailsService: DetailsService,
        private _messageData: DataService,
        private _messageService: MessageService,
        private _translate: TranslateService,
        private _dialogService: DialogService,
        private _storageService: StorageService,
        private _authService: AuthService,
        private _router: Router,
        private _layoutService: LayoutService,
        private _routingService: RoutingService
    ) {
        this._messageDataSubscription = this.getLoadingSubs();
        this._errorDataSubscription = this.getErrorSubs();
        this._layoutSubs = this.getLayoutSubs();
        this._routingSubs = this.getRoutingSubs();
    }

    public ngOnInit() {
        this.leftSidenav = this.sidenav;
        this.detailsSidenav = this.details;
        this.mode = 'determinate';
        this.value = 100;
    }

    public ngOnDestroy() {
        this._messageDataSubscription.unsubscribe();
        this._errorDataSubscription.unsubscribe();
        this._layoutSubs.unsubscribe();
        this._routingSubs.unsubscribe();
    }

    private getRoutingSubs(): Subscription {
        return this._routingService.routing$
            .subscribe(v => {
                this.routing = v;
            });
    }

    private getLayoutSubs(): Subscription {
        return this._layoutService.layout$
            .subscribe(v => {
                this.layout = v;
            });
    }

    private getLoadingSubs(): Subscription {
        return this._messageData
            .currentStringMessage
            .subscribe(message => setTimeout(() => this.activateLoadingBar(message), 0));
    }

    private getErrorSubs(): Subscription {
        return this._messageData
            .currentError
            .subscribe(error => {
                if (error) {
                    this.loading = false;
                    this.handleError(error).catch();
                }
            });
    }

    private handleError(error: HttpErrorResponse): Promise<void> {
        let result: Promise<void>;
        switch (error.status) {
            case LayoutComponent.SESSION_ERROR.code: {
                this._storageService.removeCurrentUser();
                this._router.navigate([this._authService.getLoginUrl()]);
                this._dialogService.closeAllDialogs();
                result = this.showMessage(LayoutComponent.SESSION_ERROR.message);
                break;
            }
            case LayoutComponent.BAD_REQUEST_ERROR.code: {
                result = this.showMessage(LayoutComponent.BAD_REQUEST_ERROR.message);
                break;
            }
            case LayoutComponent.UNAUTHORIZED_ERROR.code: {
                result = this.showMessage(LayoutComponent.UNAUTHORIZED_ERROR.message);
                break;
            }
            case LayoutComponent.NOT_FOUND_ERROR.code: {
                result = this.showMessage(LayoutComponent.NOT_FOUND_ERROR.message);
                break;
            }
            case LayoutComponent.TIMEOUT_ERROR.code: {
                result = this.showMessage(LayoutComponent.TIMEOUT_ERROR.message);
                break;
            }
            case LayoutComponent.CUSTOM_ERROR.code: {
                if (typeof error.error !== 'undefined' && typeof error.error.message !== 'undefined' && error.error.message !== '') {
                    result = this.showMessage(error.error.message);
                }
                break;
            }
            default: {
                result = this.showMessage(LayoutComponent.DEFAULT_ERROR);
                break;
            }
        }
        return result;
    }

    public showMessage(message: string): Promise<void> {
        return this._translate.get(message)
            .toPromise()
            .then(res => this._messageService.openSnackBar(res));
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

    public openCreationForm() {
        // let component: object;
        // switch (this.routing.activeMenu.link) {
        //     case '/operations/aog': component = AogFormComponent; break;
        //     default: component = ContingencyFormComponent; break;
        // }
        this._dialogService.openDialog(this.layout.formComponent, {
            maxWidth: '100vw',
            width: '100%',
            height: '100%',
            hasBackdrop: false
        });
    }

    get detailsSidenav(): MatSidenav {
        return this._detailsService.sidenav;
    }

    set detailsSidenav(value: MatSidenav) {
        this._detailsService.sidenav = value;
    }

    get isDetailsOpen(): boolean {
        return this._detailsService.isOpen;
    }

    set leftSidenav(value: MatSidenav) {
        this._sidenavService.sidenav = value;
    }

    get showRightNav(): boolean {
        return this.layout.showRightNav;
    }

    private get layout(): Layout {
        return this._layout;
    }

    private set layout(value: Layout) {
        this._layout = value;
    }

    get showAddButton() {
        return this.layout.showAddButton;
    }

    get disableAddButton() {
        return this.layout.disableAddButton;
    }

    get loading(): boolean {
        return this.layout.loading;
    }

    set loading(value: boolean) {
        this.layout.loading = value;
    }

    get mode(): 'determinate' | 'indeterminate' | 'buffer' | 'query' {
        return this.progressBar ? this.progressBar.mode : null;
    }

    set mode(value: 'determinate' | 'indeterminate' | 'buffer' | 'query') {
        if (this.progressBar) {
            this.progressBar.mode = value;
        }
    }

    get value(): number {
        return this.progressBar ? this.progressBar.value : null;
    }

    set value(value: number) {
        if (this.progressBar) {
            this.progressBar.value = value;
        }
    }

    get routing(): Routing {
        return this._routing;
    }

    set routing(value: Routing) {
        this._routing = value;
    }
}
