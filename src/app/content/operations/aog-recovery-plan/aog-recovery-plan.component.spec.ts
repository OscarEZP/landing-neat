import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AogRecoveryPlanComponent } from './aog-recovery-plan.component';

describe('AogRecoveryPlanComponent', () => {
  let component: AogRecoveryPlanComponent;
  let fixture: ComponentFixture<AogRecoveryPlanComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AogRecoveryPlanComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AogRecoveryPlanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
