import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { DetailsService } from '../_services/details.service';
import { Contingency } from '../../shared/_models/contingency/contingency';

@Component({
  selector: 'lsl-information',
  templateUrl: './information.component.html',
  styleUrls: ['./information.component.scss'],
  providers: [ TranslateService ]
})

export class InformationComponent implements OnInit {

  public contingency: Contingency;

  constructor(
      public translate: TranslateService,
      public detailsService: DetailsService
  ) {
    this.translate.setDefaultLang('en');
  }



  ngOnInit() {
  }

}
