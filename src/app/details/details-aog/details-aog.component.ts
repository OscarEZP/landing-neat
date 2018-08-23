import { Component, OnInit } from '@angular/core';
import {Aog} from '../../shared/_models/aog/aog';
import {Subscription} from 'rxjs/Subscription';
import {DetailsServiceAog} from '../_services/details_aog.service';

@Component({
  selector: 'lsl-details-aog',
  templateUrl: './details-aog.component.html',
  styleUrls: ['./details-aog.component.scss']
})
export class DetailsAogComponent implements OnInit {

  private _asideVisible: boolean;
  private _activeTitle: string;
  private _selectedAog: Aog;
  private _aogSubcription: Subscription;

  constructor(private _detailsServiceAog: DetailsServiceAog) {

    this.asideVisible = false;
    this.activeTitle = '';
    this.selectedAog = Aog.getInstance();
  }

  ngOnInit() {
  }


  get asideVisible(): boolean {
    return this._asideVisible;
  }

  set asideVisible(value: boolean) {
    this._asideVisible = value;
  }

  get activeTitle(): string {
    return this._activeTitle;
  }

  set activeTitle(value: string) {
    this._activeTitle = value;
  }

  get selectedAog(): Aog {
    return this._selectedAog;
  }

  set selectedAog(value: Aog) {
    this._selectedAog = value;
  }

  get aogSubcription(): Subscription {
    return this._aogSubcription;
  }

  set aogSubcription(value: Subscription) {
    this._aogSubcription = value;
  }
}
