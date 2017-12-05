import { Component, OnInit } from '@angular/core';
import { DetailsService } from './_services/details.service';

@Component({
  selector: 'lsl-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss']
})
export class DetailsComponent implements OnInit {

  constructor(public detailsService: DetailsService) { }

  ngOnInit() {
  }

}
