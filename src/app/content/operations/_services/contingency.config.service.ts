import { HttpClient } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { environment } from '../../../../environments/environment.dev';
import { Aircraft } from '../../../shared/_models/aircraft';
import { Flight } from '../../../shared/_models/flight';
import { FlightConfiguration } from '../../../shared/_models/configuration/flightConfiguration';
import { FlightSearch } from '../../../shared/_models/configuration/flightSearch';
import { Legs } from '../../../shared/_models/legs';
import { Safety } from '../../../shared/_models/safety';
import { StatusCode } from '../../../shared/_models/configuration/statusCode';
import { TimeInstant } from '../../../shared/_models/timeInstant';
import { ApiRestService } from '../../../shared/_services/apiRest.service';
import { MessageService } from '../../../shared/_services/message.service';

@Injectable()
export class ContingencyConfigService implements OnInit{

    private _aircraftConfiguration: Aircraft[];
    private _flightConfiguration: FlightConfiguration[];
    private _statusCodes: StatusCode[];
    private _safetyEventList: Safety[];
    private _maxStatusCodes: StatusCode[];

    constructor(private _apiRestService: ApiRestService, private _messageService: MessageService, private http: HttpClient) {

    }

    async ngOnInit() {
        const actualTime = new TimeInstant(this.dateToNumber(), null);
        const defaultFlightSearch = new FlightSearch(actualTime);
        this.getAircraftConfiguration();
        this.getFlightConfiguration(defaultFlightSearch);
        this.getStatusCodes();
        this.getSafetyEventList();
        this.getMaxConfigStatuses();
    }

    get aircraftConfiguration(): Aircraft[] {
        return this._aircraftConfiguration;
    }

    set aircraftConfiguration(value: Aircraft[]) {
        this._aircraftConfiguration = value;
    }

    get flightConfiguration(): FlightConfiguration[] {
        return this._flightConfiguration;
    }

    set flightConfiguration(value: FlightConfiguration[]) {
        this._flightConfiguration = value;
    }

    get statusCodes(): StatusCode[] {
        return this._statusCodes;
    }

    set statusCodes(value: StatusCode[]) {
        this._statusCodes = value;
    }

    get safetyEventList(): Safety[] {
        return this._safetyEventList;
    }

    set safetyEventList(value: Safety[]) {
        this._safetyEventList = value;
    }

    get maxStatusCodes(): StatusCode[] {
        return this._maxStatusCodes;
    }

    set maxStatusCodes(value: StatusCode[]) {
        this._maxStatusCodes = value;
    }

    private getAircraftConfiguration(): Subscription {
        return this._apiRestService
            .getAll<Aircraft[]>('aircrafts')
            .subscribe(data => this.aircraftConfiguration = data,
                error => () => {
                    this._messageService.openSnackBar(error.message);
                }, () => {
                    return this.aircraftConfiguration;
                });
    }

    public getFlightConfiguration(flightSearch: FlightSearch): Observable<Flight[]> {
        return this.http.post<Flight[]>(environment.apiUrl + environment.paths.flights, JSON.stringify(flightSearch).replace(/\b[_]/g, ''))
            .map(res => {
                console.log(res);
                return res;
            });
    }

    private getStatusCodes(): Subscription {
        return this._apiRestService
            .getAll<StatusCode[]>('configStatus')
            .subscribe(data => this.statusCodes = data,
                error => () => {
                    this._messageService.openSnackBar(error.message);
                });
    }

    private getSafetyEventList(): Subscription {
        return this._apiRestService
            .getAll<Safety[]>('safetyEvent')
            .subscribe(data => this.safetyEventList = data,
                error => () => {
                    this._messageService.openSnackBar(error.message);
                });
    }

    private getMaxConfigStatuses(): Subscription {
        return this._apiRestService
            .getAll<StatusCode[]>('configMaxStatus')
            .subscribe(data => this.maxStatusCodes = data,
                error => () => {
                    this._messageService.openSnackBar(error.message);
                });
    }

    private dateToNumber(): number {
        const actualDate = new Date();
        return Number(new Date(actualDate.getTime() + actualDate.getTimezoneOffset() * 60000));
    }

    public setFlightSearch(flightSearch: FlightSearch) {
        this.getFlightConfiguration(flightSearch);
    }
}
