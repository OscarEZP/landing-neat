import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {EditFieldComponent} from './edit-field.component';
import {CommonModule} from '@angular/common';
import {SharedModule} from '../../../shared/shared.module';
import {MAT_DIALOG_DATA} from '@angular/material';
import {TranslationService} from '../../../shared/_services/translation.service';
import {MessageService} from '../../../shared/_services/message.service';
import {DialogService} from '../../_services/dialog.service';
import {FormControl} from '@angular/forms';

jest.mock('../../../shared/_services/translation.service');
jest.mock('../../../shared/_services/message.service');
jest.mock('../../_services/dialog.service');


describe('EditFieldComponent', () => {
    let component: EditFieldComponent;
    let fixture: ComponentFixture<EditFieldComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                CommonModule,
                SharedModule
            ],
            declarations: [
                EditFieldComponent
            ],
            providers: [
                { provide: MAT_DIALOG_DATA, useValue: {} },
                TranslationService,
                MessageService,
                DialogService
            ]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(EditFieldComponent);
        component = fixture.componentInstance;
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('submit should emit something', () => {
        const type = 'textarea';
        const spy = jest.spyOn(component.submit, 'emit');
        component.type = type;
        component.editFieldForm.addControl(type, new FormControl(''));
        component.submitForm();
        expect(spy).toHaveBeenCalled();
        spy.mockRestore();
        component.editFieldForm.removeControl(type);
    });
});
