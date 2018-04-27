import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmailMaintainerComponent } from './email-maintainer.component';

describe('EmailMaintainerComponent', () => {
  let component: EmailMaintainerComponent;
  let fixture: ComponentFixture<EmailMaintainerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmailMaintainerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmailMaintainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
