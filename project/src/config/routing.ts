import {Routes} from '@angular/router';

import {LayoutComponent} from "../app/layout/layout.component/layout.component";
import {DashboardComponent} from "../app/content/dashboard.component/dashboard.component";
import {LoginComponent} from "../app/auth/login.component/login.component";

import {AuthGuardService} from "../app/auth/_services/authGuard.service";
import {ToolbarComponent} from "../app/layout/toolbar.component/toolbar.component";

export const ROUTES: Routes = [
    {
        path: '',
        component: LayoutComponent,
        children: [
            {
                path: '',
                redirectTo: 'dashboard',
                pathMatch: 'full',
            },
            {
                path: 'dashboard',
                component: DashboardComponent,
                canActivate: [AuthGuardService]
            },
            {
                path: 'operations',
                redirectTo: 'operations/contingencies',
                pathMatch: 'full',
            },
            {
                path: 'operations/contingencies',
                component: ToolbarComponent,
                canActivate: [AuthGuardService]
            }
        ],
        canActivate: [AuthGuardService]
    },
    { path: 'login', component: LoginComponent },
    {
        path: '',
        redirectTo: '/login',
        pathMatch: 'full'
    },
    {
        path: '**',
        redirectTo: '/login',
        pathMatch: 'full'
    }
];