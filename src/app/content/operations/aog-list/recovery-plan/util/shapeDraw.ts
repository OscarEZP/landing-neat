import {Injectable} from '@angular/core';
import * as Konva from 'konva';
import {Stage} from '../../../../../shared/_models/aog/Stage';
import moment = require('moment');
import {TimeConverter} from './timeConverter';

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

    public static drawCircle(groupId: string, startPos: number, isDraggable: boolean = true, isFilled: boolean = false): Konva.Circle {
        return new Konva.Circle({
            x: startPos + 8.9,
            y: 25,
            width: 15,
            height: 15,
            radius: 7,
            fill: isFilled ? ShapeDraw[groupId] : 'white',
            stroke: ShapeDraw[groupId],
            strokeWidth: 4,
            draggable: isDraggable
        });
    }

    public static drawLabelText(item: Stage, absoluteStartTime: number, activeViewInHours: number, activeViewInPixels: number): Konva.Text {
        return new Konva.Text({
            x: TimeConverter.epochTimeToPixelPosition(item.fromEpochtime, absoluteStartTime, activeViewInHours, activeViewInPixels) + 5,
            y: 2,
            text: item.code,
            fontSize: 12,
            fontFamily: 'Calibri',
            fill: 'black'
        });
    }

    public static drawLabelLine(item: Stage, absoluteStartTime: number, activeViewInHours: number, activeViewInPixels: number): Konva.Line {
        const xPos = TimeConverter.epochTimeToPixelPosition(item.fromEpochtime, absoluteStartTime, activeViewInHours, activeViewInPixels);
        return new Konva.Line({
            points: [xPos, 4, xPos, 30],
            stroke: 'black',
            strokeWidth: 2,
            lineJoin: 'round',
            dash: [2, 2]
        });
    }

    public static drawLines(groupId: string, startPos: number, endPos: number, isAbsolute: boolean = true): Konva.Line {
        return new Konva.Line({
            points: [startPos, 25, endPos, 25],
            stroke: ShapeDraw[isAbsolute ? groupId : groupId + '_PROJ'],
            strokeWidth: 2,
            lineCap: 'round',
            lineJoin: 'round'
        });
    }

    public static drawTimeBox(startTime: number, endTime: number, isHour: boolean, absoluteStartTime: number, activeViewInHours: number, activeViewInPixels: number): Konva.Group {
        const  xStartPos = TimeConverter.epochTimeToPixelPosition(startTime, absoluteStartTime, activeViewInHours, activeViewInPixels);
        const xEndPos = TimeConverter.epochTimeToPixelPosition(endTime, absoluteStartTime, activeViewInHours, activeViewInPixels);

        const timeBoxGroup = new Konva.Group({
            x: xStartPos,
            y: isHour ? 0 : 20
        });

        const box = ShapeDraw.drawBox(xStartPos, xEndPos);
        const text = ShapeDraw.drawText(xStartPos, xEndPos, isHour, startTime);

        timeBoxGroup.add(box).add(text);

        return timeBoxGroup;
    }

    private static drawBox(startTime: number, endTime: number): Konva.Rect {
        return new Konva.Rect({
            x: 0,
            y: 0,
            width: endTime - startTime,
            height: 20,
            fill: 'white',
            stroke: 'black',
            strokeWidth: 1
        });
    }

    private static drawText(startTime: number, endTime: number, isHour: boolean, epoch: number): Konva.Text {
        return new Konva.Text({
            x: 15,
            y: 4,
            text: moment(epoch).minute(0).format(isHour ? 'HH:mm' : 'DD-MMM-YYYY'),
            fontSize: 12,
            fontFamily: 'Calibri',
            fill: 'black'
        });
    }
}
