import {NgModule} from '@angular/core';
import {BlockCopyPasteDirective} from './block-copy-paste.directive';
import {ScrollTriggerDirective} from './scroll-trigger.directive';

@NgModule({
    imports: [

    ],
    declarations: [
        BlockCopyPasteDirective,
        ScrollTriggerDirective
    ],
    exports: [
        BlockCopyPasteDirective,
        ScrollTriggerDirective
    ]

})

export class DirectivesModule {
}
