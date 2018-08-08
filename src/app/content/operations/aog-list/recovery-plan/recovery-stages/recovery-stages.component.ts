import {AfterViewInit, Component, OnInit} from '@angular/core';
import * as Konva from 'konva';
import {Shape} from 'konva';
import {RecoveryPlanStages} from '../../../../../shared/_models/aog/RecoveryPlanStages';
import {Stage} from '../../../../../shared/_models/aog/Stage';
import {ShapeDraw} from '../util/shapeDraw';
import {RecoveryPlanInterface, RecoveryPlanService} from '../util/recovery-plan.service';
import {Subscription} from 'rxjs/Subscription';
import {TimeConverterService} from '../util/time-converter.service';

@Component({
    selector: 'lsl-recovery-stages',
    templateUrl: './recovery-stages.component.html',
    styleUrls: ['./recovery-stages.component.css']
})
export class RecoveryStagesComponent implements OnInit, AfterViewInit {

    private static ACC = '#4CAF5D';
    private static ACC_PROJ = '#C6E2C7';
    private static EVA = '#FFA726';
    private static EVA_PROJ = '#F5E2C5';
    private static SUP = '#0A85C0';
    private static SUP_PROJ = '#B8D9E8';
    private static EXE = '#9575CD';
    private static EXE_PROJ = '#DDD5EA';
    private static NI = '#FF5722';
    private static NI_PROJ = '#FAD1C4';
    private static ETR = '#479FFF';
    private static ETR_PROJ = '#B4D1F0';
    private static GRAY = '#CCC';

    private _canvasHeight: number;
    private _lastValidPosition: number;
    private _activeViewInHours: number;
    private _activeViewInPixels: number;
    private _absoluteStartTime: number;
    private _stagesObjects: {[line: string]: Konva.Line | Konva.Circle | Shape};
    private _recoveryPlanSubscription: Subscription;
    private _recoveryPlanInterface: RecoveryPlanInterface;

    private _dummyCollection: RecoveryPlanStages;

    constructor(private _recoveryPlanService: RecoveryPlanService) {
        this._recoveryPlanSubscription = this._recoveryPlanService.recoveryPlanBehavior$.subscribe(x => this._recoveryPlanInterface = x);
        this._absoluteStartTime = 0;
        this._canvasHeight = 100;
        this._lastValidPosition = 0;
        this._stagesObjects = {};
    }

    ngOnInit() {
        this.lastValidPosition = 0;
        this.activeViewInHours = this._recoveryPlanInterface.activeViewInHours;
        this.activeViewInPixels = this._recoveryPlanInterface.activeViewInPixels;
        this.absoluteStartTime = this._recoveryPlanInterface.absoluteStartTime;

        const aogCreationTime = this._recoveryPlanInterface.relativeStartTime;

        this.dummyCollection = new RecoveryPlanStages([
            // new Stage(0, 0, 'ACC', 1533290400, 1533297600),
            new Stage(0, 0, 'ACC', TimeConverterService.temporalAddHoursToTime(aogCreationTime, 0), TimeConverterService.temporalAddHoursToTime(aogCreationTime, 2)),
            new Stage(0, 0, 'EVA', TimeConverterService.temporalAddHoursToTime(aogCreationTime, 2), TimeConverterService.temporalAddHoursToTime(aogCreationTime, 4)),
            new Stage(0, 0, 'SUP', TimeConverterService.temporalAddHoursToTime(aogCreationTime, 4), TimeConverterService.temporalAddHoursToTime(aogCreationTime, 7)),
            new Stage(0, 0, 'EXE', TimeConverterService.temporalAddHoursToTime(aogCreationTime, 7), TimeConverterService.temporalAddHoursToTime(aogCreationTime, 10)),
            new Stage(0, 0, 'ACC', TimeConverterService.temporalAddHoursToTime(aogCreationTime, 10), TimeConverterService.temporalAddHoursToTime(aogCreationTime, 12))
        ]);
    }

    ngAfterViewInit() {

        this.drawAll();
        // this.drawStages();
    }

    private drawAll() {
        const stage = new Konva.Stage({
            container: 'container',
            width: this.activeViewInPixels,
            height: this.canvasHeight
        });

        const layer = new Konva.Layer();

        const line = new Konva.Line({
            points: [0, 25, this.activeViewInPixels, 25],
            stroke: 'gray',
            strokeWidth: 2,
            lineCap: 'round',
            lineJoin: 'round'
        });

        layer.add(line);

        const stageObjects: {[line: string]: Konva.Line | Konva.Circle | Shape} = {};
        const collectionLength: number = this.dummyCollection.stageList.length;

        this.dummyCollection.stageList.forEach((value, index) => {
            const lineName: string = 'line_' + index;
            const circleName: string = 'circle_' + index;
            const localStagesObjects = stageObjects;
            const canvasWidth = this.activeViewInPixels;
            let initPosition = 0;

            stageObjects[lineName] = ShapeDraw.drawLines(value, this.absoluteStartTime, this.activeViewInHours, this.activeViewInPixels);
            stageObjects[circleName] = ShapeDraw.drawCircle(value, index, this.absoluteStartTime, this.activeViewInHours, this.activeViewInPixels, true, false, this.stagesObjects);

            stageObjects[circleName].on('mouseover', function() {
                document.body.style.cursor = 'pointer';
            });

            stageObjects[circleName].on('mouseout', function() {
                document.body.style.cursor = 'default';
            });

            stageObjects[circleName].on('dblclick', function() {
                // sipablo works here!
            });

            stageObjects[circleName].on('dragstart', function() {
                this.moveToTop();
                initPosition = localStagesObjects[circleName].getAbsolutePosition().x;
                layer.draw();
            });

            stageObjects[circleName].on('dragmove', function() {
                document.body.style.cursor = 'pointer';
                for (let i = 0; i < collectionLength; i++) {
                    // @ts-ignore
                    localStagesObjects['line_' + i].points([localStagesObjects['circle_' + i].getAbsolutePosition().x, 25, canvasWidth, 25]);
                }

                stage.draw();
            });

            stageObjects[circleName].on('dragend', function() {
                const diff = localStagesObjects[circleName].getAbsolutePosition().x - initPosition;
                for (let i = 0; i < collectionLength; i++) {
                    if (i > index) {
                        // @ts-ignore
                        localStagesObjects['line_' + i].points([localStagesObjects['circle_' + i].getAbsolutePosition().x + diff, 25, canvasWidth, 25]);
                        localStagesObjects['circle_' + i].x(localStagesObjects['circle_' + i].getAbsolutePosition().x + diff);
                    }
                }
                document.body.style.cursor = 'default';

                stage.draw();
            });

            layer.add(stageObjects[lineName]);
            layer.add(stageObjects[circleName]);
        });

        stage.add(layer);

        stage.draw();

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

    get dummyCollection(): RecoveryPlanStages {
        return this._dummyCollection;
    }

    set dummyCollection(value: RecoveryPlanStages) {
        this._dummyCollection = value;
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

    get stagesObjects(): { [p: string]: Konva.Line | Konva.Circle | Konva.Shape } {
        return this._stagesObjects;
    }

    set stagesObjects(value: { [p: string]: Konva.Line | Konva.Circle | Konva.Shape }) {
        this._stagesObjects = value;
    }
}
