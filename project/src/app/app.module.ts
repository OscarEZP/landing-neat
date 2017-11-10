import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {NgModule, CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';

// Modules
import {AccessModule} from './access/access.module';
import {ContentModule} from './content/content.module';
import {NavigationModule} from './navigation/navigation.module';

// Components
import {AppComponent} from './app.component';
import {LoginComponent} from './access/login.component/login.component';
import {DashboardComponent} from './content/dashboard.component/dashboard.component';
import {LayoutComponent} from './content/layout.component/layout.component';

// Services
import {AuthService} from './access/_shared/auth.service';
import {DatetimeService} from "./commons/datatime.service/datetime.service";
import {HttpModule} from "@angular/http";
import {TimerObservable} from "rxjs/observable/TimerObservable";


export const ROUTES: Routes = [
    {
        path: 'usuario',
        component: LayoutComponent,
        children: [
            {path: 'dashboard', component: DashboardComponent},
        ]
    },
    {path: 'login', component: LoginComponent},
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

@NgModule({
    declarations: [AppComponent],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        AccessModule,
        ContentModule,
        HttpModule,
        NavigationModule,
        RouterModule.forRoot(ROUTES)
    ],
    providers: [AuthService, DatetimeService],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
    bootstrap: [AppComponent]
})
export class AppModule { }
