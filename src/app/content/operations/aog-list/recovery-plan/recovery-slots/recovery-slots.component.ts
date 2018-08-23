import {AfterViewInit, Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from 'rxjs/Subscription';
import * as Konva from 'konva';
import {ShapeDraw} from '../util/shapeDraw';
import {RecoveryPlanInterface, RecoveryPlanService} from '../_services/recovery-plan.service';
import moment = require('moment');

@Component({
  selector: 'lsl-recovery-slots',
  templateUrl: './recovery-slots.component.html',
  styleUrls: ['./recovery-slots.component.css']
})
export class RecoverySlotsComponent implements OnInit, OnDestroy, AfterViewInit {

    private _canvasHeight: number;
    private _lastValidPosition: number;
    private _activeViewInHours: number;
    private _activeViewInPixels: number;
    private _absoluteStartTime: number;
    private _relativeStartTime: number;
    private _actualScaleInHours: number;
    private _recoveryPlanSubscription: Subscription;
    private _recoveryPlanInterface: RecoveryPlanInterface;

    constructor(private _recoveryPlanService: RecoveryPlanService) {
        this._canvasHeight = 50;
    }

    ngOnInit() {
        this.lastValidPosition = 0;
    }

    ngOnDestroy() {
        this.recoveryPlanSubscription.unsubscribe();
    }

    ngAfterViewInit() {
        this.recoveryPlanSubscription = this._recoveryPlanService.recoveryPlanBehavior$.subscribe(x => {
            this.recoveryPlanInterface = x;
            this.drawCanvasElements();
        });
    }

    private drawCanvasElements() {
        if (this.relativeStartTime !== 0) {
            const stage = new Konva.Stage({
                container: 'slots-container',
                width: this.activeViewInPixels,
                height: this.canvasHeight
            });
            const layer = new Konva.Layer();

            this.drawBoxes(layer);

            stage.add(layer);
            stage.draw();
        }
    }

    private drawBoxes(layer: Konva.Layer): void {
        const blockSize = this.activeViewInPixels / 24;
        const actualScale = this.actualScaleInHours !== undefined ? this.actualScaleInHours : 24;
        const hourInMs = 3600000 * (actualScale / 24);
        const startTime = this.absoluteStartTime;
        let dateStartTime = startTime;
        let previousCalculatedStartTime = 0;
        let accumulator = 0;
        let previousSlotIndex = 0;

        for (let i = 0; i < this.activeViewInHours; i++) {
            const calculatedStartTime = startTime + hourInMs * i;

            layer.add(ShapeDraw.drawTimeBox(calculatedStartTime, blockSize * i, blockSize * (i + 1), true, false));

            if (moment.utc(calculatedStartTime).hour() < previousCalculatedStartTime) {
                layer.add(ShapeDraw.drawTimeBox(calculatedStartTime, blockSize * previousSlotIndex, blockSize * (i + 1), false, false));
                previousSlotIndex = i;
                dateStartTime = calculatedStartTime;
            } else if (i === this.activeViewInHours - 1) {
                layer.add(ShapeDraw.drawTimeBox(calculatedStartTime, blockSize * previousSlotIndex, blockSize * (i + 1), false, true));
            }

            previousCalculatedStartTime = moment.utc(calculatedStartTime).hour();
            accumulator++;
        }
    }

    get canvasHeight(): number {
        return this._canvasHeight;
    }

    get lastValidPosition(): number {
        return this._lastValidPosition;
    }

    set lastValidPosition(value: number) {
        this._lastValidPosition = value;
    }

    get activeViewInHours(): number {
        return this._recoveryPlanInterface.activeViewInHours;
    }

    set activeViewInHours(value: number) {
        this._activeViewInHours = value;
    }

    get activeViewInPixels(): number {
        return this._recoveryPlanInterface.activeViewInPixels;
    }

    set activeViewInPixels(value: number) {
        this._activeViewInPixels = value;
    }

    get absoluteStartTime(): number {
        return this._recoveryPlanInterface.absoluteStartTime;
    }

    set absoluteStartTime(value: number) {
        this._absoluteStartTime = value;
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

    get relativeStartTime(): number {
        return this._recoveryPlanInterface.relativeStartTime;
    }

    set relativeStartTime(value: number) {
        this._relativeStartTime = value;
        this.drawCanvasElements();
    }

    get actualScaleInHours(): number {
        return this._recoveryPlanInterface.actualScaleInHours;
    }

    set actualScaleInHours(value: number) {
        this._actualScaleInHours = value;
        this.drawCanvasElements();
    }
}
