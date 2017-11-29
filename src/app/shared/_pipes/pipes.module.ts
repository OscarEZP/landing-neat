import { NgModule } from '@angular/core';
import { UtcDatePipe } from './utcDatePipe.pipe';
import { ObjNgForPipe } from './objNgForPipe.pipe';


@NgModule({
    imports: [

    ],
    declarations: [
        UtcDatePipe,
        ObjNgForPipe
    ],
    exports: [
        UtcDatePipe,
        ObjNgForPipe
    ]

})

export class PipesModule {
}
