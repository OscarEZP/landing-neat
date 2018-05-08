import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'lsl-atec-filter',
  templateUrl: './atec-filter.component.html',
  styleUrls: ['./atec-filter.component.scss']
})
export class AtecFilterComponent implements OnInit {

  stationPlaceholder = 'Station';
  operatorPlaceholder = 'Operator';
  constructor() { }

  ngOnInit() {
  }

  }
