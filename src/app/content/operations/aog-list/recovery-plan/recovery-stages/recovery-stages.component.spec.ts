import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RecoveryStagesComponent } from './recovery-stages.component';

describe('RecoveryStagesComponent', () => {
  let component: RecoveryStagesComponent;
  let fixture: ComponentFixture<RecoveryStagesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RecoveryStagesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RecoveryStagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
