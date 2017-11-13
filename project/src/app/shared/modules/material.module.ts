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
        MatInputModule
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
        MatInputModule
    ],

})

export class MaterialModule { }