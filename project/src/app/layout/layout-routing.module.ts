import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { LayoutComponent } from "./layout.component";
import { DashboardComponent } from "../content/dashboard.component/dashboard.component";
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
                        path: 'operation',
                        component: DashboardComponent
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