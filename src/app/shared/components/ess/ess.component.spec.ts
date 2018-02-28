import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EssComponent } from './ess.component';

describe('EssComponent', () => {
  let component: EssComponent;
  let fixture: ComponentFixture<EssComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EssComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EssComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
