import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { PipesModule } from './_pipes/pipes.module';
import { CustomInterceptor } from './_services/apiRest.service';
import { CountdownComponent } from './components/countdown.component/countdown.component';
import { MaterialModule } from './modules/material.module';
import { EssComponent } from './components/ess/ess.component';
import { DirectivesModule } from './_directives/directives.module';
import {DragulaModule} from 'ng2-dragula';

@NgModule({
    declarations: [
        CountdownComponent,
        EssComponent
    ],
    imports: [
        MaterialModule,
        PipesModule,
        TranslateModule.forRoot(),
        DirectivesModule,
        DragulaModule
    ],
    exports: [
        MaterialModule,
        PipesModule,
        CountdownComponent,
        TranslateModule,
        EssComponent,
        DirectivesModule,
        DragulaModule
    ],
    providers: [
        {
            provide: HTTP_INTERCEPTORS,
            useClass: CustomInterceptor,
            multi: true
        },
    ]
})

export class SharedModule { }
