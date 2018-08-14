import {AfterViewInit, Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from 'rxjs/Subscription';
import * as Konva from 'konva';
import {Stage} from '../../../../../shared/_models/aog/Stage';
import {ShapeDraw} from '../util/shapeDraw';
import moment = require('moment');
import {RecoveryPlanInterface, RecoveryPlanService, StageInterface} from '../_services/recovery-plan.service';
import {RecoveryStage} from '../../../../../shared/_models/aog/RecoveryStage';
import {DateRange} from '../../../../../shared/_models/common/dateRange';
import {TimeInstant} from '../../../../../shared/_models/timeInstant';

@Component({
  selector: 'lsl-recovery-real-plan',
  templateUrl: './recovery-real-plan.component.html',
  styleUrls: ['./recovery-real-plan.component.css']
})
export class RecoveryRealPlanComponent implements OnInit, OnDestroy, AfterViewInit {
    private _stagesSub: Subscription;

    private _canvasHeight: number;
    private _lastValidPosition: number;
    private _activeViewInHours: number;
    private _activeViewInPixels: number;
    private _absoluteStartTime: number;
    private _stagesObjects: StageInterface[];
    private _recoveryPlanSubscription: Subscription;
    private _recoveryPlanInterface: RecoveryPlanInterface;
    private _recoveryStagesConfiguration: RecoveryStage[];
    private _recoveryStagesSub: Subscription;

    constructor(private _recoveryPlanService: RecoveryPlanService) {
        this._recoveryPlanSubscription = this._recoveryPlanService.recoveryPlanBehavior$.subscribe(x => this._recoveryPlanInterface = x);
        this._absoluteStartTime = 0;
        this._canvasHeight = 50;
        this._lastValidPosition = 0;
        this._stagesObjects = [];
        this._stagesSub = new Subscription();
    }

    ngOnInit() {
        // this.stagesSub = this.getStagesSub();
        this.recoveryStagesSub = this.getRecoveryStagesConfSubscription();
        this.lastValidPosition = 0;
        this.activeViewInHours = this._recoveryPlanInterface.activeViewInHours;
        this.activeViewInPixels = this._recoveryPlanInterface.activeViewInPixels;
        this.absoluteStartTime = this._recoveryPlanInterface.absoluteStartTime;
    }

    ngOnDestroy() {
        this.stagesSub.unsubscribe();
    }

    ngAfterViewInit() {
        const stage = new Konva.Stage({
            container: 'real-plan-container',
            width: this.activeViewInPixels,
            height: this.canvasHeight
        });
        const layer = new Konva.Layer();
        this.drawBaseLine(layer);
        // this.drawGroups(layer, stage);

        layer.add(this.getRelativeNow(this._recoveryPlanInterface.relativeStartTime));

        stage.add(layer);

        stage.draw();
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

    // private getStagesSub(): Subscription {
    //     return this.stages$.subscribe(res => {
    //         this.stagesObjects = res.map(v => ({stage: v, line: null, circle: null, labelText: null, labelLine: null}));
    //     });
    // }

    private drawBaseLine(layer: Konva.Layer) {
        const line = new Konva.Line({
            points: [0, 25, this.activeViewInPixels, 25],
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
    private getRelativeNow(startTime: number): Konva.Text {
        const startMoment = moment(startTime).format('YYYY-MM-DD');
        const nowTime = moment().hour() + ':' + moment().minute();
        const relativeNow = moment(startMoment + ' ' + nowTime).valueOf();

        return ShapeDraw.drawLabelText(
            new Stage('NOW', 1, new DateRange( new TimeInstant(relativeNow, ''), new TimeInstant(0, ''))),
            this.absoluteStartTime,
            this.activeViewInHours,
            this.activeViewInPixels
        );
    }


    /**
     * Subscription for get the data list with recovery stage configuration
     * @return {Subscription}
     */
    private getRecoveryStagesConfSubscription(): Subscription {

        return this._recoveryPlanService.findRecoveryStageConf().subscribe(
            (response) => {
                console.log('response', response);
                this.recoveryStagesConfiguration = response;
                console.log('recoveryStagesConfiguration', this.recoveryStagesConfiguration);

            },
            () => {
                console.log('Error load recovery stage configuration');
            });
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


    get recoveryStagesConfiguration(): RecoveryStage[] {
        return this._recoveryStagesConfiguration;
    }

    set recoveryStagesConfiguration(value: RecoveryStage[]) {
        this._recoveryStagesConfiguration = value;
    }


    get recoveryStagesSub(): Subscription {
        return this._recoveryStagesSub;
    }

    set recoveryStagesSub(value: Subscription) {
        this._recoveryStagesSub = value;
    }
}
