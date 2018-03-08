import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {SharedModule} from '../shared/shared.module';
import {ToolbarComponent} from './toolbar/toolbar.component';
import {LayoutComponent} from './layout.component';
import {SidenavComponent} from './sidenav/sidenav.component';
import {SidenavService} from './_services/sidenav.service';
import {StorageService} from '../shared/_services/storage.service';
import {DetailsModule} from '../details/details.module';
import {RightnavComponent} from './rightnav/rightnav.component';
import {DetailsService} from '../details/_services/details.service';
import {ContingencyFormComponent} from '../content/operations/create-contingency/create-contingency.component';
import {LayoutService} from './_services/layout.service';

@NgModule({
    imports: [
        CommonModule,
        SharedModule,
        RouterModule,
        DetailsModule
    ],
    exports: [
        ToolbarComponent,
        SidenavComponent,
        RightnavComponent
    ],
    declarations: [
        ToolbarComponent,
        LayoutComponent,
        SidenavComponent,
        RightnavComponent
    ],
    providers: [
        SidenavService,
        StorageService,
        DetailsService,
        LayoutService
    ],
    entryComponents: [
        ContingencyFormComponent
    ]
})
export class LayoutModule {
}
