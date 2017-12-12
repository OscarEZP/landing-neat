import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SimplifiedLayoutComponent } from './simplified-layout.component';

describe('SimplifiedLayoutComponent', () => {
  let component: SimplifiedLayoutComponent;
  let fixture: ComponentFixture<SimplifiedLayoutComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SimplifiedLayoutComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SimplifiedLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
