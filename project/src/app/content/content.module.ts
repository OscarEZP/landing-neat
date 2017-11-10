import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MatToolbarModule} from '@angular/material';
import {MatSidenavModule} from '@angular/material';

import {DashboardComponent} from './dashboard.component/dashboard.component';

@NgModule({
  imports: [
    CommonModule,
    MatSidenavModule,
    MatToolbarModule
  ],
  declarations: [DashboardComponent],
  bootstrap:[  ]
})
export class ContentModule { }
