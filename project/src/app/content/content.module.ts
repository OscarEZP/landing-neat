import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import {MatToolbarModule} from '@angular/material';
import {MatSidenavModule} from '@angular/material';
import {NavigationModule} from '../navigation/navigation.module';

import { DashboardComponent } from './dashboard.component/dashboard.component';
import { TicketsComponent } from './tickets.component/tickets.component';
import { LayoutComponent } from './layout.component/layout.component';

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
    MatSidenavModule,
    NavigationModule,
    RouterModule.forRoot(ROUTES),
    MatToolbarModule
  ],
  declarations: [ DashboardComponent, TicketsComponent, LayoutComponent],
  bootstrap:[  ]
})
export class ContentModule { }
