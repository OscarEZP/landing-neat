import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContingencesComponent } from './contingences.component';

describe('ContingencesComponent', () => {
  let component: ContingencesComponent;
  let fixture: ComponentFixture<ContingencesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContingencesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContingencesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
