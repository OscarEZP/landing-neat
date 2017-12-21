import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RecoverPasswordComponent } from './recover-password.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {SharedModule} from '../../shared/shared.module';
import {HttpModule} from '@angular/http';
import {AppRoutingModule} from '../../app-routing.module';
import {LayoutModule} from '../../layout/layout.module';
import {ContentModule} from '../../content/content.module';
import {LoginComponent} from '../login/login.component';
import {FindAccountComponent} from '../find-account/find-account.component';
import {APP_BASE_HREF} from '@angular/common';
import {RecoverPasswordService} from '../_services/recoverPassword.service';
import {MessageService} from '../../shared/_services/message.service';

describe('RecoverPasswordComponent', () => {
  let component: RecoverPasswordComponent;
  let fixture: ComponentFixture<RecoverPasswordComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        BrowserAnimationsModule,
        SharedModule,
        HttpModule,
        AppRoutingModule,
        LayoutModule,
        ContentModule
      ],
      declarations: [
          LoginComponent,
          FindAccountComponent,
          RecoverPasswordComponent
      ],
      providers: [
          RecoverPasswordService,
          MessageService,
          { provide: APP_BASE_HREF, useValue: '/' }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RecoverPasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
