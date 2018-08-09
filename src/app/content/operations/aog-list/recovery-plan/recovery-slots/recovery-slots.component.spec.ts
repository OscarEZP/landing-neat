import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RecoverySlotsComponent } from './recovery-slots.component';

describe('RecoverySlotsComponent', () => {
  let component: RecoverySlotsComponent;
  let fixture: ComponentFixture<RecoverySlotsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RecoverySlotsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RecoverySlotsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
