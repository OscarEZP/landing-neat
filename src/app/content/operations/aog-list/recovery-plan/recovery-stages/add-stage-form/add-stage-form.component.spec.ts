import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import {AddStageFormComponent} from './add-stage-form.component';


describe('RecoveryGroupFormComponent', () => {
  let component: AddStageFormComponent;
  let fixture: ComponentFixture<AddStageFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddStageFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddStageFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
