import { TestBed, async } from '@angular/core/testing';
import { LayoutComponent } from './layout.component';
import {LoginComponent} from "./access/login.component/login.component";
describe('LayoutComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        LayoutComponent,
        LoginComponent
      ],
    }).compileComponents();
  }));
  it('should create the app', async(() => {
    const fixture = TestBed.createComponent(LayoutComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  }));
  /*
  it(`should have as title 'lsl'`, async(() => {
    const fixture = TestBed.createComponent(LayoutComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app.title).toEqual('lsl');
  }));
  it('should render title in a h1 tag', async(() => {
    const fixture = TestBed.createComponent(LayoutComponent);
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('h1').textContent).toContain('Welcome to lsl!');
  }));
  */
});
