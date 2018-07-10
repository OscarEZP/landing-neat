import { Component, OnInit } from '@angular/core';
import {Aog} from '../../../shared/_models/aog/aog';
import {TranslateService} from '@ngx-translate/core';
import {LayoutService} from '../../../layout/_services/layout.service';
import {TimeInstant} from '../../../shared/_models/timeInstant';
import {StatusAog} from '../../../shared/_models/aog/statusAog';
import {Interval} from '../../../shared/_models/interval';

@Component({
  selector: 'lsl-aog-list',
  templateUrl: './aog-list.component.html',
  styleUrls: ['./aog-list.component.scss']
})
export class AogListComponent implements OnInit {

  private _aogList: Aog[];
  private _error: boolean;

  constructor(private _translate: TranslateService,
              private _layout: LayoutService) {



  }

  ngOnInit() {

    this._translate.setDefaultLang('en');
    this._layout.disableRightNav = true;
    this._layout.disableAddButton = true;
    this._layout.showAddButton = true;
    this._layout.showRightNav = true;

    this.error = false;

    this.aogList = new Array(2);
    const aogEtr: Aog = Aog.getInstance();
    const aogNi: Aog = Aog.getInstance();

    aogEtr.tail = 'PT-MZU';
    aogEtr.fleet = 'A320';
    aogEtr.operator = 'LA';
    aogEtr.barcode = 'TOO3LUTQ';
    aogEtr.reason = 'HOUVE COLISÃO DA ACFT COM FINGER, AFETANDO A PARTE SUPERIOR DO PYLON';
    aogEtr.safety = 'ABT';

    const statusETR = new StatusAog(null, null, null, null, null, null, null);
    statusETR.code = 'ETR';
    statusETR.creationDate = new TimeInstant(Date.now(), null);
    statusETR.requestedInterval = new Interval( new TimeInstant(Date.now(), null), 1800000);
    aogEtr.status = statusETR;


    aogNi.tail = 'PT-MZU';
    aogNi.fleet = 'A320';
    aogNi.operator = 'LA';
    aogNi.barcode = 'TOO3LUTT';
    aogNi.reason = 'HOUVE COLISÃO DA ACFT COM FINGER, AFETANDO A PARTE SUPERIOR DO PYLON';

    const statusNi = new StatusAog(null, null, null, null, null, null, null);
    statusNi.code = 'NI';
    statusNi.creationDate = new TimeInstant(Date.now(), null);
    statusNi.requestedInterval = new Interval( new TimeInstant(Date.now(), null), 1800000);
    aogNi.status = statusNi;

    this.aogList[0] = aogEtr;
    this.aogList[1] = aogNi;

  }


  get aogList(): Aog[] {
    return this._aogList;
  }

  set aogList(value: Aog[]) {
    this._aogList = value;
  }


  get error(): boolean {
    return this._error;
  }

  set error(value: boolean) {
    this._error = value;
  }
}
