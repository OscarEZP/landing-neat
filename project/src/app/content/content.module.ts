import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import {MatToolbarModule} from '@angular/material';

import { DashboardComponent } from './dashboard.component/dashboard.component';
import { TicketsComponent } from './tickets.component/tickets.component';
import { LayoutComponent } from './layout.component/layout.component';
import {SidebarComponent} from './sidebar.component/sidebar.component';
import {NavigationModule} from '../navigation/navigation.module';

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
      { path: 'perfil', component: DashboardComponent },
      { path: 'tickets', component: DashboardComponent },
      { path: 'mecanicos', component: DashboardComponent },
      { path: 'faenas', component: DashboardComponent },
    ]
  },
];

@NgModule({
  imports: [
    CommonModule,
    NavigationModule,
    RouterModule.forRoot(ROUTES),
    MatToolbarModule
  ],
  declarations: [ DashboardComponent, TicketsComponent, LayoutComponent, SidebarComponent ],
  bootstrap:[  ]
})
export class ContentModule { }
