import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { ReservationService } from '../services/reservation.service';

@Component({
  selector: 'app-navbar',
  standalone: false,
  
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit {
  reservationCount: number = 0;

  constructor(
    public authService: AuthService,
    private reservationService: ReservationService
  ) {}

  ngOnInit(): void {
    if (this.authService.getToken()) {
      const userId = Number(this.authService.getUserId());

      this.reservationService.getCartById(userId).subscribe({
        next: (res: any) => {
          this.reservationCount = res?.length || 0;
        },
        error: (err: any) => {
          console.error('Failed to fetch cart items', err);
        }
      });
    }
  }

  logout() {
    this.authService.logout();
  }

}
