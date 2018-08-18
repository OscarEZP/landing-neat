import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {Observable} from 'rxjs/Observable';
import * as Konva from 'konva';
import {TimeConverter} from '../util/timeConverter';
import {ApiRestService} from '../../../../../shared/_services/apiRest.service';
import {catchError, map, tap} from 'rxjs/operators';
import {LogService} from '../../../../_services/log.service';
import {DateRange} from '../../../../../shared/_models/common/dateRange';
import {TimeInstant} from '../../../../../shared/_models/timeInstant';
import {Stage} from '../../../../../shared/_models/recoveryplan/stage';
import {StageConfiguration} from '../../../../../shared/_models/recoveryplan/stageConfiguration';
import {RecoveryPlanSearch} from '../../../../../shared/_models/recoveryplan/recoveryPlanSearch';
import {RecoveryPlan} from '../../../../../shared/_models/recoveryplan/recoveryPlan';

export interface RecoveryPlanInterface {
    activeViewInPixels: number;
    activeViewInHours: number;
    relativeStartTime: number;
    absoluteStartTime: number;
    recoveryStagesConfig: StageConfiguration[];
    hourInPixels: number;
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

    private static RECOVERY_STAGE_ENDPOINT = 'recoveryStage';
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
                map(res => {
                    if (res.length > 0) {
                        return res[0].stages.map(v => Object.assign(Stage.getInstance(), v));
                    } else {
                        const aogCreationTime = this.getRecoveryPlanService().relativeStartTime;
                        let initTime = aogCreationTime;
                        const baseArr = ['ACC', 'EVA', 'SUP', 'EXE']
                            .map(v => {
                                const endTime = TimeConverter.temporalAddHoursToTime(initTime, 2);
                                const stage = new Stage(
                                    v,
                                    1,
                                    new DateRange(new TimeInstant(initTime, ''), new TimeInstant(endTime, ''))
                                );
                                initTime = endTime;
                                return stage;
                            });
                        return baseArr;
                    }
                })
            );
    }

    private get newRecoveryPlanService(): RecoveryPlanInterface {
        return {
            activeViewInPixels: 0,
            activeViewInHours: 0,
            relativeStartTime: 0,
            absoluteStartTime: 0,
            hourInPixels: 0,
            recoveryStagesConfig: []
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
                tap((res: StageConfiguration[]) => {
                    this.log('fetched recoveryStage');
                }),
                catchError(this.handleError('recoveryStage'))
            );
    }

    public resetService() {
        this.recoveryPlanInterface = this.newRecoveryPlanService;
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

    set recoveryPlanInterface(value: RecoveryPlanInterface) {
        this._recoveryPlanBehavior.next(value);
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
        this.absoluteStartTime = value;
        this.getRecoveryPlanService().relativeStartTime = value;
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

    private set absoluteStartTime(value: number) {
        this.getRecoveryPlanService().absoluteStartTime = TimeConverter.absoluteStartTime(value);
        this.emitData();
    }

    set hourInPixels(value: number) {
        this.getRecoveryPlanService().hourInPixels = Math.round(value);
        this.emitData();
    }

}
