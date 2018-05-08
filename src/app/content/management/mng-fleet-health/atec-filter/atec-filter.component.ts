import { Component, OnInit } from '@angular/core';
import {ApiRestService} from "../../../../shared/_services/apiRest.service";
import {Authority} from "../../../../shared/_models/management/authority";
import {Subscription} from "rxjs/Subscription";

@Component({
  selector: 'lsl-atec-filter',
  templateUrl: './atec-filter.component.html',
  styleUrls: ['./atec-filter.component.scss']
})
export class AtecFilterComponent implements OnInit {

  stationPlaceholder = 'Station';
  operatorPlaceholder = 'Operator';
  public arrMenu: { label: string}[];
  private _operators :Authority[];

  constructor(private _apiRestService: ApiRestService,) {

    this.arrMenu = [
      {
        'label': 'LA',

      },
      {
        'label': '4M',

      }
    ];

    this.operators=[];
    this.getAuthorities();
  }

  ngOnInit() {
  }

  private getAuthorities():Subscription {

    return this._apiRestService
        .getAll<Authority[]>("authorities")
        .subscribe(rs => {
          rs.forEach(authority => this.operators.push(authority));
        });

}

  get operators(): Authority[] {
    return this._operators;
  }

  set operators(value: Authority[]) {
    this._operators = value;
  }
}

