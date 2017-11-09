import { Component } from '@angular/core';

import { AuthService } from './access/_services/auth.service';

@Component({
  selector: 'lsl-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  constructor(private authService:AuthService) {
    this.authService = authService;
  }

  ngOnInit() {
  }
}
