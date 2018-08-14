import {Injectable} from '@angular/core';
import * as Konva from 'konva';
import {Stage} from '../../../../../shared/_models/aog/Stage';
import moment = require('moment');
import {TimeConverter} from './timeConverter';

@Injectable()
export class ShapeDraw {

    constructor() {}

    public static drawCircle(color: string, startPos: number, isDraggable: boolean = true, isFilled: boolean = false): Konva.Circle {
        return new Konva.Circle({
            x: startPos + 8.9,
            y: 25,
            width: 15,
            height: 15,
            radius: 7,
            fill: isFilled ? color : 'white',
            stroke: color,
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

    public static drawLines(color: string, startPos: number, endPos: number): Konva.Line {
        return new Konva.Line({
            points: [startPos, 25, endPos, 25],
            // stroke: ShapeDraw[isAbsolute ? groupId : groupId + '_PROJ'],
            stroke: color,
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
