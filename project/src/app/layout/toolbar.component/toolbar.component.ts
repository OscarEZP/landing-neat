import { Component, OnInit } from '@angular/core';
import {SidenavService} from '../_services/sidenav.service'

@Component({
  selector: 'lsl-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.css']
})
export class ToolbarComponent implements OnInit {

  constructor(private sidenavService: SidenavService) {

  }

  ngOnInit() {
  }

  toggleSidenav(){
    this.sidenavService.toggleSidenav().then(()=>{
      console.log('toggle sidenav!');
    });
  }

}
