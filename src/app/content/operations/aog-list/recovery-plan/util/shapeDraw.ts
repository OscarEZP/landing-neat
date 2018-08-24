import {Injectable} from '@angular/core';
import * as Konva from 'konva';
import moment = require('moment');
import {TimeConverter} from './timeConverter';
import {Stage} from '../../../../../shared/_models/recoveryplan/stage';

@Injectable()
export class ShapeDraw {

    public static DEFAULT_COLOR = '#CCC';

    constructor() {}

    public static drawCircle(color: string, startPos: number, isDraggable: boolean = true, isFilled: boolean = false): Konva.Circle {
        color = color ? color : ShapeDraw.DEFAULT_COLOR;
        return new Konva.Circle({
            x: startPos,
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

    public static drawLabelText(text: string, xPos: number): Konva.Text {
        return new Konva.Text({
            x: xPos + 6,
            y: 2,
            text: text,
            fontSize: 12,
            fontFamily: 'Calibri',
            fill: 'black'
        });
    }

    public static drawLabelLine(color: string, xPos: number): Konva.Line {
        color = color ? color : ShapeDraw.DEFAULT_COLOR;
        return new Konva.Line({
            points: [xPos, 4, xPos, 30],
            stroke: color,
            strokeWidth: 2,
            lineJoin: 'round',
            dash: [2, 2]
        });
    }

    public static drawLines(color: string, startPos: number, endPos: number): Konva.Line {
        color = color ? color : ShapeDraw.DEFAULT_COLOR;
        return new Konva.Line({
            points: [startPos, 25, endPos, 25],
            stroke: color,
            strokeWidth: 4,
            lineCap: 'round',
            lineJoin: 'round'
        });
    }

    public static drawTimeBox(startTime: number, xStartPosition: number, xEndPosition: number, isHour: boolean, isLast: boolean): Konva.Group {

        const timeBoxGroup = new Konva.Group({
            x: xStartPosition,
            y: isHour ? 0 : 20
        });

        const box = ShapeDraw.drawBox(xStartPosition, xEndPosition);
        const text = ShapeDraw.drawText(xStartPosition, xEndPosition, isHour, isLast, startTime);

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

    private static drawText(xStartPosition: number, xEndPosition: number, isHour: boolean, isLast: boolean, epoch: number): Konva.Text {

        return new Konva.Text({
            x: isHour ? (xEndPosition - xStartPosition) * 0.3 : 15,
            y: 4,
            text: isHour ? moment.utc(epoch).minute(0).format('HH:mm') : moment.utc(epoch).subtract(isLast ? 0 : 1, 'd').format('DD-MMM-YYYY'),
            fontSize: 12,
            fontFamily: 'Calibri',
            fill: 'black'
        });
    }
}
