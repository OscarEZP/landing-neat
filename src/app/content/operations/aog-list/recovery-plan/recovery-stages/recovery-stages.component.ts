import {AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import * as Konva from 'konva';
import {Stage} from '../../../../../shared/_models/aog/Stage';
import * as moment from 'moment';
import {MatMenuTrigger} from '@angular/material';
import {Subscription} from 'rxjs/Subscription';
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

    private _canvasWidth: number;
    private _canvasHeight: number;
    private _lastValidPosition: number;
    private _referenceFrameTime: number;
    private _referenceFramePixels: number;
    private _relativeZeroPoint: number;
    private _stagesObjects: StageInterface[];

    constructor() {
        this._canvasWidth = 1357;
        this._canvasHeight = 100;
        this._lastValidPosition = 0;
        this._referenceFrameTime = 24;
        this._referenceFramePixels = 100;
        this._relativeZeroPoint = 0;
        this._stagesObjects = [];
        this._menuStyle = { top: '-60px', left: '', position: 'absolute'};
        this._stagesSub = new Subscription();
    }

    ngOnInit() {
        this.stagesSub = this.getStagesSub();
        this.canvasWidth = this.stages.nativeElement.parentNode.parentNode.offsetWidth;
        this.referenceFramePixels = Math.round((this.referenceFrameTime * 3600) / this.canvasWidth);
        this.relativeZeroPoint = this.setRelativeZeroPoint(this.stageList[0].start);
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

    private drawCircle(stageType: string, startTime: number, itemPosition: number): Konva.Circle {
        const stagePadding = 9;
        const startPos = this.epochTimeToPixelPosition(startTime) + stagePadding;
        return new Konva.Circle({
            x: startPos,
            y: 25,
            width: 15,
            height: 15,
            radius: 7,
            fill: 'white',
            stroke: stageType,
            strokeWidth: 4,
            draggable: itemPosition !== 0
        });
    }

    private drawLines(stageType: string, start: number, end: number, isLastItem: boolean): Konva.Line {
        return new Konva.Line({
            points: [this.epochTimeToPixelPosition(start), 25, isLastItem ? this.canvasWidth : this.epochTimeToPixelPosition(end), 25],
            stroke: stageType,
            strokeWidth: 2,
            lineCap: 'round',
            lineJoin: 'round'
        });
    }

    private setRelativeZeroPoint(epochTime: number): number {
        const originalTime = epochTime;
        const minutes = moment.unix(epochTime).get('m');
        return moment.unix(originalTime).subtract(minutes, 'minutes').unix();
    }

    private epochTimeToPixelPosition(selectedTime: number): number {
        return Math.round((selectedTime - this.relativeZeroPoint) / this.referenceFramePixels);
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

    get lastValidPosition(): number {
        return this._lastValidPosition;
    }

    set lastValidPosition(value: number) {
        this._lastValidPosition = value;
    }

    get stageList(): Stage[] {
        return this._stagesObjects.map(v => v.stage);
    }

    get referenceFrameTime(): number {
        return this._referenceFrameTime;
    }

    set referenceFrameTime(value: number) {
        this._referenceFrameTime = value;
    }

    get referenceFramePixels(): number {
        return this._referenceFramePixels;
    }

    set referenceFramePixels(value: number) {
        this._referenceFramePixels = value;
    }

    get relativeZeroPoint(): number {
        return this._relativeZeroPoint;
    }

    set relativeZeroPoint(value: number) {
        this._relativeZeroPoint = value;
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
