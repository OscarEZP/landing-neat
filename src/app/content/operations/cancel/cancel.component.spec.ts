import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {CancelComponent} from './cancel.component';
import {SharedModule} from '../../../shared/shared.module';
import {MatSnackBarModule} from '@angular/material';
import {MAT_SNACK_BAR_DATA} from '@angular/material';
import {MessageService} from '../../../shared/_services/message.service';
import {DialogService} from '../../_services/dialog.service';
import {TranslateService} from '@ngx-translate/core';

describe('CancelComponent', () => {
	let component: CancelComponent;
	let fixture: ComponentFixture<CancelComponent>;
	
	beforeEach(async(() => {
		TestBed.configureTestingModule({
				imports: [
					SharedModule,
					MatSnackBarModule,
				],
				declarations: [
					CancelComponent
				],
				providers: [
					{provide: MAT_SNACK_BAR_DATA, useValue: {}},
					MessageService,
					DialogService,
					TranslateService
				]
			})
			.compileComponents();
	}));
	
	beforeEach(() => {
		fixture = TestBed.createComponent(CancelComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});
	
	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
