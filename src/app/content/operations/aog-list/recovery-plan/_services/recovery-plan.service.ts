import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {Observable} from 'rxjs/Observable';
import * as Konva from 'konva';
import {Stage} from '../../../../../shared/_models/aog/Stage';
import {TimeConverter} from '../util/timeConverter';
import {ApiRestService} from '../../../../../shared/_services/apiRest.service';
import {RecoveryStage} from '../../../../../shared/_models/aog/RecoveryStage';
import {catchError, tap} from 'rxjs/operators';
import {HttpClient} from '@angular/common/http';
import {LogService} from '../../../../_services/log.service';

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
    labelText?: Konva.Text;
    labelLine?: Konva.Line;
}

@Injectable()
export class RecoveryPlanService {

    private static RECOVERY_STAGE = 'recoveryStage';
    private _apiService: ApiRestService;
    private _recoveryPlanBehavior: BehaviorSubject<RecoveryPlanInterface>;
    private _recoveryPlanBehavior$: Observable<RecoveryPlanInterface>;

    constructor(private http: HttpClient,
                private logService: LogService) {
        this.apiService = new ApiRestService(this.http);
        this._recoveryPlanBehavior = new BehaviorSubject<RecoveryPlanInterface>(this.newRecoveryPlanService);
        this._recoveryPlanBehavior$ = this._recoveryPlanBehavior.asObservable();
    }

    // TO-DO: Implement service
    get stages$(): Observable<Stage[]> {
        const aogCreationTime = this._recoveryPlanBehavior.getValue().relativeStartTime;
        return Observable.of([
            new Stage(0, 0, 'ACC', TimeConverter.temporalAddHoursToTime(aogCreationTime, 0), TimeConverter.temporalAddHoursToTime(aogCreationTime, 2)),
            new Stage(0, 0, 'EVA', TimeConverter.temporalAddHoursToTime(aogCreationTime, 2), TimeConverter.temporalAddHoursToTime(aogCreationTime, 4)),
            new Stage(0, 0, 'SUP', TimeConverter.temporalAddHoursToTime(aogCreationTime, 4), TimeConverter.temporalAddHoursToTime(aogCreationTime, 7)),
            new Stage(0, 0, 'EXE', TimeConverter.temporalAddHoursToTime(aogCreationTime, 7), TimeConverter.temporalAddHoursToTime(aogCreationTime, 10)),
        ]);
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

    /**
     * Find Recovery Stage Configuration
     * @returns {Observable<any>}
     */
    public findRecoveryStageConf(): Observable<any> {
        return this.apiService
            .getAll<RecoveryStage[]>(RecoveryPlanService.RECOVERY_STAGE)
            .pipe(
                tap((x: RecoveryStage[]) => {
                    this.log('fetched recoveryStage');
                }),
                catchError(this.handleError('recoveryStage'))
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
        this.logService.add('Recovery plan Service: ' + message);
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
        this.getRecoveryPlanService().absoluteStartTime = TimeConverter.absoluteStartTime(value);
    }

    get apiService(): ApiRestService {
        return this._apiService;
    }

    set apiService(value: ApiRestService) {
        this._apiService = value;
    }
}
