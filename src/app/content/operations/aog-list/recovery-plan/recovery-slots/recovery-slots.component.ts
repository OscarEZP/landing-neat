import {AfterViewInit, Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from 'rxjs/Subscription';
import * as Konva from 'konva';
import {ShapeDraw} from '../util/shapeDraw';
import {RecoveryPlanInterface, RecoveryPlanService} from '../_services/recovery-plan.service';
import moment = require('moment');
import {TimeConverter} from '../util/timeConverter';

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
    private _relativeEndTime: number;
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

    /**
     * After the view has been initialized make a subscription to bind the recoveryPlanInterface (local variable) with the interface of the service, also initialize the draw of the canvas.
     */
    ngAfterViewInit() {
        this.recoveryPlanSubscription = this._recoveryPlanService.recoveryPlanBehavior$.subscribe(x => {
            this.recoveryPlanInterface = x;
            this.drawCanvasElements();
        });
    }

    /**
     * Draw the canvas elements needed to add later the elements
     */
    private drawCanvasElements(): void {
        const endTimeInPixels = TimeConverter.epochTimeToPixelPosition(this.recoveryPlanInterface.relativeEndTime, this.recoveryPlanInterface.absoluteStartTime, this.recoveryPlanInterface.activeViewInHours, this.recoveryPlanInterface.activeViewInPixels);

        if (this.relativeStartTime !== 0) {
            const stage = new Konva.Stage({
                container: 'slots-container',
                width: endTimeInPixels,
                height: this.canvasHeight
            });
            const layer = new Konva.Layer();

            this.drawBoxes(layer);

            stage.add(layer);
            stage.draw();
        }
    }

    /**
     * Method to draw the boxes (slots of time) with their corresponding values
     * @param layer needed to reference where will be drawn.
     */
    private drawBoxes(layer: Konva.Layer): void {
        const endTimeInPixels = TimeConverter.epochTimeToPixelPosition(this.recoveryPlanInterface.relativeEndTime, this.recoveryPlanInterface.absoluteStartTime, this.recoveryPlanInterface.activeViewInHours, this.recoveryPlanInterface.activeViewInPixels);
        const loopTime = Math.round(endTimeInPixels / (this.activeViewInPixels / 24));
        console.log('endTimeInPixels: ', endTimeInPixels);
        console.log('loopTime: ', loopTime);

        const blockSize = this.activeViewInPixels / 24;
        const actualScale = this.activeViewInHours !== undefined ? this.activeViewInHours : 24;
        const hourInMs = 3600000 * (actualScale / 24);
        const startTime = this.absoluteStartTime;
        let previousCalculatedStartTime = 0;
        let accumulator = 0;
        let previousSlotIndex = 0;

        for (let i = 0; i < loopTime; i++) {
            const calculatedStartTime = startTime + hourInMs * i;

            layer.add(ShapeDraw.drawTimeBox(calculatedStartTime, blockSize * i, blockSize * (i + 1), true, false));

            if (moment.utc(calculatedStartTime).hour() < previousCalculatedStartTime) {
                layer.add(ShapeDraw.drawTimeBox(calculatedStartTime, blockSize * previousSlotIndex, blockSize * (i + 1), false, false));
                previousSlotIndex = i;
            } else if (i === loopTime - 1) {
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
        this.drawCanvasElements();
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

    get relativeEndTime(): number {
        return this._recoveryPlanInterface.relativeEndTime;
    }

    set relativeEndTime(value: number) {
        this._relativeEndTime = value;
        this.drawCanvasElements();
    }
}
