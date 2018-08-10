import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {Observable} from 'rxjs/Observable';
import {TimeConverterService} from './time-converter.service';
import * as Konva from 'konva';
import {Stage} from '../../../../../shared/_models/aog/Stage';

export interface RecoveryPlanInterface {
    activeViewInPixels: number;
    activeViewInHours: number;
    relativeStartTime: number;
    absoluteStartTime: number;
    referenceFrameInPixels: number;
}

export interface StageInterface {
    line: Konva.Line;
    circle: Konva.Circle;
    stage: Stage;
    labelText: Konva.Text;
    labelLine: Konva.Line;
}

@Injectable()
export class RecoveryPlanService {

    private _recoveryPlanBehavior: BehaviorSubject<RecoveryPlanInterface>;
    private _recoveryPlanBehavior$: Observable<RecoveryPlanInterface>;

    constructor() {
        this._recoveryPlanBehavior = new BehaviorSubject<RecoveryPlanInterface>(this.newRecoveryPlanService);
        this._recoveryPlanBehavior$ = this._recoveryPlanBehavior.asObservable();
    }

    private get newRecoveryPlanService(): RecoveryPlanInterface {
        return {
            activeViewInPixels: 0,
            activeViewInHours: 0,
            relativeStartTime: 0,
            absoluteStartTime: 0,
            referenceFrameInPixels: 0
        };
    }

    get recoveryPlanBehavior$(): Observable<RecoveryPlanInterface> {
        return this._recoveryPlanBehavior$;
    }

    set recoveryPlanInterface(value: RecoveryPlanInterface) {
        this._recoveryPlanBehavior.next(value);
    }

    private getRecoveryPlanService(): RecoveryPlanInterface {
        return this._recoveryPlanBehavior.getValue();
    }

    set activeViewInPixels(value: number) {
        this.getRecoveryPlanService().activeViewInPixels = value;
    }

    set relativeStartTime(value: number) {
        this.absoluteStartTime = value;
        this.getRecoveryPlanService().relativeStartTime = value;
    }

    set activeViewInHours(value: number) {
        this.getRecoveryPlanService().activeViewInHours = value;
    }

    private set absoluteStartTime(value: number) {
        this.getRecoveryPlanService().absoluteStartTime = TimeConverterService.absoluteStartTime(value);
    }
}
