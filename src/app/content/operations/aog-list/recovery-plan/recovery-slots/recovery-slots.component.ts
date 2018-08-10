import {AfterViewInit, Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from 'rxjs/Subscription';
import * as Konva from 'konva';
import {ShapeDraw} from '../util/shapeDraw';
import moment = require('moment');
import {RecoveryPlanInterface, RecoveryPlanService, StageInterface} from '../_services/recovery-plan.service';

@Component({
  selector: 'lsl-recovery-slots',
  templateUrl: './recovery-slots.component.html',
  styleUrls: ['./recovery-slots.component.css']
})
export class RecoverySlotsComponent implements OnInit, OnDestroy, AfterViewInit {
    private _stagesSub: Subscription;

    private _canvasHeight: number;
    private _lastValidPosition: number;
    private _activeViewInHours: number;
    private _activeViewInPixels: number;
    private _absoluteStartTime: number;
    private _relativeStartTime: number;
    private _stagesObjects: StageInterface[];
    private _recoveryPlanSubscription: Subscription;
    private _recoveryPlanInterface: RecoveryPlanInterface;

    constructor(private _recoveryPlanService: RecoveryPlanService) {
        this._recoveryPlanSubscription = this._recoveryPlanService.recoveryPlanBehavior$.subscribe(x => this._recoveryPlanInterface = x);
        this._absoluteStartTime = 0;
        this._relativeStartTime = 0;
        this._canvasHeight = 50;
        this._lastValidPosition = 0;
        this._stagesObjects = [];
        this._stagesSub = new Subscription();
    }

    ngOnInit() {
        this.lastValidPosition = 0;
        this.activeViewInHours = this._recoveryPlanInterface.activeViewInHours;
        this.activeViewInPixels = this._recoveryPlanInterface.activeViewInPixels;
        this.absoluteStartTime = this._recoveryPlanInterface.absoluteStartTime;
        this.relativeStartTime = this._recoveryPlanInterface.relativeStartTime;
    }

    ngOnDestroy() {

    }

    ngAfterViewInit() {
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

    private drawBoxes(layer: Konva.Layer): void {
        const hourInMs = 3600000;
        const startTime = this.absoluteStartTime;
        let dateStartTime = startTime;
        let accumulator = 0;

        for (let i = 0; i < this.activeViewInHours; i++) {
            const calculatedStartTime = startTime + hourInMs * i;

            layer.add(ShapeDraw.drawTimeBox(calculatedStartTime, calculatedStartTime + hourInMs, true, this.absoluteStartTime, this.activeViewInHours, this.activeViewInPixels));

            if (moment(calculatedStartTime).hour() === 0) {
                layer.add(ShapeDraw.drawTimeBox(dateStartTime, calculatedStartTime, false, this.absoluteStartTime, this.activeViewInHours, this.activeViewInPixels));
                dateStartTime = calculatedStartTime;
            } else if (i === this.activeViewInHours - 1) {
                layer.add(ShapeDraw.drawTimeBox(dateStartTime, calculatedStartTime + hourInMs, false, this.absoluteStartTime, this.activeViewInHours, this.activeViewInPixels));
            }

            accumulator++;
        }
    }

    get stagesSub(): Subscription {
        return this._stagesSub;
    }

    set stagesSub(value: Subscription) {
        this._stagesSub = value;
    }

    get canvasHeight(): number {
        return this._canvasHeight;
    }

    set canvasHeight(value: number) {
        this._canvasHeight = value;
    }

    get lastValidPosition(): number {
        return this._lastValidPosition;
    }

    set lastValidPosition(value: number) {
        this._lastValidPosition = value;
    }

    get activeViewInHours(): number {
        return this._activeViewInHours;
    }

    set activeViewInHours(value: number) {
        this._activeViewInHours = value;
    }

    get activeViewInPixels(): number {
        return this._activeViewInPixels;
    }

    set activeViewInPixels(value: number) {
        this._activeViewInPixels = value;
    }

    get absoluteStartTime(): number {
        return this._absoluteStartTime;
    }

    set absoluteStartTime(value: number) {
        this._absoluteStartTime = value;
    }

    get stagesObjects(): StageInterface[] {
        return this._stagesObjects;
    }

    set stagesObjects(value: StageInterface[]) {
        this._stagesObjects = value;
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
        return this._relativeStartTime;
    }

    set relativeStartTime(value: number) {
        this._relativeStartTime = value;
    }
}
