import {Component, OnDestroy, OnInit} from '@angular/core';
import {MatSliderChange} from '@angular/material';
import {RecoveryPlanInterface, RecoveryPlanService} from '../_services/recovery-plan.service';
import {Subscription} from 'rxjs/Subscription';

@Component({
    selector: 'lsl-recovery-zoom',
    templateUrl: './recovery-zoom.component.html',
    styleUrls: ['./recovery-zoom.component.css']
})
export class RecoveryZoomComponent implements OnInit, OnDestroy {

    private _steps: number;
    private _value: number;
    private _valueInHours: number;
    private _recoveryPlanSubscription: Subscription;
    private _recoveryPlanInterface: RecoveryPlanInterface;

    constructor(private _recoveryPlanService: RecoveryPlanService) {
        this._steps = 33;
        this._value = 0;
        this._valueInHours = 24;
    }

    ngOnInit() {
        this.recoveryPlanSubscription = this._recoveryPlanService.recoveryPlanBehavior$.subscribe(x => {
            this.recoveryPlanInterface = x;
        });

        this.initZoomValue();
    }

    ngOnDestroy() {
        this.recoveryPlanSubscription.unsubscribe();
    }

    /**
     * Allows to retrieve the degree of the pow to set the correct position of range slider
     */
    private initZoomValue(): void {
        this.value = Math.log2(this.valueInHours / 24) * 33;
    }

    /**
     * Function to send the new calculated value of zoom time to the service
     * @param message the message object of the MatSlider
     */
    public zoomValueAsChanged(message: MatSliderChange): void {
        const calculatedZoomValue = Math.pow(2, (message.value / 33));
        this._recoveryPlanService.actualScaleInHours = calculatedZoomValue * 24;
    }

    get steps(): number {
        return this._steps;
    }

    set steps(value: number) {
        this._steps = value;
    }

    get value(): number {
        return this._value;
    }

    set value(value: number) {
        this._value = value;
    }

    get valueInHours(): number {
        return this._recoveryPlanInterface.actualScaleInHours;
    }

    get recoveryPlanSubscription(): Subscription {
        return this._recoveryPlanSubscription;
    }

    set recoveryPlanSubscription(value: Subscription) {
        this._recoveryPlanSubscription = value;
    }

    get recoveryPlanInterface(): RecoveryPlanInterface {
        return this._recoveryPlanInterface;
    }

    set recoveryPlanInterface(value: RecoveryPlanInterface) {
        this._recoveryPlanInterface = value;
    }
}
