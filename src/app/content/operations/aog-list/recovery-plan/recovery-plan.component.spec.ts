import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RecoveryPlanComponent } from './recovery-plan.component';

describe('RecoveryPlanComponent', () => {
  let component: RecoveryPlanComponent;
  let fixture: ComponentFixture<RecoveryPlanComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RecoveryPlanComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RecoveryPlanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
