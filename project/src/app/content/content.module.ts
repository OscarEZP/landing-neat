import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
// import { RouterModule, Routes } from '@angular/router';
import {MatToolbarModule} from '@angular/material';
import {MatSidenavModule} from '@angular/material';

import { DashboardComponent } from './dashboard.component/dashboard.component';
import { TicketsComponent } from './tickets.component/tickets.component';

// export const ROUTES: Routes = [
//   {
//     path: 'usuario',
//     component: LayoutComponent,
//     children: [
//       {
//         path: '',
//         redirectTo: 'dashboard',
//         pathMatch: 'full'
//       },
//       { path: 'dashboard', component: DashboardComponent },
//       { path: 'operation', component: DashboardComponent },
//     ]
//   },
// ];

@NgModule({
  imports: [
    CommonModule,
    MatSidenavModule,
    // RouterModule.forRoot(ROUTES),
    MatToolbarModule
  ],
  declarations: [ DashboardComponent, TicketsComponent ],
  bootstrap:[  ]
})
export class ContentModule { }
