import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-get-started',
  standalone: false,
  
  templateUrl: './get-started.component.html',
  styleUrl: './get-started.component.css'
})
export class GetStartedComponent {

  constructor(public authService: AuthService, private router: Router) {}

  logout() {
    this.authService.logout();
  }
}

