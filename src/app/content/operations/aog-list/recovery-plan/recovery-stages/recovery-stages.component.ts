import {AfterViewInit, Component, ElementRef, Inject, OnDestroy, OnInit, ViewChild} from '@angular/core';
import * as Konva from 'konva';
import {MAT_DIALOG_DATA, MatMenuTrigger} from '@angular/material';
import {ShapeDraw} from '../util/shapeDraw';
import {Subscription} from 'rxjs/Subscription';
import {Vector2d} from 'konva';
import {DialogService} from '../../../../_services/dialog.service';
import {AddStageFormComponent, InjectAddStageInterface} from './add-stage-form/add-stage-form.component';
import {RecoveryPlanInterface, RecoveryPlanService, StageInterface} from '../_services/recovery-plan.service';
import {TimeConverter} from '../util/timeConverter';
import {DateRange} from '../../../../../shared/_models/common/dateRange';
import {TimeInstant} from '../../../../../shared/_models/timeInstant';
import moment = require('moment');
import {Stage} from '../../../../../shared/_models/recoveryplan/stage';
import {RecoveryPlanSearch} from '../../../../../shared/_models/recoveryplan/recoveryPlanSearch';
import {Pagination} from '../../../../../shared/_models/common/pagination';
import {Aog} from '../../../../../shared/_models/aog/aog';
import {now} from 'moment';
import {isArray} from 'util';
import {tap} from 'rxjs/operators';
import {Observable} from 'rxjs/Observable';

export interface StyleInterface {
    top: string;
    left: string;
    position: string;
}

export interface LayerInterface {
    base: Konva.Layer;
    lines: Konva.Layer;
    labels?: Konva.Layer;
    circles: Konva.Layer;
}

export interface MenuInterface {
    addGroup: boolean;
    delGroup: boolean;
}

@Component({
    selector: 'lsl-recovery-stages',
    templateUrl: './recovery-stages.component.html',
    styleUrls: ['./recovery-stages.component.scss']
})
export class RecoveryStagesComponent implements OnInit, OnDestroy, AfterViewInit {

    private static TIMELINE_MENU_CLASS = '.timeline-menu';

    @ViewChild('stages') public stages: ElementRef;
    @ViewChild(MatMenuTrigger) trigger: MatMenuTrigger;

    private _stagesSub: Subscription;
    private _menuStyle: StyleInterface;

    private _canvasHeight: number;
    private _lastValidPosition: number;
    private _stagesObjects: StageInterface[];
    private _recoveryPlanSub: Subscription;
    private _recoveryPlanInterface: RecoveryPlanInterface;

    private _konvaStage: Konva.Stage;
    private _konvaLayers: LayerInterface;

    private _menuInterface: MenuInterface;
    private _stagesList: Stage[];
    private _triggerStageInterface: StageInterface;

    constructor(
        private _recoveryPlanService: RecoveryPlanService,
        private _dialogService: DialogService,
        @Inject(MAT_DIALOG_DATA) private _data: Aog
    ) {
        this._canvasHeight = 50;
        this._lastValidPosition = 0;
        this._stagesObjects = [];
        this._menuStyle = { top: '-20px', left: '', position: 'absolute'};
        this._stagesSub = new Subscription();
        this._recoveryPlanSub = new Subscription();
        this._menuInterface = {addGroup: true, delGroup: true };
    }

    ngOnInit() {
        this.stagesSub = this.getStages$().subscribe(() => {
            this.recoveryPlanSub = this.getRecoveryPlanSub();
        });
        this.lastValidPosition = 0;
    }

    private getRecoveryPlanSub(): Subscription {
        return this._recoveryPlanService.recoveryPlanBehavior$
            .filter(rpInterface => rpInterface.recoveryStagesConfig.length > 0)
            .subscribe(rpInterface => {
                this._recoveryPlanInterface = rpInterface;
                if (!this.konvaStage) {
                    this.initTimeline();
                }
            });
    }

    private initTimeline() {
        this.konvaStage = new Konva.Stage({
            container: 'container',
            width: this.recoveryPlanInterface.activeViewInPixels,
            height: this.canvasHeight
        });
        const baseLayer = new Konva.Layer();
        baseLayer.add(ShapeDraw.drawLines(null, 0, this.recoveryPlanInterface.activeViewInPixels));
        const lineLayer = new Konva.Layer();
        const circleLayer = new Konva.Layer();
        const labelLayer = new Konva.Layer();

        this.stagesObjects.forEach((value, index) => {
            const stageInterface = this.getGroupStage(value, index);
            lineLayer.add(stageInterface.line);
            circleLayer.add(stageInterface.circle);
            if (stageInterface.labelLine && stageInterface.labelText) {
                labelLayer.add(stageInterface.labelLine);
                labelLayer.add(stageInterface.labelText);
            }
        });
        this.konvaLayers = {
            base: baseLayer,
            lines: lineLayer,
            labels: labelLayer,
            circles: circleLayer
        };
        Object.keys(this.konvaLayers).forEach(key => this.konvaStage.add(this.konvaLayers[key]));
    }

