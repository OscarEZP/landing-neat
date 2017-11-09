import { Component, OnInit, ViewChild } from '@angular/core';
import {MatSidenav} from '@angular/material';
import {SidenavService} from "../_services/sidenav.service";

@Component({
  selector: 'lsl-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent implements OnInit {
  @ViewChild('sidenav') public sidenav:MatSidenav;

  constructor(private sidenavService:SidenavService) {
  }

  ngOnInit() {
    this.sidenavService.setSidenav(this.sidenav);
  }

}
