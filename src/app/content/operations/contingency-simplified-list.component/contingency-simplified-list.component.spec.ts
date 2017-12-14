import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import {ContingencySimplifiedListComponent} from "./contingency-simplified-list.component";

describe('ContingencySimplifiedListComponent', () => {
  let component: ContingencySimplifiedListComponent;
  let fixture: ComponentFixture<ContingencySimplifiedListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContingencySimplifiedListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContingencySimplifiedListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
