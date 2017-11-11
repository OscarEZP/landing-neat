import {BrowserModule} from '@angular/platform-browser';
import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
// Modules
import {AccessModule} from './access/access.module';
import {ContentModule} from './content/content.module';
import {NavigationModule} from './navigation/navigation.module';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
// Components
import {AppComponent} from './app.component';
import {LoginComponent} from './access/login.component/login.component';
import {LayoutComponent} from './content/layout.component/layout.component';
// Services
import {AuthService} from './access/_shared/auth.service';
import {DatetimeService} from "./commons/datatime.service/datetime.service";
import {HttpModule} from "@angular/http";
import {ContingencesComponent} from "./content/operations/contingences.component";
import {MatIconRegistry} from "@angular/material";
import {DataService} from "./commons/data.service/data.service";


export const ROUTES: Routes = [
    {
        path: 'usuario',
        component: LayoutComponent,
        children: [
            {path: 'contingencies', component: ContingencesComponent},
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
    providers: [AuthService, DatetimeService, DataService],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
    bootstrap: [AppComponent]
})
export class AppModule {
    constructor(matIconRegistry: MatIconRegistry) {}
}
