import { Component, OnInit } from '@angular/core';
import {Aog} from '../../../shared/_models/aog/aog';
import {TranslateService} from '@ngx-translate/core';
import {LayoutService} from '../../../layout/_services/layout.service';
import {TimeInstant} from '../../../shared/_models/timeInstant';

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
    const aogEtr: Aog = new Aog();
    const aogNi: Aog = new Aog();

    aogEtr.tail = 'PT-MZU';
    aogEtr.fleet = 'A320';
    aogEtr.operator = 'LA';
    aogEtr.barcode = 'TOO3LUTQ';
    aogEtr.reason = 'HOUVE COLISÃO DA ACFT COM FINGER, AFETANDO A PARTE SUPERIOR DO PYLON';
    aogEtr.status = 'ETR';
    aogEtr.isSafetyEvent = true;
    aogEtr.openAogDate = new TimeInstant(Date.now(), null);
    aogEtr.openStatusDate = new TimeInstant(Date.now(), null);
    aogEtr.durationAog = 1800000;
    aogEtr.durationStatus = 1800000;

    aogNi.tail = 'PT-MZU';
    aogNi.fleet = 'A320';
    aogNi.operator = 'LA';
    aogNi.barcode = 'TOO3LUTT';
    aogNi.reason = 'HOUVE COLISÃO DA ACFT COM FINGER, AFETANDO A PARTE SUPERIOR DO PYLON';
    aogNi.status = 'NI';
    aogNi.isSafetyEvent = false;
    aogNi.openAogDate = new TimeInstant(Date.now(), null);
    aogNi.openStatusDate = new TimeInstant(Date.now(), null);
    aogNi.durationAog = 1800000;
    aogNi.durationStatus = 1800000;


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
