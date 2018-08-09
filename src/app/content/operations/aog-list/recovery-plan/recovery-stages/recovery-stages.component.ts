import {AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import * as Konva from 'konva';
import {MatMenuTrigger} from '@angular/material';
import {RecoveryPlanStages} from '../../../../../shared/_models/aog/RecoveryPlanStages';
import {Stage} from '../../../../../shared/_models/aog/Stage';
import {ShapeDraw} from '../util/shapeDraw';
import {RecoveryPlanInterface, RecoveryPlanService} from '../util/recovery-plan.service';
import {Subscription} from 'rxjs/Subscription';
import {TimeConverterService} from '../util/time-converter.service';
import {Observable} from 'rxjs/Observable';
import {Vector2d} from 'konva';

export interface StageInterface {
    line: Konva.Line;
    circle: Konva.Circle;
    stage: Stage;
}

export interface StyleInterface {
    top: string;
    left: string;
    position: string;
}

@Component({
    selector: 'lsl-recovery-stages',
    templateUrl: './recovery-stages.component.html',
    styleUrls: ['./recovery-stages.component.scss']
})
export class RecoveryStagesComponent implements OnInit, OnDestroy, AfterViewInit {

    @ViewChild('stages') public stages: ElementRef;
    @ViewChild(MatMenuTrigger) trigger: MatMenuTrigger;

    private _stagesSub: Subscription;
    private _menuStyle: StyleInterface;

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
    private _stagesObjects: StageInterface[];
    private _recoveryPlanSubscription: Subscription;
    private _recoveryPlanInterface: RecoveryPlanInterface;

    constructor(private _recoveryPlanService: RecoveryPlanService) {
        this._recoveryPlanSubscription = this._recoveryPlanService.recoveryPlanBehavior$.subscribe(x => this._recoveryPlanInterface = x);
        this._absoluteStartTime = 0;
        this._canvasHeight = 100;
        this._lastValidPosition = 0;
        this._stagesObjects = [];
        this._menuStyle = { top: '-60px', left: '', position: 'absolute'};
        this._stagesSub = new Subscription();
    }

    ngOnInit() {
        this.stagesSub = this.getStagesSub();
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
            container: 'container',
            width: this.canvasWidth,
            height: this.canvasHeight
        });
        const layer = new Konva.Layer();
        this.drawBaseLine(layer);
        this.drawGroups(layer, stage);
        stage.add(layer);
    }

    // TO-DO: Implement service
    get stages$(): Observable<Stage[]> {
        return Observable.of([
            new Stage(0, 0, 'ACC', 1533277260, 1533297600),
            new Stage(0, 0, 'EVA', 1533297600, 1533304800),
            new Stage(0, 0, 'SUP', 1533304800, 1533312000),
            new Stage(0, 0, 'EXE', 1533312000, 1533326400),
            new Stage(0, 0, 'ACC', 1533326400, 1533333600)
        ]);
    }

    private getStagesSub(): Subscription {
        return this.stages$.subscribe(res => {
            this.stagesObjects = res.map(v => ({stage: v, line: null, circle: null}));
        });
    }

    private drawBaseLine(layer: Konva.Layer) {
        const line = new Konva.Line({
            points: [0, 25, this.canvasWidth, 25],
            stroke: 'gray',
            strokeWidth: 2,
            lineCap: 'round',
            lineJoin: 'round'
        });
        layer.add(line);
    }

    private drawGroups(layer: Konva.Layer, stage: Konva.Stage) {
        this.stagesObjects.forEach((value, index) => {
            let initPosition = 0;
            const interfaceStage = value.stage;
            const isLastItem = index + 1 === this.stagesObjects.length;
            this.lastValidPosition = 0;
            value.line = this.drawLines(RecoveryStagesComponent[interfaceStage.group_id], interfaceStage.start, interfaceStage.end, isLastItem);
            value.circle = this.drawCircle(RecoveryStagesComponent[interfaceStage.group_id], interfaceStage.start, index);
            value.circle.dragBoundFunc(pos => this.dragBound(value, index, pos, isLastItem));
            value.circle.on('mouseover', () => document.body.style.cursor = 'pointer');
            value.circle.on('mouseout', () => document.body.style.cursor = 'default');
            value.circle.on('dblclick', () => this.triggerMenu(value.stage));
            value.circle.on('dragstart', () => {
                value.circle.moveToTop();
                initPosition = value.circle.getAbsolutePosition().x;
                layer.draw();
            });
            value.circle.on('dragmove', () => {
                document.body.style.cursor = 'pointer';
                this.stagesObjects.forEach(v => v.line.points([v.circle.getAbsolutePosition().x, 25, this.canvasWidth, 25]));
                stage.draw();
            });
            value.circle.on('dragend', () => {
                this.resizeLines(value.circle.getAbsolutePosition().x, index, initPosition);
                document.body.style.cursor = 'default';
                stage.draw();
            });
            layer.add(value.line);
            layer.add(value.circle);
        });
    }

    private resizeLines(circlePosX: number, index: number, initPosition: number) {
        const diff = circlePosX - initPosition;
        this.stagesObjects
            .filter((v, i) => i > index)
            .forEach(v => {
                v.line.points([v.circle.getAbsolutePosition().x + diff, 25, this.canvasWidth, 25]);
                v.circle.x(v.circle.getAbsolutePosition().x + diff);
            });
    }

    private dragBound(value: StageInterface, index: number, pos: Vector2d, isLastItem: boolean): Vector2d {
        const endPos = isLastItem ? this.canvasWidth : this.epochTimeToPixelPosition(value.stage.end);
        const prevCircleItemPos = this.stagesObjects[index - 1] ? this.stagesObjects[index - 1].circle.getAbsolutePosition().x : 0;
        const nextCircleItemPos = this.stagesObjects[index + 1] ? this.stagesObjects[index + 1].circle.getAbsolutePosition().x : endPos;
        const result = {x: 0, y: value.circle.getAbsolutePosition().y};
        if (pos.x > (prevCircleItemPos + value.circle.radius() * 2) && (nextCircleItemPos - value.circle.radius() * 2) > pos.x) {
            this.lastValidPosition = pos.x;
            result.x = pos.x;
        } else {
            result.x = this.lastValidPosition;
        }
        return result;
    }

    private triggerMenu(value: any) {
        this.trigger.openMenu();
        const el = document.querySelector('.timeline-menu');
        if (el) {
            this.menuStyle.left = value.attrs.x.toString().concat('px');
            const style = el['style'];
            Object.keys(this.menuStyle).forEach(key => style[key] = this.menuStyle[key]);
        }
    }

