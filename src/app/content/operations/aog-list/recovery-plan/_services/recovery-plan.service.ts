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
import {KanbanCardInterface} from '../kanban/_services/kanban.service';

/**
 * Interface needed by all the components to do their work
 * - activeViewInPixels stores the size of pixels of the container that represent the visible area available.
 * - activeViewInHours keep the value in hours of the scale, by default starts at 24 (24, 48, 96 or 192 are the available values at the moment of write this documentation.
 * - relativeStartTime store the value of the start time (is an epoch value) of the stage elements.
 * - relativeEndTime store the value of the end time (is an epoch value) of the stage elements, but also could be the now() time in utc if this value in greater than the last end time.
 * - absoluteStartTime transform the relativeStartTime reducing the minutes to 0 (zero) to grant the first element of time slots start at this value, also defines the begin of the recovery plan time.
 * - absoluteEndTime transform the relativeEndTime reducing the minutes to 0 (zero) and adding one hour to grant the last element of time slots ends with this value, also defines the end of the recovery plan time.
 * - recoveryStagesConfig
 * - slotSizeInPixels stores the value in pixels of one element (slot) accordingly with the scale of the available with of the view divided by 24.
 * - planStagesInterfaces
 * - utcNow store the value of clock retrieved from AOG's todolist when the modal is opened
 *
 */
export interface RecoveryPlanInterface {
    activeViewInPixels: number;
    activeViewInHours: number;
    relativeStartTime: number;
    relativeEndTime: number;
    absoluteStartTime: number;
    absoluteEndTime: number;
    recoveryStagesConfig: StageConfiguration[];
    slotSizeInPixels: number;
    planStagesInterfaces: StageInterface[];
    utcNow: number;
    version: number;
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
                tap(res => this.version = res[0].revision),
                map(res => res.length > 0 ? res[0].stages.map(v => Object.assign(Stage.getInstance(), v)) : [])
            );
    }

    /**
     * Generate a new defined interface with 0 values to allow set later
     */
    private get newRecoveryPlanService(): RecoveryPlanInterface {
        return {
            activeViewInPixels: 0,
            activeViewInHours: 24,
            relativeStartTime: 0,
            relativeEndTime: 0,
            absoluteStartTime: 0,
            absoluteEndTime: 0,
            slotSizeInPixels: 0,
            recoveryStagesConfig: [],
            planStagesInterfaces: [],
            utcNow: 0,
            version: 0
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

    /**
     * Observable for get activities (todo: implement service and delete mock)
     * @returns {Observable<any>}
     */
    get activities$(): Observable<KanbanCardInterface[]> {
        const activites = [
            this.getMockCard('ACC'),
            this.getMockCard('EXE')
        ];
        return Observable.of(activites);
    }

    private getMockCard(code: string): KanbanCardInterface {
        return {
            stageCode: code,
            activity: '',
            unit: 'PRO',
            isAlternative: true,
            color: code === 'ACC' ? '#4CAF50' : '#9575CD',
            id: 'mock'.concat(Math.random().toString(36).substring(7))
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
        this.getRecoveryPlanService().relativeEndTime = value;
        this.absoluteEndTime = value;
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

    set absoluteEndTime(value: number) {
        this.getRecoveryPlanService().absoluteEndTime = TimeConverter.absoluteEndTime(value + this.getRecoveryPlanService().activeViewInHours * 3600000);
        this.emitData();
    }

    set slotSizeInPixels(value: number) {
        this.getRecoveryPlanService().slotSizeInPixels = value;
        this.emitData();
    }

    set planStagesInterfaces(value: StageInterface[]) {
        this.getRecoveryPlanService().planStagesInterfaces = value;
        this.emitData();
    }

    set utcNow(value: number) {
        this.getRecoveryPlanService().utcNow = value;
        this.emitData();
    }

    set version(value: number) {
        this.getRecoveryPlanService().version = value;
        this.emitData();
    }

}
