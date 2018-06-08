import {Injectable} from '@angular/core';
import 'rxjs/add/operator/map';
import {ActualTimeModel} from '../_models/actualTime';
import {Observable} from 'rxjs/Observable';
import {environment} from '../../../environments/environment';
import {HttpClient} from '@angular/common/http';

@Injectable()
export class DatetimeService {
    private url = environment.apiUrl + environment.paths.dateTime;

    constructor(private http: HttpClient) {
    }

    public getTime(): Observable<ActualTimeModel> {
        return this.http
            .get<ActualTimeModel>(this.url)
            .map((actualTimeModel: ActualTimeModel) => {
                actualTimeModel = new ActualTimeModel(actualTimeModel.currentTime, actualTimeModel.currentTimeLong);
                return actualTimeModel;
            });
    }
}
