import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Http } from '@angular/http';
import { MatDialogRef } from '@angular/material';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/startWith';
import { Observable } from 'rxjs/Observable';
import { TimerObservable } from 'rxjs/observable/TimerObservable';
import { Subscription } from 'rxjs/Subscription';
import { environment } from '../../../../../environments/environment';
import { ActualTimeModel } from '../../../shared/_models/actual-time-model';
import { Aircraft } from '../../../shared/_models/aircraft';
import { Contingency } from '../../../shared/_models/contingency';
import { TimeInstant } from '../../../shared/_models/timeInstant';
import { Flight } from '../../../shared/_models/flight';
import { Interval } from '../../../shared/_models/interval';
import { Safety } from '../../../shared/_models/safety';
import { Status } from '../../../shared/_models/status';
import { ClockService } from '../../../shared/_services/clock.service';
import { DataService } from '../../../shared/_services/data.service';
import { DatetimeService } from '../../../shared/_services/datetime.service';

import { AircraftList } from '../_models/aircraft';
import { FlightList } from '../_models/flight';
import { ContingencyService } from '../_services/contingency.service';
import { MessageService } from '../../../shared/_services/message.service';

@Component({
    selector: 'lsl-contingency-form',
    templateUrl: './contingency-form.component.html',
    styleUrls: ['./contingency-form.component.scss']
})

export class ContingencyFormComponent implements OnInit {
    private _messageUTCSubscription: Subscription;
    private alive: boolean;
    private data: ActualTimeModel;
    private interval: number;
    public contingencyForm: FormGroup;
    public currentUTCTime: number;
    public currentDateString: string;
    public display: boolean;
    public time: Date;
    public contingency: Contingency;
    
    selectedAircraft: AircraftList = new AircraftList();
    aircrafts: AircraftList[];
    filteredAircrafts: Observable<AircraftList[]>;
    
    selectedFlight: FlightList = new FlightList();
    flights: FlightList[];
    filteredFlights: Observable<FlightList[]>;
    
    departureArrival = [];
    
    protected safety: string;
    protected contingencyType: string;
    
    private apiUrl = environment.apiUrl + environment.paths.contingencyList;
    
    constructor(private dialogRef: MatDialogRef<ContingencyFormComponent>,
                private contingencyService: ContingencyService,
                private fb: FormBuilder,
                private datetimeService: DatetimeService,
                private clockService: ClockService,
                private messageData: DataService,
                private http: Http,
                private messageService: MessageService) {
        this.display = true;
        this.alive = true;
        this.interval = 60000;
        this.currentUTCTime = 0;
        this.currentDateString = '';
        
        this.contingencyForm = fb.group({
            'tail': [null, Validators.required],
            'fleet': [null, Validators.required],
            'operator': [null, Validators.required],
            'flightNumber': [null, Validators.required],
            'isBackup': [false],
            'origin': [false],
            'destination': [false],
            'tm': [null, Validators.required],
            'dt': [null, Validators.required],
            'informer': ['cco', Validators.required],
            'barcode': [false],
            'safety': ['no', Validators.required],
            'safetyEventCode': [null, Validators.required],
            'contingencyType': ['operation', Validators.required],
            'failure': ['technical', Validators.required],
            'observation': [null],
            'statusCode': ['ni', Validators.required],
            'duration': [null]
        });
    }
    
    aircraftOptions: AircraftList[] = [
        {tail: 'CC-BAA', fleet: 'A320', operator: 'CL'},
        {tail: 'AA-CBB', fleet: 'B320', operator: 'PE'},
        {tail: 'AA-CCB', fleet: 'C320', operator: 'BR'}
    ];
    
    flightsOptions: FlightList[] = [
        {flightNumber: 'LA238', origin: 'ZCO', destination: 'SCL', tm: '22:59:59', dt: '2017-10-25'},
        {flightNumber: 'AL238', origin: 'SCL', destination: 'LIM', tm: '18:59:45', dt: '2017-09-15'},
        {flightNumber: 'LA538', origin: 'LIM', destination: 'ZCO', tm: '14:25:45', dt: '2017-08-30'}
    ];
    
