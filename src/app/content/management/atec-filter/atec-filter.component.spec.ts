import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AtecFilterComponent } from './atec-filter.component';

describe('AtecFilterComponent', () => {
  let component: AtecFilterComponent;
  let fixture: ComponentFixture<AtecFilterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AtecFilterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AtecFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
