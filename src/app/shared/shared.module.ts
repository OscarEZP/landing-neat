import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { PipesModule } from './_pipes/pipes.module';
import { ApiRestService } from './_services/apiRest.service';
import { CountdownComponent } from './components/countdown.component/countdown.component';
import { ScrollTriggerDirective } from './directives/scroll-trigger.directive';
import { MaterialModule } from './modules/material.module';

@NgModule({
    declarations: [
        CountdownComponent,
        ScrollTriggerDirective
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
