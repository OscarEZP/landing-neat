import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RecoveryPlanViewComponent } from './recovery-plan-view.component';

describe('RecoveryPlanViewComponent', () => {
  let component: RecoveryPlanViewComponent;
  let fixture: ComponentFixture<RecoveryPlanViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RecoveryPlanViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RecoveryPlanViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
