import { NgModule } from '@angular/core';
import { MaterialModule } from './modules/material.module';
import { CountdownComponent } from './components/countdown.component/countdown.component';
import { TranslateModule } from '@ngx-translate/core';
import { PipesModule } from './_pipes/pipes.module';
import { CountdownComponent } from './components/countdown.component/countdown.component';
import { MaterialModule } from './modules/material.module';

@NgModule({
    declarations: [
        CountdownComponent
    ],
    imports: [
        MaterialModule,
        PipesModule,
        TranslateModule.forRoot()
    ],
    exports: [
        MaterialModule,
        PipesModule,
        CountdownComponent,
        TranslateModule,
    ],
    providers: [
    ]
})

export class SharedModule { }
