import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {SharedModule} from '../shared/shared.module';

import {ToolbarComponent} from './toolbar/toolbar.component';
import {LayoutComponent} from "./layout.component";
import {SidenavComponent} from './sidenav/sidenav.component';

import {SidenavService} from "./_services/sidenav.service";

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    RouterModule
  ],
  exports: [
    ToolbarComponent,
    SidenavComponent
  ],
  declarations: [
    ToolbarComponent,
    LayoutComponent,
    SidenavComponent
  ],
  providers: [
    SidenavService
  ]
})
export class LayoutModule { }
