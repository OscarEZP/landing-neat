import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchHistoricalComponent } from './search-historical.component';

describe('SearchHistoricalComponent', () => {
  let component: SearchHistoricalComponent;
  let fixture: ComponentFixture<SearchHistoricalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SearchHistoricalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchHistoricalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
