import {Injectable} from '@angular/core';
import * as Konva from 'konva';
import {Shape} from 'konva';
import {TimeConverterService} from './time-converter.service';
import {Stage} from '../../../../../shared/_models/aog/Stage';

@Injectable()
export class ShapeDraw {
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

    constructor() {}

    public static drawCircle(item: Stage, itemPosition: number, absoluteStartTime: number, activeViewInHours: number, activeViewInPixels: number, isDraggable: boolean, isFilled: boolean, stageObjects: {[line: string]: Konva.Line | Konva.Circle | Shape}): Konva.Circle {
        const startPos = TimeConverterService.epochTimeToPixelPosition(item.start, absoluteStartTime, activeViewInHours, activeViewInPixels) + 9;
        const endPos = TimeConverterService.epochTimeToPixelPosition(item.end, absoluteStartTime, activeViewInHours, activeViewInPixels);
        let lastValidKnowPosition = 0;

        return new Konva.Circle({
            x: startPos,
            y: 25,
            width: 15,
            height: 15,
            radius: 7,
            fill: isFilled ? ShapeDraw[item.group_id] : 'white',
            stroke: ShapeDraw[item.group_id],
            strokeWidth: 4,
            draggable: isDraggable && itemPosition !== 0,
            dragBoundFunc: function (pos) {
                if (isDraggable) {
                    const prevCircleItem = stageObjects['circle_' + (itemPosition - 1)] !== undefined ? stageObjects['circle_' + (itemPosition - 1)].getAbsolutePosition().x : 0;
                    const nextCircleItem = stageObjects['circle_' + (itemPosition + 1)] !== undefined ? stageObjects['circle_' + (itemPosition + 1)].getAbsolutePosition().x : endPos;

                    if (pos.x > prevCircleItem && nextCircleItem > pos.x) {
                        lastValidKnowPosition = pos.x;
                        return {
                            x: pos.x,
                            y: this.getAbsolutePosition().y
                        };
                    } else {
                        return {
                            x: lastValidKnowPosition,
                            y: this.getAbsolutePosition().y
                        };
                    }
                }
            }
        });
    }

    public static drawLabelText(item: Stage, absoluteStartTime: number, activeViewInHours: number, activeViewInPixels: number): Konva.Text {
        return new Konva.Text({
            x: TimeConverterService.epochTimeToPixelPosition(item.start, absoluteStartTime, activeViewInHours, activeViewInPixels),
            y: 10,
            text: ShapeDraw[item.group_id],
            fontSize: 10,
            fontFamily: 'Calibri',
            fill: 'black'
        });
    }

    public static drawLabelLine(item: Stage, absoluteStartTime: number, activeViewInHours: number, activeViewInPixels: number): Konva.Line {
        const xPos = TimeConverterService.epochTimeToPixelPosition(item.start, absoluteStartTime, activeViewInHours, activeViewInPixels);
        return new Konva.Line({
            points: [xPos, 10, xPos, 30],
            stroke: 'black',
            strokeWidth: 2,
            lineJoin: 'round',
            dash: [2, 2]
        });
    }

    public static drawLines(item: Stage, absoluteStartTime: number, activeViewInHours: number, activeViewInPixels: number): Shape {
        return new Konva.Line({
            points: [TimeConverterService.epochTimeToPixelPosition(item.start, absoluteStartTime, activeViewInHours, activeViewInPixels), 25, TimeConverterService.epochTimeToPixelPosition(item.end, absoluteStartTime, activeViewInHours, activeViewInPixels), 25],
            stroke: ShapeDraw[item.group_id],
            strokeWidth: 2,
            lineCap: 'round',
            lineJoin: 'round'
        });
    }
}
