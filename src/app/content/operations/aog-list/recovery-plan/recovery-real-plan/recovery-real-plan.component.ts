import {AfterViewInit, Component, ElementRef, ViewChild} from '@angular/core';
import {Observable} from 'rxjs/Observable';

@Component({
  selector: 'lsl-recovery-real-plan',
  templateUrl: './recovery-real-plan.component.html',
  styleUrls: ['./recovery-real-plan.component.css']
})
export class RecoveryRealPlanComponent implements AfterViewInit {

    @ViewChild('canvas') public canvas: ElementRef;

    private static ACC = '#4CAF50';
    private static EVA = '#FFA726';
    private static SUP = '#0A85C0';
    private static EXE = '#9575CD';
    private static RED = 'red';
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

    private drawRealPlan() {

        this.drawLine(10, 18, RecoveryRealPlanComponent.GRAY, 200);
        this.drawLine(210, 18, RecoveryRealPlanComponent.RED, 60);
        this.drawLine(270, 18, RecoveryRealPlanComponent.ACC, 200);

        this.drawCircle(10, 18, RecoveryRealPlanComponent.ACC, false);
        this.drawCircle(210, 18, RecoveryRealPlanComponent.ACC, true);
        this.drawRect(260, 10, RecoveryRealPlanComponent.ACC, false, true);
    }

    private drawLine(xPos: number, yPos: number, type: string, width: number): void {
        this.cx.beginPath();
        this.cx.moveTo(xPos, yPos);
        this.cx.lineTo(xPos + width, yPos);
        this.cx.lineWidth = 4;
        this.cx.strokeStyle = type;
        this.cx.stroke();
    }

    private drawCircle(xPos: number, yPos: number, type: string, isFulfilled: boolean): void {
        this.cx.beginPath();
        this.cx.fillStyle = type;
        this.cx.arc(xPos, yPos, 10, 0, Math.PI * 2);
        this.cx.fill();

        if (!isFulfilled) {
            this.cx.beginPath();
            this.cx.fillStyle = '#FFF';
            this.cx.arc(xPos, yPos, 7, 0, Math.PI * 2);
            this.cx.fill();
        }
    }

    private drawRect(xPos: number, yPos: number, type: string, isFulfilled: boolean, isRotated: boolean): void {
        const width = 15, height = 15;
        this.cx.save();

        if (isRotated) {
            this.cx.beginPath();
            this.cx.translate(xPos + width / 2, yPos + height / 2);
            this.cx.rotate(45 * Math.PI / 180);
            this.cx.rect (-width / 2, -height / 2, width, height);
            this.cx.fillStyle = type;
            this.cx.fill();
        } else {
            this.cx.beginPath();
            this.cx.rect(xPos, yPos, 200, 4);
            this.cx.fillStyle = type;
            this.cx.fill();
        }

        if (!isFulfilled) {
            this.cx.beginPath();
            this.cx.translate(xPos + (width - 2) / 2, yPos + (height - 2) / 2);
            this.cx.rotate(45 * Math.PI / 180);
            this.cx.rect (-(width - 2) / 2, -(height - 2) / 2, width, height);
            this.cx.fillStyle = '#FFF';
            this.cx.fill();
        }

        this.cx.restore();

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
