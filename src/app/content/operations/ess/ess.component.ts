import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'lsl-ess',
  templateUrl: './ess.component.html',
  styleUrls: ['./ess.component.scss']
})
export class EssComponent implements OnInit {
  @Input() public message: string;
  @Input() public icon: string;
  constructor() { }

  ngOnInit() {
  }

}
