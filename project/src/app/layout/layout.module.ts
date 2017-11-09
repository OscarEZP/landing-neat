import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import {MatSidenavModule} from '@angular/material';
import {MatToolbarModule} from '@angular/material';

import {ToolbarComponent} from './toolbar.component/toolbar.component';
import {LayoutComponent} from "./layout.component/layout.component";
import { SidenavComponent } from './sidenav.component/sidenav.component';
import {DashboardComponent} from "../content/dashboard.component/dashboard.component";
import {SidenavService} from "./_services/sidenav.service";

export const ROUTES: Routes = [
  {
    path: 'usuario',
    component: LayoutComponent,
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      },
      { path: 'dashboard', component: DashboardComponent },
      { path: 'operation', component: DashboardComponent },
    ]
  },
];


@NgModule({
  imports: [
    CommonModule,
    MatToolbarModule,
    MatSidenavModule,
    RouterModule.forRoot(ROUTES),
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