    ngOnInit() {
        this._messageUTCSubscription = this.messageData.currentNumberMessage.subscribe(message => this.currentUTCTime = message);
        
        TimerObservable.create(0, this.interval)
                       .takeWhile(() => this.alive)
                       .subscribe(() => {
                           this.datetimeService.getTime()
                               .subscribe((data) => {
                                   this.data = data;
                                   this.currentUTCTime = this.data.currentTimeLong;
                                   this.currentDateString = this.data.currentTime;
                                   this.newMessage();
                                   this.clockService.setClock(this.currentUTCTime);
                                   if(!this.display) {
                                       this.display = true;
                                   }
                               });
                       });
        
        this.clockService.getClock().subscribe(time => this.time = time);
        
        this.filteredAircrafts = this.contingencyForm.controls['tail'].valueChanges
                                                                      .startWith('')
                                                                      .map(val => this.filterAircrafts(val));
        
        this.filteredFlights = this.contingencyForm.controls['flightNumber'].valueChanges
                                                                            .startWith('')
                                                                            .map(val => this.filterFlights(val));
        
    }
    
    submitForm(value: any) {
        
        if(this.contingencyForm.valid) {
            
            this.datetimeService.getTime().subscribe(current => {
                this.currentUTCTime = current.currentTimeLong;
                this.currentDateString = current.currentTime;
                
                this.contingency = new Contingency(
                    null,
                    new Aircraft(
                        value.tail,
                        value.fleet,
                        value.operator
                    ),
                    value.barcode,
                    null,
                    value.failure,
                    new Flight(
                        value.flightNumber,
                        value.origin,
                        value.destination,
                        new TimeInstant(
                            this.createEpochFromTwoStrings(value.dt, value.tm),
                            null
                        )
                    ),
                    value.informer,
                    value.isBackup,
                    'fake reason, we need to implement in front',
                    new Safety(
                        value.safetyEventCode,
                        null
                    ),
                    new Status(
                        value.statusCode,
                        null,
                        null,
                        value.observation,
                        null,
                        new Interval(
                            new TimeInstant(
                                this.currentUTCTime,
                                null
                            ),
                            value.duration
                        ),
                        'here goes creator'
                    ),
                    'type',
                    'username acá'
                );
                
                return new Promise((resolve, reject) => {
                    this.http
                        .post(this.apiUrl, JSON.stringify(this.contingency).replace(/_/g, ''))
                        .toPromise()
                        .then(rs => {
                            this.messageService.openSnackBar(rs.json());
                            this.dialogRef.close();
                            this.messageData.stringMessage('reload');
                            resolve();
                        }, reason => {
                            this.messageService.openSnackBar(reason);
                            reject(reason);
                        });
                });
            });
            
        }
    }
    
    private createEpochFromTwoStrings(dt: string, tm: string) {
        return Date.parse(dt + ' ' + tm);
    }
    
    getAircrafts(): void {
        this.contingencyService.getAircrafts()
            .subscribe(aircrafts => {
                this.aircrafts = aircrafts;
                this.filteredAircrafts = this.contingencyForm.controls['tail'].valueChanges
                                                                              .startWith('')
                                                                              .map(val => this.filterAircrafts(val));
            });
    }
    
    filterAircrafts(val: string): AircraftList[] {
        return this.aircraftOptions.filter(option =>
            option.tail.toLowerCase().indexOf(val.toLowerCase()) === 0);
    }
    
    onSelectAircraft(selectedOption: string): void {
        this.selectedAircraft = this.aircraftOptions.filter(ac => ac.tail === selectedOption)[0];
    }
    
    getFlights(): void {
        this.contingencyService.getFlights()
            .subscribe(flights => {
                this.flights = flights;
                this.filteredFlights = this.contingencyForm.controls['flightNumber'].valueChanges
                                                                                    .startWith('')
                                                                                    .map(val => this.filterFlights(val));
            });
    }
    
    filterFlights(val: string): FlightList[] {
        return this.flightsOptions.filter(option =>
            option.flightNumber.toLowerCase().indexOf(val.toLowerCase()) === 0);
    }
    
    onSelectFlight(selectedOption: string): void {
        this.departureArrival = [];
        this.selectedFlight = this.flightsOptions.filter(fl => fl.flightNumber === selectedOption)[0];
        this.departureArrival.push(this.selectedFlight.origin);
        this.departureArrival.push(this.selectedFlight.destination);
        
    }
    
    onCancelClick(): void {
        this.dialogRef.close();
    }
    
    newMessage() {
        this.messageData.changeTimeUTCMessage(this.currentUTCTime);
    }
}
