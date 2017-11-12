import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { LayoutComponent } from "./layout.component";
import { DashboardComponent } from "../content/dashboard.component/dashboard.component";
import {OperationsComponent} from "../content/operations/operations.component";
@NgModule({
    imports: [
        RouterModule.forRoot([
            {
                path: 'usuario',
                component: LayoutComponent,
                children: [
                    {
                        path: '',
                        redirectTo: 'dashboard',
                        pathMatch: 'full'
                    },
                    {
                        path: 'dashboard',
                        component: DashboardComponent
                    },
                    {
                        path: 'operations',
                        component: OperationsComponent
                    }
                ]
            }
        ])
    ],
    exports:[
        RouterModule
    ]

})

export class LayoutRoutingModule { }