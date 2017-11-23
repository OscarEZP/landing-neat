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
    MatNativeDateModule,
    MatAutocompleteModule,
    MatSnackBarModule

} from '@angular/material';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

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
        MatAutocompleteModule,
        MatSnackBarModule,
        FlexLayoutModule,
        FormsModule,
        ReactiveFormsModule

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
        MatAutocompleteModule,
        MatSnackBarModule,
        FlexLayoutModule,
        FormsModule,
        ReactiveFormsModule

    ],

})

export class MaterialModule {
}
