import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import * as Konva from 'konva';
import {Shape} from 'konva';
import {RecoveryPlanStages} from '../../../../../shared/_models/aog/RecoveryPlanStages';
import {Stage} from '../../../../../shared/_models/aog/Stage';
import * as moment from 'moment';
import {forEach} from '@angular/router/src/utils/collection';
import {s} from '@angular/core/src/render3';

@Component({
    selector: 'lsl-recovery-stages',
    templateUrl: './recovery-stages.component.html',
    styleUrls: ['./recovery-stages.component.css']
})
export class RecoveryStagesComponent implements OnInit, AfterViewInit {

    @ViewChild('stages') public stages: ElementRef;

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

    private _dummyCollection: RecoveryPlanStages;

    constructor() {
        this._canvasWidth = 1000;
        this._canvasHeight = 100;
        this._lastValidPosition = 0;
        this._referenceFrameTime = 24;
        this._referenceFramePixels = 100;
        this._relativeZeroPoint = 0;
    }

    ngOnInit() {
        this.dummyCollection = new RecoveryPlanStages([
            new Stage(0, 0, 'ACC', 1533290400, 1533297600),
            new Stage(0, 0, 'EVA', 1533297600, 1533304800),
            new Stage(0, 0, 'SUP', 1533304800, 1533312000),
            new Stage(0, 0, 'EXE', 1533312000, 1533319200),
            new Stage(0, 0, 'ACC', 1533319200, 1533326400)
        ]);

        this.canvasWidth = this.stages.nativeElement.parentNode.parentNode.offsetWidth;
        this.referenceFramePixels = Math.round((this.referenceFrameTime * 7200) / this.canvasWidth);

        this.relativeZeroPoint = this.setRelativeZeroPoint(this.dummyCollection.stageList[0].start);
    }

    ngAfterViewInit() {

        this.initStages();

        // this.fakeDraw();
    }

    private initStages() {
        console.log('canvasWidth: ' + this.stages.nativeElement.parentNode.parentNode.offsetWidth);
        console.log('timestamp zero absoluto: ' + this.relativeZeroPoint);

        this.lastValidPosition = 0;

        const stage = new Konva.Stage({
            container: 'container',
            width: this.canvasWidth,
            height: this.canvasHeight
        });

        const layer = new Konva.Layer();

        const line = new Konva.Line({
            points: [0, 25, this.canvasWidth, 25],
            stroke: 'gray',
            strokeWidth: 2,
            lineCap: 'round',
            lineJoin: 'round'
        });

        layer.add(line);

        const stagesObjects: {[line: string]: Konva.Line | Konva.Circle | Shape} = {};

        for (let i = 0; i < this.dummyCollection.stageList.length; i++) {
            const lineName: string = 'line_' + i;
            const circleName: string = 'circle_' + i;

            stagesObjects[lineName] = this.drawLines(RecoveryStagesComponent[this.dummyCollection.stageList[i].group_id], this.dummyCollection.stageList[i].start, this.dummyCollection.stageList[i].end);
            stagesObjects[circleName] = this.drawCircle(RecoveryStagesComponent[this.dummyCollection.stageList[i].group_id], this.dummyCollection.stageList[i].start, this.dummyCollection.stageList[i].end, i);


            stagesObjects[circleName].on('dragstart', function() {
                this.moveToTop();
                layer.draw();
            });

            stagesObjects[circleName].on('dragmove', function() {
                document.body.style.cursor = 'pointer';
                // @ts-ignore
                stagesObjects[lineName].points([stagesObjects[circleName].getAbsolutePosition().x, 25, 1000, 25]);
                stage.draw();
            });

            stagesObjects[circleName].on('dragend', function() {
                document.body.style.cursor = 'default';
            });

            layer.add(stagesObjects[lineName]);
            layer.add(stagesObjects[circleName]);
        }

        console.log('stagesObjects: ' + JSON.stringify(stagesObjects));

        stage.add(layer);

    }

    private drawCircle(stageType: string, startTime: number, endTime: number, itemPosition: number): Shape {
        const stagePadding = 9;
        const startPos = this.epochTimeToPixelPosition(startTime) + stagePadding;
        const endPos = this.epochTimeToPixelPosition(endTime);
        let lastValidPos = this.lastValidPosition = 0;

        return new Konva.Circle({
            x: startPos,
            y: 25,
            width: 15,
            height: 15,
            radius: 7,
            fill: 'white',
            stroke: stageType,
            strokeWidth: 4,
            draggable: itemPosition !== 0,
            dragBoundFunc: function (pos) {
                if (pos.x > startPos && endPos < pos.x) {
                    lastValidPos = pos.x;
                    return {
                        x: pos.x,
                        y: this.getAbsolutePosition().y
                    };
                } else {
                    return {
                        x: lastValidPos,
                        y: this.getAbsolutePosition().y
                    };
                }
            }
        });
    }

    private drawLines(stageType: string, start: number, end: number): Shape {
        return new Konva.Line({
            points: [this.epochTimeToPixelPosition(start), 25, this.epochTimeToPixelPosition(end), 25],
            stroke: stageType,
            strokeWidth: 2,
            lineCap: 'round',
            lineJoin: 'round'
        });
    }

    private setRelativeZeroPoint(epochTime: number): number {
        // const minutes = moment.unix(epochTime).format('mm');
        const originalTime = epochTime;
        const minutes = moment.unix(epochTime).get('m');
        return moment.unix(originalTime).subtract(minutes, 'minutes').unix();
    }

