import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { Reservation } from '../models/reservation.model';
import { ReservationService } from '../services/reservation.service';
import { FormBuilder, FormGroup } from '@angular/forms';


@Component({
  selector: 'app-cart',
  standalone: false,
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css'
})
export class CartComponent implements OnInit {
    paymentForm: FormGroup;
    reservations: Reservation[] = []; // Holds the list of reservations
    errorMessage: string = '';
    startDate: String = "";
    endDate: String = "";
    startTime: String = "";
    endTime: String = "";
  
    constructor(private reservationService: ReservationService, private authService: AuthService, private fb: FormBuilder, private router: Router) {
      this.paymentForm = this.fb.group({
        cardNumber: [''],
        month: [''],
        year: [''],
        cvv: [''],
        firstName: [''],
        lastName: [''],
        country: [''],
        city: [''],
        zipcode: ['']
      });
    }
  
    ngOnInit(): void {
      this.loadReservations();
      this.loadPayment();
    }
  
    loadReservations(): void {
      var userId = this.getUser();
      this.reservationService.getCartById(userId).subscribe({
        next: (data: any) => this.reservations = data,
        error: (err: any) => this.errorMessage = 'Failed to load reservations. Please try again later: ' + err
      });
    }

    loadPayment(): void{

    }
    
    removeReservations(id : Number) : void {
      this.reservationService.deleteReservation(id).subscribe({
        next: (response) => {
          console.log('Delete successful', response);
          window.location.reload();
        },
        error: (error) => {
          console.error('Delete failed', error);
          this.errorMessage = error.error?.message || "Delete failed. Please try again.";
        }
      });
    }

    onSubmit(){
      for(var i = 0; i < this.reservations.length; i++){

        const reservationData = {
          ReservationId: this.reservations[i].reservationId,
          MemberId: this.reservations[i].memberId,
          CarId: this.reservations[i].carId,
          StartDate: this.reservations[i].startDate,
          EndDate: this.reservations[i].endDate,
          Status: 1
        }
        
        this.reservationService.checkout(reservationData).subscribe({
          next: (response) => {
            console.log('Checkout successful', response);
            this.router.navigate(['/listings']);
          },
          error: (error) => {
            console.error('Checkout failed', error);
            this.errorMessage = error.error?.message || "Checkout failed. Please try again.";
          }
        });
      }
    }

    getUser(): Number{
      var userId = this.authService.getUserId();
      return Number(userId);
    }
}
