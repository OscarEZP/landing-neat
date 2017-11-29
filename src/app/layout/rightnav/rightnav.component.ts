import {Component, OnInit} from '@angular/core';
import {DetailsService} from '../../details/_services/details.service';

@Component({
  selector: 'lsl-rightnav',
  templateUrl: './rightnav.component.html',
  styleUrls: ['./rightnav.component.scss']
})
export class RightnavComponent implements OnInit {

  constructor(
      private detailsService: DetailsService,
  ) { }

  ngOnInit() {

  }

  openDetails() {
    this.detailsService.openSidenav().then();
  }

  closeDetails() {
    this.detailsService.closeSidenav().then();
  }

}
