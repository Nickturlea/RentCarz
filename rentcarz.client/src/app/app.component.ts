import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  standalone: false,
  template: `
    <app-get-started *ngIf="showNavbar"></app-get-started> <!-- Show navbar if showNavbar is true -->
    <router-outlet></router-outlet>
  `,
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  showNavbar = true;  // Flag to control whether the navbar is shown

  constructor(private authService: AuthService, private router: Router, private activatedRoute: ActivatedRoute) {}

  ngOnInit() {
    const token = this.authService.getToken();
    if (token) {
      console.log("Token exists, starting refresh.");
      this.authService.startTokenRefresh();
    } else {
      console.log("No token found, not starting refresh.");
    }

    // Listen for route changes and update the showNavbar flag accordingly
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      const currentRoute = this.activatedRoute.snapshot.firstChild?.routeConfig?.path;
      // Hide the navbar on the 'get-started' route
      this.showNavbar = currentRoute !== '';
    });
  }
}
