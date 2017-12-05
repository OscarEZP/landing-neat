import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DetailsComponent } from './details.component';
import { SharedModule } from '../shared/shared.module';
import { InformationComponent } from './information/information.component';
import { CommentsComponent } from './comments/comments.component';
import { TimelineComponent } from './timeline/timeline.component';
import { FollowUpComponent } from './follow-up/follow-up.component';
import { DetailsService } from './_services/details.service';
import { ScrollService } from '../shared/_services/scrolling.service';

@NgModule({
    imports: [
        CommonModule,
        SharedModule
    ],
    exports: [
        DetailsComponent,
    ],
    declarations: [
        DetailsComponent,
        InformationComponent,
        CommentsComponent,
        TimelineComponent,
        FollowUpComponent,
    ],
    providers: [
        DetailsService,
        ScrollService
    ]
})
export class DetailsModule {
}