    ngOnDestroy() {
        this.stagesSub.unsubscribe();
        this.recoveryPlanSub.unsubscribe();
    }

    ngAfterViewInit() {

    }

    public getRecoveryPlanSearch(): RecoveryPlanSearch {
        const recoveryPlanSearch = RecoveryPlanSearch.getInstance();
        recoveryPlanSearch.pagination = Pagination.getInstance();
        recoveryPlanSearch.aogId = this.data.id;
        recoveryPlanSearch.enable = true;
        return recoveryPlanSearch;
    }

    private getStages$(): Observable<Stage[]> {
        return this._recoveryPlanService.getStages$(this.getRecoveryPlanSearch())
            .pipe(
                tap(res => {
                    this.stagesList = res.map(v => v);
                    const epochTime = res[res.length - 1] ? res[res.length - 1].range.toEpochtime : now();
                    const endTimeInstant = new TimeInstant(epochTime, '');
                    res.push(new Stage(RecoveryPlanService.DEFAULT_GROUP, 1, new DateRange(endTimeInstant, endTimeInstant)));
                    this.stagesObjects = res.map(v => ({stage: v, line: null, circle: null}));
                })
        );
    }

    private getGroupStage(stageInterface: StageInterface, index: number): StageInterface {
        let initPosition = 0;
        const interfaceStage = stageInterface.stage;
        const isLastItem = index + 1 === this.stagesObjects.length;
        this.lastValidPosition = 0;
        const startPos = this._recoveryPlanService.getPositionByEpochtime(stageInterface.stage.fromEpochtime);
        const endPos = this._recoveryPlanService.getPositionByEpochtime(stageInterface.stage.toEpochtime);
        const config = this.recoveryPlanInterface.recoveryStagesConfig.find(c => c.code === interfaceStage.code);
        const color = config ? config.color : null;

        stageInterface.line = ShapeDraw.drawLines(color, startPos, endPos);
        stageInterface.circle = ShapeDraw.drawCircle(color, startPos, index > 0);
        stageInterface.labelLine = !isLastItem ? ShapeDraw.drawLabelLine(null, startPos) : null;
        stageInterface.labelText = !isLastItem ? ShapeDraw.drawLabelText(stageInterface.stage.code, startPos) : null;

        stageInterface.circle.dragBoundFunc(pos => this.dragBound(pos, stageInterface, index, isLastItem ? this.recoveryPlanInterface.activeViewInPixels : endPos));
        stageInterface.circle.on('mouseover', () => document.body.style.cursor = 'pointer');
        stageInterface.circle.on('mouseout', () => document.body.style.cursor = 'default');
        stageInterface.circle.on('dblclick', () => {
            this.triggerStageInterface = stageInterface;
            this.triggerMenu(stageInterface.circle.getAbsolutePosition().x, index);
        });
        stageInterface.circle.on('dragstart', () => {
            initPosition = stageInterface.circle.getAbsolutePosition().x;
            if (stageInterface.labelLine && stageInterface.labelText) {
                stageInterface.labelLine.destroy();
                stageInterface.labelText.destroy();
            }
            this.konvaLayers.labels.draw();
        });
        stageInterface.circle.on('dragmove', () => {
            document.body.style.cursor = 'pointer';
            this.stagesObjects
                .forEach((v, i) => {
                    const next = this.stagesObjects[i + 1];
                    v.line.points([
                        v.circle.getAbsolutePosition().x,
                        25,
                        next ? next.circle.getAbsolutePosition().x : v.circle.getAbsolutePosition().x,
                        25
                    ]);
                });
            this.konvaLayers.lines.draw();
            this.konvaLayers.circles.draw();
        });
        stageInterface.circle.on('dragend', () => {
            this.updateDateRange(stageInterface.circle.getAbsolutePosition().x, initPosition, index);
            this.initTimeline();
            console.log(
                moment(stageInterface.stage.fromEpochtime).format('HH:mm') +
                ' - ' +
                moment(stageInterface.stage.toEpochtime).format('HH:mm')
            );
            document.body.style.cursor = 'default';
        });
        return stageInterface;
    }

