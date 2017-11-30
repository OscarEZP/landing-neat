import { NgModule } from '@angular/core';
import { MaterialModule } from './modules/material.module';
import {CountdownComponent} from './components/countdown.component/countdown.component';
import {TranslateModule} from '@ngx-translate/core';

@NgModule({
    declarations: [
        CountdownComponent,
    ],
    imports: [
        MaterialModule,
        TranslateModule.forRoot()
    ],
    exports: [
        MaterialModule,
        CountdownComponent,
        TranslateModule
    ],
    providers: [

    ]
})

export class SharedModule { }
