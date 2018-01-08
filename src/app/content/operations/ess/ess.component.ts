import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'lsl-ess',
  templateUrl: './ess.component.html',
  styleUrls: ['./ess.component.css']
})
export class EssComponent implements OnInit {
  @Input()
  public message: string;

  constructor() { }

  ngOnInit() {
  }

}
