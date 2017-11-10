import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard.component/dashboard.component';
import { TicketsComponent } from './tickets.component/tickets.component';


@NgModule({
  imports: [
    CommonModule,
  ],
  declarations: [
    DashboardComponent,
    TicketsComponent
  ],
  bootstrap: [

  ]
})
export class ContentModule { }
