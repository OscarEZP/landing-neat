import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'lsl-information',
  templateUrl: './information.component.html',
  styleUrls: ['./information.component.scss'],
  providers: [ TranslateService ]
})

export class InformationComponent implements OnInit {

  constructor(
      public translate: TranslateService
  ) {
    this.translate.setDefaultLang('en');
  }

  ngOnInit() {
  }

}
