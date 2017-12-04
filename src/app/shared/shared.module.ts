import { NgModule } from '@angular/core';
import { MaterialModule } from './modules/material.module';
import { CountdownComponent } from './components/countdown.component/countdown.component';
import { TranslateModule } from '@ngx-translate/core';
import { PipesModule } from './_pipes/pipes.module';
import { ScrollTriggerDirective } from './directives/scroll-trigger.directive';

@NgModule({
    declarations: [
        CountdownComponent,
        ScrollTriggerDirective,
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
        ScrollTriggerDirective
    ],
    providers: [

    ]
})

export class SharedModule { }
