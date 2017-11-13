import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContingenceListComponent } from './contingenceList.component';

describe('ContingenceListComponent', () => {
  let component: ContingenceListComponent;
  let fixture: ComponentFixture<ContingenceListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContingenceListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContingenceListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
