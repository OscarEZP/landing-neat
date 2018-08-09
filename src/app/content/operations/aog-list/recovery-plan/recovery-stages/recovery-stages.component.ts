import {AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import * as Konva from 'konva';
import {MatMenuTrigger} from '@angular/material';
import {Stage} from '../../../../../shared/_models/aog/Stage';
import {ShapeDraw} from '../util/shapeDraw';
import {RecoveryPlanInterface, RecoveryPlanService, StageInterface} from '../util/recovery-plan.service';
import {Subscription} from 'rxjs/Subscription';
import {TimeConverterService} from '../util/time-converter.service';
import {Observable} from 'rxjs/Observable';
import {Vector2d} from 'konva';

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
        this._canvasHeight = 50;
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
            width: this.activeViewInPixels,
            height: this.canvasHeight
        });
        const layer = new Konva.Layer();
        this.drawBaseLine(layer);
        this.drawGroups(layer, stage);
        stage.add(layer);
    }

    // TO-DO: Implement service
    get stages$(): Observable<Stage[]> {
        const aogCreationTime = this._recoveryPlanInterface.relativeStartTime;
        return Observable.of([
            new Stage(0, 0, 'ACC', TimeConverterService.temporalAddHoursToTime(aogCreationTime, 0), TimeConverterService.temporalAddHoursToTime(aogCreationTime, 2)),
            new Stage(0, 0, 'EVA', TimeConverterService.temporalAddHoursToTime(aogCreationTime, 2), TimeConverterService.temporalAddHoursToTime(aogCreationTime, 4)),
            new Stage(0, 0, 'SUP', TimeConverterService.temporalAddHoursToTime(aogCreationTime, 4), TimeConverterService.temporalAddHoursToTime(aogCreationTime, 7)),
            new Stage(0, 0, 'EXE', TimeConverterService.temporalAddHoursToTime(aogCreationTime, 7), TimeConverterService.temporalAddHoursToTime(aogCreationTime, 10)),
            new Stage(0, 0, 'ACC', TimeConverterService.temporalAddHoursToTime(aogCreationTime, 10), TimeConverterService.temporalAddHoursToTime(aogCreationTime, 12))
        ]);
    }

    private getStagesSub(): Subscription {
        return this.stages$.subscribe(res => {
            this.stagesObjects = res.map(v => ({stage: v, line: null, circle: null, labelText: null, labelLine: null}));
        });
    }

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

    private drawGroups(layer: Konva.Layer, stage: Konva.Stage) {
        this.stagesObjects.forEach((value, index) => {
            let initPosition = 0;
            const interfaceStage = value.stage;
            const isLastItem = index + 1 === this.stagesObjects.length;
            this.lastValidPosition = 0;
            const startPos = TimeConverterService.epochTimeToPixelPosition(value.stage.start, this.absoluteStartTime, this.activeViewInHours, this.activeViewInPixels);
            const endPos = TimeConverterService.epochTimeToPixelPosition(value.stage.end, this.absoluteStartTime, this.activeViewInHours, this.activeViewInPixels);
            value.circle = ShapeDraw.drawCircle(interfaceStage.groupId, startPos, index > 0);
            value.line = ShapeDraw.drawLines(interfaceStage.groupId, startPos, endPos, true);
            value.circle.dragBoundFunc(pos => this.dragBound(pos, value, index, isLastItem ? this.activeViewInPixels : endPos));
            value.circle.on('mouseover', () => document.body.style.cursor = 'pointer');
            value.circle.on('mouseout', () => document.body.style.cursor = 'default');
            value.circle.on('dblclick', () => this.triggerMenu(value.circle.getAbsolutePosition().x));
            value.circle.on('dragstart', () => {
                value.circle.moveToTop();
                initPosition = value.circle.getAbsolutePosition().x;
                layer.draw();
            });
            value.circle.on('dragmove', () => {
                document.body.style.cursor = 'pointer';
                this.stagesObjects.forEach(v => v.line.points([v.circle.getAbsolutePosition().x, 25, this.activeViewInPixels, 25]));
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
                v.line.points([v.circle.getAbsolutePosition().x + diff, 25, this.activeViewInPixels, 25]);
                v.circle.x(v.circle.getAbsolutePosition().x + diff);
            });
    }

    private dragBound(pos: Vector2d, value: StageInterface, index: number, endPos: number): Vector2d {
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

    private triggerMenu(position: number) {
        this.trigger.openMenu();
        const el = document.querySelector('.timeline-menu');
        if (el) {
            this.menuStyle.left = position.toString().concat('px');
            const style = el['style'];
            Object.keys(this.menuStyle).forEach(key => style[key] = this.menuStyle[key]);
        }
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
