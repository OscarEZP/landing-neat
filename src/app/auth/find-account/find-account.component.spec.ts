import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import {HttpModule} from '@angular/http';
import {SharedModule} from '../../shared/shared.module';
import {FindAccountComponent } from './find-account.component';
import {RecoverPasswordService} from '../_services/recoverPassword.service';
import {MessageService} from '../../shared/_services/message.service';
import {StorageService} from '../../shared/_services/storage.service';
import {AppRoutingModule} from '../../app-routing.module';
import {LayoutModule} from '../../layout/layout.module';
import {ContentModule} from '../../content/content.module';
import {LoginComponent} from '../login/login.component';
import {RecoverPasswordComponent} from '../recover-password/recover-password.component';
import {APP_BASE_HREF} from '@angular/common';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

describe('FindAccountComponent', () => {
  let component: FindAccountComponent;
  let fixture: ComponentFixture<FindAccountComponent>;

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
          FindAccountComponent,
          LoginComponent,
          RecoverPasswordComponent
      ],
      providers: [
          RecoverPasswordService,
          MessageService,
          StorageService,
          { provide: APP_BASE_HREF, useValue: '/' }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FindAccountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
