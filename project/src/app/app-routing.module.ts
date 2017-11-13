import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {LoginComponent} from './auth/login.component/login.component';
import {DashboardComponent} from './content/dashboard.component/dashboard.component';
import {LayoutComponent} from './layout/layout.component';
import {AuthGuardService} from "./auth/_services/authGuard.service";

const ROUTES: Routes = [
    {
        path: '',
        component: LayoutComponent,
        children: [
            {
                path: '',
                redirectTo: '/dashboard',
                pathMatch: 'full',
            },
            {
                path: 'dashboard',
                component: DashboardComponent,
                canActivate: [AuthGuardService]
            },
            {
                path: 'operations',
                redirectTo: '/operations/contingencies',
                pathMatch: 'full',
                canActivate: [AuthGuardService]
            },
            {
                path: 'operations/contingencies',
                component: DashboardComponent,
                canActivate: [AuthGuardService]
            }
        ],
        canActivate: [AuthGuardService]
    },
    {
        path: 'login',
        component: LoginComponent
    },
    {
        path: 'logout',
        component: LoginComponent,
        data: { logout: true }
    },
    {
        path: '**',
        redirectTo: '/login',
        pathMatch: 'full'
    }
];


@NgModule({
    imports: [
        RouterModule.forRoot(ROUTES)
    ],
    exports: [
        RouterModule
    ],
    providers: [

    ]
})

export class AppRoutingModule { }