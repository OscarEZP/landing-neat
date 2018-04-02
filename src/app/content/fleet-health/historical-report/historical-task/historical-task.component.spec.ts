import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HistoricalTaskComponent } from './historical-task.component';

describe('HistoricalTaskComponent', () => {
  let component: HistoricalTaskComponent;
  let fixture: ComponentFixture<HistoricalTaskComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HistoricalTaskComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HistoricalTaskComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
