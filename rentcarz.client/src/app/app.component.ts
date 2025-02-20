import { Component } from '@angular/core';
import { RouterModule } from '@angular/router'; 
import { AuthService } from './services/auth.service';
@Component({
  selector: 'app-root',
  standalone: false,
  template: '<router-outlet></router-outlet>', 
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  constructor(private authService: AuthService) {}

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
