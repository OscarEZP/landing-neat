import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {Observable} from 'rxjs/Observable';
import * as Konva from 'konva';
import {TimeConverter} from '../util/timeConverter';
import {ApiRestService} from '../../../../../shared/_services/apiRest.service';
import {catchError, map, tap} from 'rxjs/operators';
import {LogService} from '../../../../_services/log.service';
import {Stage} from '../../../../../shared/_models/recoveryplan/stage';
import {StageConfiguration} from '../../../../../shared/_models/recoveryplan/stageConfiguration';
import {RecoveryPlanSearch} from '../../../../../shared/_models/recoveryplan/recoveryPlanSearch';
import {RecoveryPlan} from '../../../../../shared/_models/recoveryplan/recoveryPlan';
import moment = require('moment');

export interface RecoveryPlanInterface {
    activeViewInPixels: number;
    activeViewInHours: number;
    relativeStartTime: number;
    relativeEndTime: number;
    absoluteStartTime: number;
    recoveryStagesConfig: StageConfiguration[];
    hourInPixels: number;
    planStagesInterfaces: StageInterface[];
    utcNow: number;
}

export interface StageInterface {
    line: Konva.Line;
    circle: Konva.Circle;
    stage: Stage;
    labelText?: Konva.Text;
    labelLine?: Konva.Line;
}

@Injectable()
export class RecoveryPlanService {

    public static DEFAULT_GROUP = 'GRAY';
    private static RECOVERY_STAGE_ENDPOINT = 'recoveryStage';
    private static RECOVERY_PLAN_ENDPOINT = 'recoveryPlan';
    private static RECOVERY_PLAN_SEARCH_ENDPOINT = 'recoveryPlanSearch';
    private _recoveryPlanBehavior: BehaviorSubject<RecoveryPlanInterface>;
    private _recoveryPlanBehavior$: Observable<RecoveryPlanInterface>;

    constructor(
        private _logService: LogService,
        private _apiRestService: ApiRestService
    ) {
        this._recoveryPlanBehavior = new BehaviorSubject<RecoveryPlanInterface>(this.newRecoveryPlanService);
        this._recoveryPlanBehavior$ = this._recoveryPlanBehavior.asObservable();
    }

    getStages$(aogSearch: RecoveryPlanSearch): Observable<Stage[]> {
        return this._apiRestService.search<RecoveryPlan[]>(RecoveryPlanService.RECOVERY_PLAN_SEARCH_ENDPOINT, aogSearch)
            .pipe(
                map(res => res.length > 0 ? res[0].stages.map(v => Object.assign(Stage.getInstance(), v)) : [])
            );
    }

    /**
     * Generate a new defined interface with 0 values to allow set later
     */
    private get newRecoveryPlanService(): RecoveryPlanInterface {
        return {
            activeViewInPixels: 0,
            activeViewInHours: 0,
            relativeStartTime: 0,
            relativeEndTime: 0,
            absoluteStartTime: 0,
            hourInPixels: 0,
            recoveryStagesConfig: [],
            planStagesInterfaces: [],
            utcNow: 0
        };
    }

    /**
     * Find Recovery Stage Configuration
     * @returns {Observable<any>}
     */
    public getRecoveryStageConfig(): Observable<any> {
        return this._apiRestService
            .getAll<StageConfiguration[]>(RecoveryPlanService.RECOVERY_STAGE_ENDPOINT)
            .pipe(
                tap((res: StageConfiguration[]) => this.log('fetched recoveryStage')),
                catchError(this.handleError('recoveryStage'))
            );
    }

    /**
     * Save the recovery plan
     * @param signature recoveryPlan model
     */
    public saveRecovery(signature: RecoveryPlan): Promise<void> {
        return this._apiRestService
            .add<void>(RecoveryPlanService.RECOVERY_PLAN_ENDPOINT, signature).toPromise();
    }

    public getPositionByEpochtime(epochtime: number) {
        return TimeConverter.epochTimeToPixelPosition(
            epochtime,
            this.getRecoveryPlanService().absoluteStartTime,
            this.getRecoveryPlanService().activeViewInHours,
            this.getRecoveryPlanService().activeViewInPixels
        );
    }

    /**
     * Write a log if there is an error and throw an error
     * @param {string} operation
     * @returns {(error: any) => Observable<T>}
     */
    private handleError<T>(operation = 'operation') {
        return (error: any): Observable<T> => {
            this.log(`${operation} failed: ${error.message}`);
            return Observable.throw(error);
        };
    }

    private log(message: string) {
        this._logService.add('Recovery plan Service: ' + message);
    }

    get recoveryPlanBehavior$(): Observable<RecoveryPlanInterface> {
        return this._recoveryPlanBehavior$;
    }

    private getRecoveryPlanService(): RecoveryPlanInterface {
        return this._recoveryPlanBehavior.getValue();
    }

    public emitData() {
        this._recoveryPlanBehavior.next(this.getRecoveryPlanService());
    }

    set activeViewInPixels(value: number) {
        this.getRecoveryPlanService().activeViewInPixels = value;
        this.emitData();
    }

    set relativeStartTime(value: number) {
        this.getRecoveryPlanService().relativeStartTime = value;
        this.emitData();
    }

    set relativeEndTime(value: number) {
        console.log('relativeEndTime: ', value);
        console.log('relativeEndTime formatted: ', moment.utc(value).format('DD/MM/YYYY HH:mm'));
        this.getRecoveryPlanService().relativeEndTime = value;
        this.emitData();
    }

    set activeViewInHours(value: number) {
        this.getRecoveryPlanService().activeViewInHours = value;
        this.emitData();
    }

    set recoveryStagesConfig(value: StageConfiguration[]) {
        this.getRecoveryPlanService().recoveryStagesConfig = value;
        this.emitData();
    }

    set absoluteStartTime(value: number) {
        this.relativeStartTime = value;
        this.getRecoveryPlanService().absoluteStartTime = TimeConverter.absoluteStartTime(value);
        this.emitData();
    }

    set hourInPixels(value: number) {
        this.getRecoveryPlanService().hourInPixels = value;
        this.emitData();
    }

    set planStagesInterfaces(value: StageInterface[]) {
        this.getRecoveryPlanService().planStagesInterfaces = value;
        this.emitData();
    }

    set utcNow(value: number) {
        console.log('utc now set: ', value);
        this.getRecoveryPlanService().utcNow = value;
        this.emitData();
    }

}
