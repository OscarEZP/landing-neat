import {AfterViewInit, Component, Input, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from 'rxjs/Subscription';
import * as Konva from 'konva';
import {ShapeDraw} from '../util/shapeDraw';
import {RecoveryPlanInterface, RecoveryPlanService} from '../_services/recovery-plan.service';
import {TimeConverter} from '../util/timeConverter';
import {ApiRestService} from '../../../../../shared/_services/apiRest.service';
import {Status} from '../../../../../shared/_models/status';
import {tap} from 'rxjs/operators';

@Component({
  selector: 'lsl-recovery-real-plan',
  templateUrl: './recovery-real-plan.component.html',
  styleUrls: ['./recovery-real-plan.component.css']
})
export class RecoveryRealPlanComponent implements OnInit, OnDestroy, AfterViewInit {

    @Input() aogId: number;
    private _canvasHeight: number;
    private _oldActiveViewInHours: number;
    private _recoveryPlanSubscription: Subscription;
    private _recoveryPlanInterface: RecoveryPlanInterface;
    private _realPlanStage: Konva.Stage;
    private _niEtrCollection: Status[];
    private _niEtrCollectionSubscription: Subscription;

    constructor(
        private _recoveryPlanService: RecoveryPlanService,
        private _apiRestService: ApiRestService
    ) {
        this._canvasHeight = 50;
        this._recoveryPlanSubscription = new Subscription();
        this._niEtrCollectionSubscription = new Subscription();
        this._realPlanStage = null;
        this._niEtrCollection = null;
        this._oldActiveViewInHours = null;
    }

    ngOnInit() {
        this.recoveryPlanSubscription = this.getRecoveryPlanInterfaceSubscription();
    }

    ngOnDestroy() {
        this.recoveryPlanSubscription.unsubscribe();
        this.niEtrCollectionSubscription.unsubscribe();
        this.realPlanStage.destroy();
    }

    ngAfterViewInit() {
        this.drawCanvasElements();
    }

    private drawBaseLine(): Konva.Line {
        return new Konva.Line({
            points: [0, 25, this.recoveryPlanInterface.absoluteEndTime, 25],
            stroke: '#C0C0C0',
            strokeWidth: 4,
            lineCap: 'round',
            lineJoin: 'round'
        });
    }

    private createLayer(): Konva.Layer {
        return new Konva.Layer();
    }

    /**
     * Subscription for get recovery plan service interface
     * @return {Subscription}
     */
    private getRecoveryPlanInterfaceSubscription(): Subscription {
        return this._recoveryPlanService.recoveryPlanBehavior$
            .pipe(
                tap(v => {
                    this.recoveryPlanInterface = v;
                    this.drawCanvasElements();
                })
            )
            .filter(v => this.oldActiveViewInHours !== v.activeViewInHours)
            .subscribe((v) => {
                this.niEtrCollectionSubscription = this.searchNiEtrCollection();
                this.oldActiveViewInHours = v.activeViewInHours;
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

    private drawCanvasElements(): void {
        const endTimeInPixels = TimeConverter.epochTimeToPixelPosition(this.recoveryPlanInterface.absoluteEndTime, this.recoveryPlanInterface.absoluteStartTime, this.recoveryPlanInterface.activeViewInHours, this.recoveryPlanInterface.activeViewInPixels);
        if (this.recoveryPlanInterface.relativeStartTime !== 0) {
            this.realPlanStage = new Konva.Stage({
                container: 'real-plan-container',
                width: endTimeInPixels,
                height: this.canvasHeight
            });
            const layer = this.createLayer();
            layer.add(this.drawBaseLine());
            this.realPlanStage.add(layer);
            this.realPlanStage.draw();
        }
    }

    private searchNiEtrCollection(): Subscription {
        return this._apiRestService
            .search<Status[]>('aircraftOnGroundFollowUpSearch', {'aogId': this.aogId})
            .subscribe(rs => {
                this.niEtrCollection = rs;
                this.drawNiEtrInTimeline();
            });
    }

    private drawNiEtrInTimeline(): void {
        this.niEtrCollection.forEach(value => {
            const layer = this.createLayer();
            const validEndTime = value.realInterval.dt.epochTime !== null ? value.realInterval.dt.epochTime : value.requestedInterval.dt.epochTime;
            const isFilled = validEndTime < this.recoveryPlanInterface.utcNow;
            const calculatedPosition = TimeConverter.epochTimeToPixelPosition(validEndTime, this.recoveryPlanInterface.absoluteStartTime, this.recoveryPlanInterface.activeViewInHours, this.recoveryPlanInterface.activeViewInPixels);
            layer.add(ShapeDraw.drawTriangleLabel(this.niEtrColor(value.code, isFilled), calculatedPosition, value.code, isFilled));
            this.realPlanStage.add(layer);
        });
        this.realPlanStage.draw();
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
        return this.recoveryPlanInterface.absoluteEndTime;
    }

    get canvasHeight(): number {
        return this._canvasHeight;
    }

    set canvasHeight(value: number) {
        this._canvasHeight = value;
    }

    set oldActiveViewInHours(value) {
        this._oldActiveViewInHours = value;
    }

    get oldActiveViewInHours(): number {
        return this._oldActiveViewInHours;
    }

    get activeViewInHours(): number {
        return this.recoveryPlanInterface.activeViewInHours;
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
