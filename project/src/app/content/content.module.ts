import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule, Routes} from '@angular/router';
import {MatIconRegistry, MatSidenavModule, MatToolbarModule} from '@angular/material';

import {DashboardComponent} from './dashboard.component/dashboard.component';
import {TicketsComponent} from './tickets.component/tickets.component';
import {LayoutComponent} from './layout.component/layout.component';
import {NavigationModule} from '../navigation/navigation.module';
import {ContingencesModule} from "./operations/contingences.module";
import {ContingencesComponent} from "./operations/contingences.component";

export const ROUTES: Routes = [
    {
        path: 'usuario',
        component: LayoutComponent,
        children: [
            {
                path: '',
                redirectTo: 'contingencies',
                pathMatch: 'full'
            },
            {path: 'dashboard', component: DashboardComponent},
            {path: 'contingencies', component: ContingencesComponent},
            {path: 'perfil', component: DashboardComponent},
            {path: 'tickets', component: DashboardComponent},
            {path: 'mecanicos', component: DashboardComponent},
            {path: 'faenas', component: DashboardComponent},
        ]
    },
];

@NgModule({
    imports: [
        CommonModule,
        MatSidenavModule,
        NavigationModule,
        RouterModule.forRoot(ROUTES),
        MatToolbarModule,
        ContingencesModule
    ],
    providers : [
        MatIconRegistry
    ],
    declarations: [DashboardComponent, TicketsComponent, LayoutComponent],
    bootstrap: []
})
export class ContentModule {
}
