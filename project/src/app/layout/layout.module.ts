import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';

import {MatSidenavModule} from '@angular/material';
import {MatToolbarModule} from '@angular/material';
import {MatButtonModule} from '@angular/material';

import {ToolbarComponent} from './toolbar.component/toolbar.component';
import {LayoutComponent} from "./layout.component/layout.component";
import {SidenavComponent} from './sidenav.component/sidenav.component';
import {SidenavService} from "./_services/sidenav.service";

// Config
import {ROUTES} from "../../config/routing";

@NgModule({
  imports: [
    CommonModule,
    MatToolbarModule,
    MatSidenavModule,
    RouterModule,
    MatButtonModule
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
  providers:[
    SidenavService
  ]
})
export class LayoutModule { }
