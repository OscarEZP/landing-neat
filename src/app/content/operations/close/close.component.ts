import { Component, OnInit } from '@angular/core';
import { DialogService } from '../../_services/dialog.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'lsl-close',
  templateUrl: './close.component.html',
  styleUrls: ['./close.component.css']
})
export class CloseComponent implements OnInit {

  constructor(private dialogService: DialogService,
              public translate: TranslateService) {
      this.translate.setDefaultLang('en');
  }

  ngOnInit() {
  }

  closeContingencyForm() {
      this.dialogService.closeAllDialogs();
  }

}
