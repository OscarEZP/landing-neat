import { NgModule } from '@angular/core';
import { UtcDatePipe } from './utcDatePipe.pipe';
import { ObjNgForPipe } from './objNgForPipe.pipe';
import { FilterPipe} from './filter.pipe';


@NgModule({
    imports: [

    ],
    declarations: [
        UtcDatePipe,
        ObjNgForPipe,
        FilterPipe
    ],
    exports: [
        UtcDatePipe,
        ObjNgForPipe,
        FilterPipe
    ]

})

export class PipesModule {
}
