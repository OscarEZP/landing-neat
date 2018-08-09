import {AfterViewInit, Component, ElementRef, ViewChild} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import * as moment from 'moment';

@Component({
  selector: 'lsl-recovery-real-plan',
  templateUrl: './recovery-real-plan.component.html',
  styleUrls: ['./recovery-real-plan.component.css']
})
export class RecoveryRealPlanComponent implements AfterViewInit {

    @ViewChild('canvas') public canvas: ElementRef;

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

    private cx: CanvasRenderingContext2D;

    private _lineWidth: number;
    private _lineThickness: number;
    private _lineColor: string;

    constructor() {
        this._canvasWidth = 1000;
        this._canvasHeight = 100;
        this._lineWidth = 10;
        this._lineThickness = 3;
        this._lineColor = 'black';
    }

    public ngAfterViewInit() {
        this.canvasWidth = this.canvas.nativeElement.parentNode.offsetWidth;
        const canvasEl: HTMLCanvasElement = this.canvas.nativeElement;

        this.cx = canvasEl.getContext('2d');

        canvasEl.width = this.canvasWidth;
        canvasEl.height = this.canvasHeight;

        this.cx.lineWidth = this.lineWidth;
        this.cx.lineCap = 'round';
        this.cx.strokeStyle = this.lineColor;

        // this.captureEvents(canvasEl);
        this.drawRealPlan();
    }

    private timeExperiment(): void {
        const now = moment.now();
        const later = moment.unix(1533254400);
        const duration = moment.duration(later.diff(now));
        console.log(duration.asHours());
    }

    private drawRealPlan() {

        this.drawLine(10, 38, 90, 38, RecoveryRealPlanComponent.GRAY, 4, 0, 0);

        this.drawLine(270, 38, 270, 8, '#343434', 2, 4, 5);
        this.drawText('ACC', 274, 15, true);

        this.drawLine(90, 38, 270, 38, RecoveryRealPlanComponent.NI, 4,  0, 0 );
        this.drawLine(270, 38, 430, 38, RecoveryRealPlanComponent.ACC, 4,  0, 0);
        this.drawLine(430, 38, 470, 38, RecoveryRealPlanComponent.ACC_PROJ, 4,  0, 0);

        this.drawLine(470, 38, 1500, 38,  RecoveryRealPlanComponent.SUP_PROJ, 4, 0, 0);
        this.drawLine(470, 38, 470, 8, '#343434', 2, 4, 5);
        this.drawText('SUP', 474, 15, true);

        // this.drawCircle(60, 38, RecoveryRealPlanComponent.ACC, false);
        this.drawCircle(270, 38, RecoveryRealPlanComponent.ACC, true);
        this.drawCircle(470, 38, RecoveryRealPlanComponent.SUP_PROJ, false);

        this.drawTriangle(330, 22, RecoveryRealPlanComponent.NI, 'NI');

        this.timeExperiment();
    }

    private drawLine(xStartPos: number, yStartPos: number, xEndPos: number, yEndPos: number, type: string, lineWidth: number, dash: number, space: number): void {

        this.cx.save();

        if (dash > 0) {
            this.cx.setLineDash([dash, space]);
        }

        this.cx.beginPath();
        this.cx.moveTo(xStartPos, yStartPos);

        this.cx.lineTo(xEndPos , yEndPos);
        this.cx.lineWidth = lineWidth;
        this.cx.strokeStyle = type;
        this.cx.stroke();

        this.cx.restore();
    }

    private drawTriangle(xPos: number, yPos: number, type: string, stringType: string) {
        this.cx.save();

        this.cx.beginPath();

        this.cx.moveTo(xPos, yPos);
        this.cx.lineTo(xPos + 15, yPos);
        this.cx.lineTo(xPos + 7, yPos + 10);
        this.cx.closePath();
        this.cx.fillStyle = type;
        this.cx.fill();

        this.drawText(stringType, xPos + 2, yPos - 5, true);

        this.cx.restore();
    }

    private drawCircle(xPos: number, yPos: number, type: string, isFilled: boolean): void {
        this.cx.beginPath();
        this.cx.fillStyle = type;
        this.cx.arc(xPos, yPos, 10, 0, Math.PI * 2);
        this.cx.fill();

        if (!isFilled) {
            this.cx.beginPath();
            this.cx.fillStyle = '#FFF';
            this.cx.arc(xPos, yPos, 7, 0, Math.PI * 2);
            this.cx.fill();
        }
    }

    private drawRect(xPos: number, yPos: number, type: string, width: number, height: number, isFilled: boolean, angle: number): void {
        this.cx.save();

        this.cx.beginPath();
        this.cx.translate(xPos + width / 2, yPos + height / 2);
        this.drawRotate(angle);
        this.cx.rect (-width / 2, -height / 2, width, height);
        this.cx.fillStyle = type;
        this.cx.fill();
        this.cx.restore();

        if (!isFilled) {
            this.cx.save();
            this.cx.beginPath();
            this.cx.translate(xPos + (width) / 2, yPos + (height) / 2);
            this.drawRotate(angle);
            this.cx.rect (-(width - 6) / 2, -(height - 6) / 2, width - 6, height - 6);
            this.cx.fillStyle = '#FFF';
            this.cx.fill();
            this.cx.restore();
        }

    }

    private drawText(text: string, xPos: number, yPos: number, isFilled) {
        const fontType = '11px Arial';
        this.cx.save();
        this.cx.font = fontType;

        if (isFilled) {
            this.cx.fillText(text, xPos, yPos);
        } else {
            this.cx.strokeText(text, xPos, yPos);
        }

        this.cx.restore();
    }

    private drawRotate (angle: number) {
        this.cx.rotate(angle * Math.PI / 180);
    }

    private captureEvents(canvasEl: HTMLCanvasElement) {
        Observable
            .fromEvent(canvasEl, 'mousedown')
            .switchMap((e) => {
                return Observable
                    .fromEvent(canvasEl, 'mousemove')
                    .takeUntil(Observable.fromEvent(canvasEl, 'mouseUp'))
                    .takeUntil(Observable.fromEvent(canvasEl, 'mouseleave'))
                    .pairwise();
            })
            .subscribe((res: [MouseEvent, MouseEvent]) => {
                const rect = canvasEl.getBoundingClientRect();

                const prevPos = {
                    x: res[0].clientX - rect.left,
                    y: res[0].clientY - rect.top
                };

                const currentPos = {
                    x: res[1].clientX - rect.left,
                    y: res[1].clientY - rect.top
                };

                this.drawOnCanvas(prevPos, currentPos);
            });
    }

    private drawOnCanvas(prevPos: {x: number, y: number}, currentPos: {x: number, y: number}) {

        if (!this.cx) {
            return;
        }

        this.cx.beginPath();

        if (prevPos) {
            this.cx.moveTo(prevPos.x, prevPos.y);

            this.cx.lineTo(currentPos.x, currentPos.y);

            this.cx.stroke();
        }
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

    get lineWidth(): number {
        return this._lineWidth;
    }

    set lineWidth(value: number) {
        this._lineWidth = value;
    }

    get lineThickness(): number {
        return this._lineThickness;
    }

    set lineThickness(value: number) {
        this._lineThickness = value;
    }

    get lineColor(): string {
        return this._lineColor;
    }

    set lineColor(value: string) {
        this._lineColor = value;
    }

}
