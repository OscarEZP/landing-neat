import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from '../../access/_shared/auth.service';

@Component({
  selector: 'lsl-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {

  constructor(private authService:AuthService, private router:Router) {
    this.authService = authService;
    this.router = router;
  }

  ngOnInit() {

  }

  logOut(){
    this.router.navigate(['']);
    this.authService.logOut();
  }

}
