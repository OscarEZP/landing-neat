import {AfterViewInit, Component, Input, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from 'rxjs/Subscription';
import * as Konva from 'konva';
import {ShapeDraw} from '../util/shapeDraw';
import {RecoveryPlanInterface, RecoveryPlanService} from '../_services/recovery-plan.service';
import {TimeConverter} from '../util/timeConverter';
import {ApiRestService} from '../../../../../shared/_services/apiRest.service';
import {Status} from '../../../../../shared/_models/status';
import moment = require('moment');

@Component({
  selector: 'lsl-recovery-real-plan',
  templateUrl: './recovery-real-plan.component.html',
  styleUrls: ['./recovery-real-plan.component.css']
})
export class RecoveryRealPlanComponent implements OnInit, OnDestroy, AfterViewInit {

    @Input() aogId: number;
    private _canvasWidth: number;
    private _canvasHeight: number;
    private _activeViewInHours: number;
    private _recoveryPlanSubscription: Subscription;
    private _recoveryPlanInterface: RecoveryPlanInterface;
    private _realPlanStage: Konva.Stage;
    private _niEtrCollection: Status[];
    private _niEtrCollectionSubscription: Subscription;

    constructor(
        private _recoveryPlanService: RecoveryPlanService,
        private _apiRestService: ApiRestService
    ) {
        this._recoveryPlanSubscription = null;
        this._canvasHeight = 50;
        this._recoveryPlanSubscription = new Subscription();
        this._realPlanStage = null;
        this._niEtrCollection = null;
    }

    ngOnInit() {
        this.recoveryPlanSubscription = this.getRecoveryPlanInterfaceSubscription();
        this.activeViewInHours = this._recoveryPlanInterface.activeViewInHours;
        this.niEtrCollectionSubscription = this.searchNiEtrCollection();
    }

    ngOnDestroy() {
        this.recoveryPlanSubscription.unsubscribe();
        this.niEtrCollectionSubscription.unsubscribe();
        this.realPlanStage.destroy();
    }

    ngAfterViewInit() {

    }

    private drawBase(): void {
        this.realPlanStage = new Konva.Stage({
            container: 'real-plan-container',
            width: this.canvasWidth,
            height: this.canvasHeight
        });
        const layer = new Konva.Layer();
        this.drawBaseLine(layer);
        // this.drawGroups(layer, stage);

        layer.add(this.getRelativeNow());

        this.realPlanStage.add(layer);

        this.realPlanStage.draw();
    }

    /**
     * Subscription for get recovery plan service interface
     * @return {Subscription}
     */
    private getRecoveryPlanInterfaceSubscription(): Subscription {
        return this._recoveryPlanService.recoveryPlanBehavior$
            .subscribe((v) => {
                this.recoveryPlanInterface = v;
                this.canvasWidth = TimeConverter.epochTimeToPixelPosition(v.absoluteEndTime, v.absoluteStartTime, v.activeViewInHours, v.activeViewInPixels);
                // this.searchNiEtrCollection();
                // this.drawBase();
            });
    }

    // // TO-DO: Implement service
    // get stages$(): Observable<Stage[]> {
    //     const aogCreationTime = this._recoveryPlanInterface.relativeStartTime;
    //     return Observable.of([
    //         new Stage(0, 0, 'ACC', TimeConverter.temporalAddHoursToTime(aogCreationTime, 0), TimeConverter.temporalAddHoursToTime(aogCreationTime, 2)),
    //         new Stage(0, 0, 'EVA', TimeConverter.temporalAddHoursToTime(aogCreationTime, 2), TimeConverter.temporalAddHoursToTime(aogCreationTime, 4)),
    //         new Stage(0, 0, 'SUP', TimeConverter.temporalAddHoursToTime(aogCreationTime, 4), TimeConverter.temporalAddHoursToTime(aogCreationTime, 7)),
    //         new Stage(0, 0, 'EXE', TimeConverter.temporalAddHoursToTime(aogCreationTime, 7), TimeConverter.temporalAddHoursToTime(aogCreationTime, 10)),
    //         new Stage(0, 0, 'ACC', TimeConverter.temporalAddHoursToTime(aogCreationTime, 10), TimeConverter.temporalAddHoursToTime(aogCreationTime, 12))
    //     ]);
    // }

    private drawBaseLine(layer: Konva.Layer) {
        const line = new Konva.Line({
            points: [0, 25, this._recoveryPlanInterface.absoluteEndTime, 25],
            stroke: 'gray',
            strokeWidth: 2,
            lineCap: 'round',
            lineJoin: 'round'
        });
        layer.add(line);
    }

    // private drawGroups(layer: Konva.Layer, stage: Konva.Stage) {
    //     this.stagesObjects.forEach((value, index) => {
    //         const interfaceStage = value.stage;
    //         this.lastValidPosition = 0;
    //         const startPos = TimeConverter.epochTimeToPixelPosition(value.stage.start, this.absoluteStartTime, this.activeViewInHours, this.activeViewInPixels);
    //         const endPos = TimeConverter.epochTimeToPixelPosition(value.stage.end, this.absoluteStartTime, this.activeViewInHours, this.activeViewInPixels);
    //         value.circle = ShapeDraw.drawCircle(interfaceStage.groupId, startPos, false);
    //         value.line = ShapeDraw.drawLines(interfaceStage.groupId, startPos, endPos, false);
    //         /*value.labelLine = ShapeDraw.drawLabelLine(value.stage, this.absoluteStartTime, this.activeViewInHours, this.activeViewInPixels);
    //         value.labelText = ShapeDraw.drawLabelText(value.stage, this.absoluteStartTime, this.activeViewInHours, this.activeViewInPixels);
    //         layer.add(value.labelLine);
    //         layer.add(value.labelText);*/
    //         layer.add(value.line);
    //         layer.add(value.circle);
    //     });
    // }

    /**
     * @TODO: make it real later when implementation of services are done
     */
    private getRelativeNow(): Konva.Text {
        const relativeNow = moment.utc().valueOf();

        const startPos = this._recoveryPlanService.getPositionByEpochtime(relativeNow);

        return ShapeDraw.drawLabelText('NOW', startPos);
    }

    private searchNiEtrCollection(): Subscription {
        return this._apiRestService
            .search<Status[]>('aircraftOnGroundFollowUpSearch', {'aogId': this.aogId})
            .subscribe(rs => {
                this.drawBase();
                this.niEtrCollection = rs;
                this.drawNiEtrInTimeline();
            });
    }

    private drawNiEtrInTimeline(): void {

        this.niEtrCollection.forEach(value => {
            const labelLayer = new Konva.Layer();
            const validEndTime = value.realInterval.dt.epochTime !== null ? value.realInterval.dt.epochTime : value.requestedInterval.dt.epochTime;
            const isFilled = validEndTime < this.recoveryPlanInterface.utcNow;
            const calculatedPosition = TimeConverter.epochTimeToPixelPosition(validEndTime, this.recoveryPlanInterface.absoluteStartTime, this.recoveryPlanInterface.activeViewInHours, this.recoveryPlanInterface.activeViewInPixels);

            labelLayer.add(ShapeDraw.drawTriangleLabel(this.niEtrColor(value.code, isFilled), calculatedPosition, value.code, isFilled));
            this.realPlanStage.add(labelLayer);
        });

        this.realPlanStage.batchDraw();
    }

    private niEtrColor(typeValue: string, isBeforeNow: boolean): string {
        let colorValue;
        switch (typeValue) {
            case 'NI':
                colorValue = isBeforeNow ? '#FF5722' : '#F6C3B3';
                break;
            case 'ETR':
                colorValue = isBeforeNow ? '#479FFF' : '#BED9F6';
                break;
            default :
                colorValue = isBeforeNow ? '#479FFF' : '#BED9F6';
                break;
        }

        return colorValue;
    }

    get absoluteEndTime(): number {
        return this._recoveryPlanService.absoluteEndTime;
    }

    get canvasWidth(): number {
        return this._canvasWidth;
    }

    set canvasWidth(value: number) {
        this._canvasWidth = value;
    }

    get canvasHeight(): number {
        return this._canvasHeight;
    }

    set canvasHeight(value: number) {
        this._canvasHeight = value;
    }

    get activeViewInHours(): number {
        return this._activeViewInHours;
    }

    set activeViewInHours(value: number) {
        this._activeViewInHours = value;
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

    get realPlanStage(): Konva.Stage {
        return this._realPlanStage;
    }

    set realPlanStage(value: Konva.Stage) {
        this._realPlanStage = value;
    }

    get niEtrCollection(): Status[] {
        return this._niEtrCollection;
    }

    set niEtrCollection(value: Status[]) {
        this._niEtrCollection = value;
    }

    get niEtrCollectionSubscription(): Subscription {
        return this._niEtrCollectionSubscription;
    }

    set niEtrCollectionSubscription(value: Subscription) {
        this._niEtrCollectionSubscription = value;
    }
}
