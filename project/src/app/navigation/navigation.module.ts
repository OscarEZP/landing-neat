import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {MatSidenavModule} from '@angular/material';
import {MatToolbarModule} from '@angular/material';

import {ToolbarComponent} from './toolbar.component/toolbar.component';
// import { SidenavComponent } from './sidenav.component/sidenav.component';

@NgModule({
  imports: [
    CommonModule,
    MatToolbarModule,
    MatSidenavModule
  ],
  exports: [
    ToolbarComponent,
    // SidenavComponent
  ],
  declarations: [
    ToolbarComponent,
    // SidenavComponent
  ],
})
export class NavigationModule { }
