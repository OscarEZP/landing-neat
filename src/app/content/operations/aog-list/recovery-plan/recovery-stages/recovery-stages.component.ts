import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import * as Konva from 'konva';
import {Shape} from 'konva';
import {RecoveryPlanStages} from '../../../../../shared/_models/aog/RecoveryPlanStages';
import {Stage} from '../../../../../shared/_models/aog/Stage';
import * as moment from 'moment';
import {MatDialog} from '@angular/material';

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
    private _stagesObjects: {[line: string]: Konva.Line | Konva.Circle | Shape};

    private _dummyCollection: RecoveryPlanStages;

    constructor(private _dialog: MatDialog) {
        this._canvasWidth = 1357;
        this._canvasHeight = 100;
        this._lastValidPosition = 0;
        this._referenceFrameTime = 24;
        this._referenceFramePixels = 100;
        this._relativeZeroPoint = 0;
        this._stagesObjects = {};
    }

    ngOnInit() {
        this.dummyCollection = new RecoveryPlanStages([
            // new Stage(0, 0, 'ACC', 1533290400, 1533297600),
            new Stage(0, 0, 'ACC', 1533277260, 1533297600),
            new Stage(0, 0, 'EVA', 1533297600, 1533304800),
            new Stage(0, 0, 'SUP', 1533304800, 1533312000),
            new Stage(0, 0, 'EXE', 1533312000, 1533326400),
            new Stage(0, 0, 'ACC', 1533326400, 1533333600)
        ]);

        this.canvasWidth = this.stages.nativeElement.parentNode.parentNode.offsetWidth;
        this.referenceFramePixels = Math.round((this.referenceFrameTime * 3600) / this.canvasWidth);

        this.relativeZeroPoint = this.setRelativeZeroPoint(this.dummyCollection.stageList[0].start);
    }

    ngAfterViewInit() {

        this.drawStages();
    }

    private drawStages() {

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

        this.dummyCollection.stageList.forEach((value, index) => {
            const lineName: string = 'line_' + index;
            const circleName: string = 'circle_' + index;
            const collectionLength: number = this.dummyCollection.stageList.length;
            const canvasWidth = this.canvasWidth;
            const localStagesObjects = this.stagesObjects;
            let initPosition = 0;
            const dialog = this._dialog;

            this.stagesObjects[lineName] = this.drawLines(RecoveryStagesComponent[value.group_id], value.start, value.end, index + 1 === collectionLength);
            this.stagesObjects[circleName] = this.drawCircle(RecoveryStagesComponent[value.group_id], value.start, value.end, index, index + 1 === collectionLength);

            this.stagesObjects[circleName].on('mouseover', function() {
                document.body.style.cursor = 'pointer';
            });

            this.stagesObjects[circleName].on('mouseout', function() {
                document.body.style.cursor = 'default';
            });

            this.stagesObjects[circleName].on('dblclick', function() {
                // sipablo works here!
            });

            this.stagesObjects[circleName].on('dragstart', function() {
                this.moveToTop();
                initPosition = localStagesObjects[circleName].getAbsolutePosition().x;
                layer.draw();
            });

            this.stagesObjects[circleName].on('dragmove', function() {
                document.body.style.cursor = 'pointer';
                for (let i = 0; i < collectionLength; i++) {
                    // @ts-ignore
                    localStagesObjects['line_' + i].points([localStagesObjects['circle_' + i].getAbsolutePosition().x, 25, canvasWidth, 25]);
                }

                stage.draw();
            });

            this.stagesObjects[circleName].on('dragend', function() {
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

            layer.add(this.stagesObjects[lineName]);
            layer.add(this.stagesObjects[circleName]);
        });

        stage.add(layer);

    }

    private drawCircle(stageType: string, startTime: number, endTime: number, itemPosition: number, isLastItem: boolean): Shape {
        const stagePadding = 9;
        const startPos = this.epochTimeToPixelPosition(startTime) + stagePadding;
        const endPos = isLastItem ? this.canvasWidth : this.epochTimeToPixelPosition(endTime);
        let lastValidPos = this.lastValidPosition = 0;

        const stagesObjects = this.stagesObjects;

        console.log('start pos: ' + startPos);
        console.log('end pos: ' + endPos);

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

                const prevCircleItem = stagesObjects['circle_' + (itemPosition - 1)] !== undefined ? stagesObjects['circle_' + (itemPosition - 1)].getAbsolutePosition().x : 0;
                const nextCircleItem = stagesObjects['circle_' + (itemPosition + 1)] !== undefined ? stagesObjects['circle_' + (itemPosition + 1)].getAbsolutePosition().x : endPos;

                if (pos.x > prevCircleItem && nextCircleItem > pos.x) {
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

    private drawLines(stageType: string, start: number, end: number, isLastItem: boolean): Shape {
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

    get stagesObjects(): { [p: string]: Konva.Line | Konva.Circle | Konva.Shape } {
        return this._stagesObjects;
    }

    set stagesObjects(value: { [p: string]: Konva.Line | Konva.Circle | Konva.Shape }) {
        this._stagesObjects = value;
    }
}