    private updateDateRange(circlePosX: number, initPosition: number, index: number) {
        const diff = circlePosX - initPosition;
        const ms = TimeConverter.pixelToEpochtime(diff, this.recoveryPlanInterface.hourInPixels);
        const stageSelected = this.stagesObjects[index];
        stageSelected.stage.fromEpochtime += index + 1 !== this.stagesObjects.length ? ms : 0;
        stageSelected.stage.toEpochtime += ms;
        const indexPrev = this.stagesObjects[index - 1];
        indexPrev.stage.toEpochtime = stageSelected.stage.fromEpochtime;
        this.stagesObjects
            .forEach((v, i) => {
                if (i > index) {
                    const prev = this.stagesObjects[i - 1];
                    v.stage.fromEpochtime = prev.stage.toEpochtime;
                    v.stage.toEpochtime += i + 1 !== this.stagesObjects.length ? ms : 0;
                }
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

    private triggerMenu(position: number, index: number) {
        this.trigger.openMenu();
        this.menuInterface.addGroup = index > 0;
        this.menuInterface.delGroup = index > 0 && index < this.stagesObjects.length - 1;
        const el = document.querySelector(RecoveryStagesComponent.TIMELINE_MENU_CLASS);
        if (el) {
            this.menuStyle.left = position.toString().concat('px');
            const style = el['style'];
            Object.keys(this.menuStyle).forEach(key => style[key] = this.menuStyle[key]);
        }
    }

    public addGroup() {
        const injectData: InjectAddStageInterface = { stagesList: this.stagesList, triggerStage: this.triggerStageInterface.stage};
        const ref = this._dialogService.openDialog(AddStageFormComponent, {
            data: injectData,
            hasBackdrop: true,
            disableClose: true,
            height: '220px',
            width: '400px'
        }, AddStageFormComponent.ADD_STAGE_DIALOG_TAG);
        ref.afterClosed()
            .filter(() => !!ref.componentInstance.stage)
            .subscribe(() => {
                const index = this.stagesObjects.findIndex((stage) => stage === this.triggerStageInterface);
                this.stagesObjects.splice(index, 0, {stage: ref.componentInstance.stage, circle: null, line: null});
                this.stagesObjects
                    .forEach((v, i) => {
                        if (i > index) {
                            v.stage.fromEpochtime = this.stagesObjects[i - 1].stage.toEpochtime;
                            v.stage.toEpochtime = this.stagesObjects[i + 1] ?
                                this.stagesObjects[i + 1].stage.fromEpochtime + ref.componentInstance.stage.duration :
                                v.stage.fromEpochtime
                            ;
                        }
                    });
                this.initTimeline();
            });
    }

    public deleteGroup() {
        const index = this.stagesObjects.findIndex((stage) => stage === this.triggerStageInterface);
        this.stagesObjects.splice(index, 1);
        this.stagesObjects
            .forEach((v, i) => {
                if (i >= index) {
                    v.stage.fromEpochtime = this.stagesObjects[i - 1].stage.toEpochtime;
                    v.stage.toEpochtime = this.stagesObjects[i + 1] ?
                        v.stage.toEpochtime - this.triggerStageInterface.stage.duration :
                        v.stage.fromEpochtime
                    ;
                }
            });
        this.initTimeline();
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

    get recoveryPlanInterface(): RecoveryPlanInterface {
        return this._recoveryPlanInterface;
    }

    get stagesObjects(): StageInterface[] {
        return this.recoveryPlanInterface.planStagesInterfaces;
    }

    set stagesObjects(value: StageInterface[]) {
        this._recoveryPlanService.planStagesInterfaces = value;
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

    get konvaStage(): Konva.Stage {
        return this._konvaStage;
    }

    set konvaStage(value: Konva.Stage) {
        this._konvaStage = value;
    }

    get konvaLayers(): LayerInterface {
        return this._konvaLayers;
    }

    set konvaLayers(value: LayerInterface) {
        this._konvaLayers = value;
    }

    get menuInterface(): MenuInterface {
        return this._menuInterface;
    }

    set menuInterface(value: MenuInterface) {
        this._menuInterface = value;
    }

    get stagesList(): Stage[] {
        return this._stagesList;
    }

    set stagesList(value: Stage[]) {
        this._stagesList = isArray(value) ? value.map(v => Object.assign(Stage.getInstance(), v)) : [];
    }

    get recoveryPlanSub(): Subscription {
        return this._recoveryPlanSub;
    }

    set recoveryPlanSub(value: Subscription) {
        this._recoveryPlanSub = value;
    }

    get triggerStageInterface(): StageInterface {
        return this._triggerStageInterface;
    }

    set triggerStageInterface(value: StageInterface) {
        this._triggerStageInterface = value;
    }

    get data(): Aog {
        return this._data;
    }
}
