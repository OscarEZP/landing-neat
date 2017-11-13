import { NgModule } from '@angular/core';
import {
    MatSidenavModule,
    MatToolbarModule,
    MatButtonModule,
    MatCardModule,
    MatTabsModule,
    MatFormFieldModule,
    MatListModule,
    MatProgressBarModule,
    MatIconModule,
    MatInputModule

} from '@angular/material';
import {FlexLayoutModule} from "@angular/flex-layout";

@NgModule({
    imports: [
        MatSidenavModule,
        MatToolbarModule,
        MatButtonModule,
        MatCardModule,
        MatTabsModule,
        MatFormFieldModule,
        MatListModule,
        MatProgressBarModule,
        MatIconModule,
        MatInputModule,
        FlexLayoutModule

    ],
    exports: [
        MatSidenavModule,
        MatToolbarModule,
        MatButtonModule,
        MatCardModule,
        MatTabsModule,
        MatFormFieldModule,
        MatListModule,
        MatProgressBarModule,
        MatIconModule,
        MatInputModule,
        FlexLayoutModule
    ],

})

export class MaterialModule { }