import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CloseContingencyComponent } from './close-contingency.component';

describe('CloseContingencyComponent', () => {
    let component: CloseContingencyComponent;
    let fixture: ComponentFixture<CloseContingencyComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [CloseContingencyComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(CloseContingencyComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
