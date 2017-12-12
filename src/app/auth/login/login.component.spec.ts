import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginComponent } from './login.component';
import {SharedModule} from '../../shared/shared.module';
import {AuthService} from '../_services/auth.service';
import {HttpModule} from '@angular/http';
import {StorageService} from '../../shared/_services/storage.service';
import {AppRoutingModule} from '../../app-routing.module';
import {FindAccountComponent} from '../find-account/find-account.component';
import {RecoverPasswordComponent} from '../recover-password/recover-password.component';
import {ContentModule} from '../../content/content.module';
import {LayoutModule} from '../../layout/layout.module';
import {APP_BASE_HREF} from '@angular/common';
import {MessageService} from '../../shared/_services/message.service';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;

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
          AuthService,
          StorageService,
          MessageService,
          { provide: APP_BASE_HREF, useValue: '/' }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
