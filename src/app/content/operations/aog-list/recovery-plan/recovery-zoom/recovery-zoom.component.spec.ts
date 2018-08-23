import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RecoveryZoomComponent } from './recovery-zoom.component';

describe('RecoveryZoomComponent', () => {
  let component: RecoveryZoomComponent;
  let fixture: ComponentFixture<RecoveryZoomComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RecoveryZoomComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RecoveryZoomComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
