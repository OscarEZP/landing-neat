import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RecoveryRealPlanComponent } from './recovery-real-plan.component';

describe('RecoveryRealPlanComponent', () => {
  let component: RecoveryRealPlanComponent;
  let fixture: ComponentFixture<RecoveryRealPlanComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RecoveryRealPlanComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RecoveryRealPlanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
