import { NgModule } from '@angular/core';
import { UtcDatePipe } from './utcDatePipe.pipe';
import { ObjNgForPipe } from './objNgForPipe.pipe';
import { FilterPipe} from './filter.pipe';
import { EscapeHtmlPipe } from './keepHtml.pipe';


@NgModule({
    imports: [

    ],
    declarations: [
        UtcDatePipe,
        ObjNgForPipe,
        FilterPipe,
        EscapeHtmlPipe
    ],
    exports: [
        UtcDatePipe,
        ObjNgForPipe,
        FilterPipe,
        EscapeHtmlPipe
    ]

})

export class PipesModule {
}
