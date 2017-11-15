import { NgModule } from '@angular/core';
import {
    MatSidenavModule,
    MatToolbarModule,
    MatButtonModule,
    MatCardModule,
    MatTabsModule,
    MatFormFieldModule, 
    MatInputModule,
    MatListModule, 
    MatProgressBarModule, 
    MatIconModule,
    MatDialogModule,
    MatCheckboxModule,
    MatRadioModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule
    


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
        MatInputModule,
        MatListModule,
        MatProgressBarModule,
        MatIconModule,
        MatDialogModule,
        MatCheckboxModule,
        MatRadioModule,
        MatSelectModule,
        MatDatepickerModule,
        MatNativeDateModule,
        FlexLayoutModule

    ],
    exports: [
        MatSidenavModule,
        MatToolbarModule,
        MatButtonModule,
        MatCardModule,
        MatTabsModule,
        MatFormFieldModule,
        MatInputModule,
        MatListModule,
        MatProgressBarModule,
        MatIconModule,
        MatDialogModule,
        MatCheckboxModule,
        MatRadioModule,
        MatSelectModule,
        MatDatepickerModule,
        MatNativeDateModule,
        FlexLayoutModule
    ],

})

export class MaterialModule { }