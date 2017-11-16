import { Injectable } from '@angular/core';
import {Http, Response} from '@angular/http';
import 'rxjs/add/operator/map';
import {ActualTimeModel} from './actual-time-model';
import {Observable} from 'rxjs/Observable';
import {environment} from "../../../../environments/environment";


@Injectable()
export class DatetimeService {
    private url = environment.apiUrl + '/api/security/currentdatetime';

  constructor(private http: Http) {
  }

  getTime(): Observable<ActualTimeModel> {
      return this.http
          .get(this.url)
          .map((res:Response) => res.json());
  }

}