/*    private drawAll() {
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
            const labelLineName: string = 'labelLine_' + index;
            const labelTextName: string = 'labelText_' + index;
            const localStagesObjects = stageObjects;
            const canvasWidth = this.activeViewInPixels;
            let initPosition = 0;

            stageObjects[lineName] = ShapeDraw.drawLines(value, this.absoluteStartTime, this.activeViewInHours, this.activeViewInPixels);
            stageObjects[circleName] = ShapeDraw.drawCircle(value, index, this.absoluteStartTime, this.activeViewInHours, this.activeViewInPixels, true, false, this.stagesObjects);
            stageObjects[labelTextName] = ShapeDraw.drawLabelText(value, this.absoluteStartTime, this.activeViewInHours, this.activeViewInPixels);
            stageObjects[labelLineName] = ShapeDraw.drawLabelLine(value, this.absoluteStartTime, this.activeViewInHours, this.activeViewInPixels);

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

            layer.add(stageObjects[labelTextName]);
            layer.add(stageObjects[labelLineName]);
            layer.add(stageObjects[lineName]);
            layer.add(stageObjects[circleName]);
        });

        stage.add(layer);

        stage.draw();

    }*/

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

    get stageList(): Stage[] {
        return this._stagesObjects.map(v => v.stage);
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

    get stagesSub(): Subscription {
        return this._stagesSub;
    }

    set stagesSub(value: Subscription) {
        this._stagesSub = value;
    }

    get menuStyle(): StyleInterface {
        return this._menuStyle;
    }

}
