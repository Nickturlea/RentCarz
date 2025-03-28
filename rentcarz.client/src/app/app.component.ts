import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  standalone: false,
  template: `
<<<<<<< HEAD
    <app-get-started *ngIf="showNavbar"></app-get-started> <!-- Show navbar if showNavbar is true -->
=======
    <app-navbar></app-navbar>
>>>>>>> css
    <router-outlet></router-outlet>
  `,
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  constructor(private authService: AuthService, private router: Router) { }


  ngOnInit() {
    const token = this.authService.getToken();
    if (token) {
      console.log("Token exists, starting refresh.");
      this.authService.startTokenRefresh();
    } else {
      console.log("No token found, not starting refresh.");
    }

  }
}