    private epochTimeToPixelPosition(selectedTime: number): number {
        console.log('selectedTime: ' + selectedTime);
        console.log('this.relativeZeroPoint: ' + this.relativeZeroPoint);
        console.log('this.referenceFramePixels: ' + this.referenceFramePixels);
        return Math.round((selectedTime - this.relativeZeroPoint) / this.referenceFramePixels);
    }

    private fakeDraw() {
        let lastValidPos = 0;

        const stage = new Konva.Stage({
            container: 'container',
            width: this.stages.nativeElement.parentNode.parentNode.offsetWidth,
            height: this.canvasHeight
        });

        const layer = new Konva.Layer();

        const line = new Konva.Line({
            points: [0, 25, 1000, 25],
            stroke: 'gray',
            strokeWidth: 2,
            lineCap: 'round',
            lineJoin: 'round'
        });

        const circle = new Konva.Circle({
            x: 25,
            y: 25,
            width: 15,
            height: 15,
            radius: 7,
            fill: 'white',
            stroke: RecoveryStagesComponent.ACC,
            strokeWidth: 4,
            draggable: true,
            dragBoundFunc: function (pos) {

                const circleSupPos = circleSup.getAbsolutePosition().x - 40;

                if (pos.x < circleSupPos && pos.x > 25) {
                    lastValidPos = pos.x;
                    return {
                        x: pos.x,
                        y: this.getAbsolutePosition().y
                    };
                } else {
                    return {
                        x: lastValidPos,
                        y: this.getAbsolutePosition().y
                    };
                }
            }
        });

        const lineAcc = new Konva.Line({
            points: [25, 25, 1000, 25],
            stroke: RecoveryStagesComponent.ACC,
            strokeWidth: 2,
            lineCap: 'round',
            lineJoin: 'round'
        });

        circle.on('dragstart', function() {
            this.moveToTop();
            layer.draw();
        });

        circle.on('dragmove', function() {
            document.body.style.cursor = 'pointer';
            lineAcc.points([circle.getAbsolutePosition().x, 25, 1000, 25]);
            stage.draw();
        });

        circle.on('dragend', function() {
            document.body.style.cursor = 'default';
        });

        const circleSup = new Konva.Circle({
            x: 200,
            y: 25,
            width: 15,
            height: 15,
            radius: 7,
            fill: 'white',
            stroke: RecoveryStagesComponent.SUP,
            strokeWidth: 4,
            draggable: true,
            dragBoundFunc: function (pos) {

                const circlePos = circle.getAbsolutePosition().x + 40;
                const circleExePos = circleExe.getAbsolutePosition().x - 40;

                if (pos.x > circlePos && circleExePos > pos.x) {
                    lastValidPos = pos.x;
                    return {
                        x: pos.x,
                        y: this.getAbsolutePosition().y
                    };
                } else {
                    return {
                        x: lastValidPos,
                        y: this.getAbsolutePosition().y
                    };
                }
            }
        });

        const lineSup = new Konva.Line({
            points: [200, 25, 1000, 25],
            stroke: RecoveryStagesComponent.SUP,
            strokeWidth: 2,
            lineCap: 'round',
            lineJoin: 'round'
        });

        circleSup.on('dragstart', function() {
            this.moveToTop();
            layer.draw();
        });

        circleSup.on('dragmove', function() {
            document.body.style.cursor = 'pointer';
            lineSup.points([circleSup.getAbsolutePosition().x, 25, 1000, 25]);
            stage.draw();
        });

        circleSup.on('dragend', function() {
            document.body.style.cursor = 'default';
        });

        const circleExe = new Konva.Circle({
            x: 500,
            y: 25,
            width: 15,
            height: 15,
            radius: 7,
            fill: 'white',
            stroke: RecoveryStagesComponent.EXE,
            strokeWidth: 4,
            draggable: true,
            dragBoundFunc: function (pos) {
                const circleSupPos = circleSup.getAbsolutePosition().x + 40;

                if (pos.x > circleSupPos) {
                    return {
                        x: pos.x,
                        y: this.getAbsolutePosition().y
                    };
                } else {
                    return {
                        x: circleSupPos,
                        y: this.getAbsolutePosition().y
                    };
                }
            }
        });

        const lineExe = new Konva.Line({
            points: [500, 25, 1000, 25],
            stroke: RecoveryStagesComponent.EXE,
            strokeWidth: 2,
            lineCap: 'round',
            lineJoin: 'round'
        });

        circleExe.on('dragstart', function() {
            this.moveToTop();
            layer.draw();
        });

        circleExe.on('dragmove', function() {
            document.body.style.cursor = 'pointer';
            lineExe.points([circleExe.getAbsolutePosition().x, 25, 1000, 25]);
            stage.draw();
        });

        circleExe.on('dragend', function() {
            document.body.style.cursor = 'default';
        });

        layer.add(line);
        layer.add(lineAcc);
        layer.add(lineSup);
        layer.add(lineExe);
        layer.add(circle);
        layer.add(circleSup);
        layer.add(circleExe);
        stage.add(layer);
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

    get dummyCollection(): RecoveryPlanStages {
        return this._dummyCollection;
    }

    set dummyCollection(value: RecoveryPlanStages) {
        this._dummyCollection = value;
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
}
