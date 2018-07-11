import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AogFormComponent } from './aog-form.component';

describe('AogFormComponent', () => {
  let component: AogFormComponent;
  let fixture: ComponentFixture<AogFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AogFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AogFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
