import { Component, OnInit, Input } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/operator/map';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';

import { Aircraft } from '../_models/aircraft';
import { Flight } from '../_models/flight';
import { ContingencyService } from '../_services/contingency.service';

@Component({
    selector: 'app-contingency-form',
    templateUrl: './contingency-form.component.html',
    styleUrls: ['./contingency-form.component.scss']
})

export class ContingencyFormComponent {
    contingencyForm: FormGroup;

    selectedAircraft: Aircraft = new Aircraft();
    aircrafts: Aircraft[];
    filteredAircrafts: Observable<Aircraft[]>;

    selectedFlight: Flight = new Flight();
    flights: Flight[];
    filteredFlights: Observable<Flight[]>;

    departureArrival = [];

    constructor(
        private dialogRef: MatDialogRef<ContingencyFormComponent>,
        private contingencyService: ContingencyService,
        private fb: FormBuilder

    ) {
        this.contingencyForm = fb.group({
            'aircraft': [null, Validators.required],
            'fleet': [null, Validators.required],
            'operator': [null, Validators.required],
            'flight': [null, Validators.required],
            'backup': [false],
            'departure': [false],
            'arrival': [false],
            'time': [null, Validators.required],
            'date': [null, Validators.required],
            'informer': ['cco', Validators.required],
            'barcode': [false],
            'safety': ['no', Validators.required],
            'typeSafety': [null, Validators.required],
            'contingencyType': ['operation', Validators.required],
            'failureType': ['technical', Validators.required],
            'observation': [null],
            'tipology': ['ni', Validators.required],
            'interval': [null]

        })
    }

    aircraftOptions: Aircraft[] = [
        { tail: 'CC-BAA', fleet: 'A320', operator: 'CL' },
        { tail: 'AA-CBB', fleet: 'B320', operator: 'PE' },
        { tail: 'AA-CCB', fleet: 'C320', operator: 'BR' }
    ];

    flightsOptions: Flight[] = [
        { flight: 'LA238', departure: 'ZCO', arrival: 'SCL', time: '22:59:59', date: '2017-10-25' },
        { flight: 'AL238', departure: 'SCL', arrival: 'LIM', time: '18:59:45', date: '2017-09-15' },
        { flight: 'LA538', departure: 'LIM', arrival: 'ZCO', time: '14:25:45', date: '2017-08-30' }
    ]

    ngOnInit() {
        this.filteredAircrafts = this.contingencyForm.controls['aircraft'].valueChanges
            .startWith('')
            .map(val => this.filterAircrafts(val));

        this.filteredFlights = this.contingencyForm.controls['flight'].valueChanges
            .startWith('')
            .map(val => this.filterFlights(val));

    }

    submitForm(value: any) {
        console.log(value);
    }

    getAircrafts(): void {
        this.contingencyService.getAircrafts()
            .subscribe(aircrafts => {
                this.aircrafts = aircrafts;
                this.filteredAircrafts = this.contingencyForm.controls['aircraft'].valueChanges
                    .startWith('')
                    .map(val => this.filterAircrafts(val));
            });
    }

    filterAircrafts(val: string): Aircraft[] {
        return this.aircraftOptions.filter(option =>
            option.tail.toLowerCase().indexOf(val.toLowerCase()) === 0);
    }

    onSelectAircraft(selectedOption: string): void {
        this.selectedAircraft = this.aircraftOptions.filter(ac => ac.tail === selectedOption)[0]
    }

    getFlights(): void {
        this.contingencyService.getFlights()
            .subscribe(flights => {
                this.flights = flights;
                this.filteredFlights = this.contingencyForm.controls['flight'].valueChanges
                    .startWith('')
                    .map(val => this.filterFlights(val));
            });
    }

    filterFlights(val: string): Flight[] {
        return this.flightsOptions.filter(option =>
            option.flight.toLowerCase().indexOf(val.toLowerCase()) === 0);
    }

    onSelectFlight(selectedOption: string): void {
        this.departureArrival = [];
        this.selectedFlight = this.flightsOptions.filter(fl => fl.flight === selectedOption)[0]
        this.departureArrival.push(this.selectedFlight.departure);
        this.departureArrival.push(this.selectedFlight.arrival);

    }

    onCancelClick(): void {
        this.dialogRef.close();
    }
}
