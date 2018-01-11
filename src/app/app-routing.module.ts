import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { DashboardComponent } from './content/dashboard/dashboard.component';
import { ContingencySimplifiedListComponent } from './content/operations/contingency-simplified-list/contingency-simplified-list.component';
import { LayoutComponent } from './layout/layout.component';
import { AuthGuardService } from './auth/_services/authGuard.service';
import { ContingencyFormComponent } from './content/operations/create-contingency/create-contingency.component';
import { FindAccountComponent } from './auth/find-account/find-account.component';
import { OperationsComponent } from './content/operations/operations.component';
import { RecoverPasswordComponent } from './auth/recover-password/recover-password.component';
import { SimplifiedLayoutComponent } from './simplified-layout/simplified-layout.component';
import {ContingencyListComponent} from './content/operations/contingency-list/contingency-list.component';
import {PitStopListComponent} from './content/operations/pit-stop-list/pit-stop-list.component';

const ROUTES: Routes = [
    {
        path: '',
        component: LayoutComponent,
        children: [
            {
                path: '',
                redirectTo: '/operations/contingencies',
                pathMatch: 'full',
            },
            {
                path: 'dashboard',
                component: DashboardComponent,
                canActivate: [AuthGuardService]
            },
            {
                path: 'operations',
                canActivate: [AuthGuardService],
                component: OperationsComponent,
                children: [
                    {
                        path: '',
                        redirectTo: '/operations/contingencies',
                        pathMatch: 'full',
                    },
                    {
                        path: 'contingencies',
                        component: ContingencyListComponent,
                        canActivate: [AuthGuardService],
                    },
                    {
                        path: 'contingencies/historical',
                        component: ContingencyListComponent,
                        canActivate: [AuthGuardService],
                        data: { historical: true },
                    },
                    {
                        path: 'pit-stop',
                        component: PitStopListComponent,
                        canActivate: [AuthGuardService],
                    },
                    {
                        path: 'pit-stop/historical',
                        component: PitStopListComponent,
                        canActivate: [AuthGuardService],
                        data: { historical: true },
                    },

                ]
            },
            {
                path: 'operations/contingency',
                component: ContingencyFormComponent,
            },
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
        path: 'findAccount',
        component: FindAccountComponent
    },
    {
        path: 'recoverPassword',
        component: RecoverPasswordComponent
    },
    {
        path: 'hemicycle',
        component: SimplifiedLayoutComponent,
        children: [
            {
                path: 'contingencies',
                component: ContingencySimplifiedListComponent
            }
        ]
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
    providers: []
})

export class AppRoutingModule {
}
