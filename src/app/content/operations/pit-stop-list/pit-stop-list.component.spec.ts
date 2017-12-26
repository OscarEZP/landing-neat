import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PitStopListComponent } from './pit-stop-list.component';

describe('PitStopListComponent', () => {
  let component: PitStopListComponent;
  let fixture: ComponentFixture<PitStopListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PitStopListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PitStopListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
