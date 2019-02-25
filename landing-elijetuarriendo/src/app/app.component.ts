import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'landing-elijetuarriendo';
  rPassword = false;
  showSingUp = false;

  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit() {}

  init() {
    this.router.navigateByUrl('http://localhost:5500');
  }

  rememberPassword() {
    this.rPassword = !this.rPassword;
    this.showSingUp = !this.rPassword === true;
  }

  singUp() {
    this.showSingUp = !this.showSingUp;
    this.rPassword = !this.showSingUp === true;
  }

  singIn() {
    this.showSingUp = false;
    this.rPassword = false;
  }
}
