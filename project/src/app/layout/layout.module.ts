import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { ToolbarComponent } from './toolbar.component/toolbar.component';
import { LayoutComponent } from "./layout.component";
import { SidenavComponent } from './sidenav.component/sidenav.component';
import { DashboardComponent } from "../content/dashboard.component/dashboard.component";
import { SidenavService } from "./_services/sidenav.service";
import { LayoutRoutingModule} from './layout-routing.module';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    LayoutRoutingModule
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
