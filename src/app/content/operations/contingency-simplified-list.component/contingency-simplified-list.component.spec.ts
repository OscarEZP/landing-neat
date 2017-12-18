import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ContingencyListComponent } from './contingency-simplified-list.component';

describe('ContingencyListComponent', () => {
  let component: ContingencyListComponent;
  let fixture: ComponentFixture<ContingencyListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContingencyListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContingencyListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
