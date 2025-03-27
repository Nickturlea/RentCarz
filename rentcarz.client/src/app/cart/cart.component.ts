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
  reservations: Reservation[] = []; // Holds the list of reservations
  errorMessage: string = '';
  startDate: String = "";
  endDate: String = "";
  startTime: String = "";
  endTime: String = "";
  paymentForm: FormGroup;

  constructor(private reservationService: ReservationService, private authService: AuthService, private fb: FormBuilder, private router: Router) {
    this.paymentForm = this.fb.group({
      cardNumber: ['5555555555555555'],
      month: ['01'],
      year: ['2026'],
      cvv: ['999'],
      firstName: ['First'],
      lastName: ['Last'],
      country: ['Canada'],
      city: ['Waterloo'],
      zipcode: ['G2G2G2'],
      email: ['email@gmail.com'],
      tel: ['5555555555']
    });
  }

  ngOnInit(): void {
    this.loadReservations();
  }

  loadReservations(): void {
    var userId = this.getUser();
    this.reservationService.getCartById(userId).subscribe({
      next: (data: any) => this.reservations = data,
      error: (err: any) => this.errorMessage = 'Failed to load reservations. Please try again later: ' + err
    });
  }

  removeReservations(id: Number): void {
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

  onSubmit() {
    var month = Number(this.paymentForm.value.month);
    var year = Number(this.paymentForm.value.year);
    var cvv = Number(this.paymentForm.value.cvv);


    //not a fan of this would rather send arraylist of objects instead. But keep getting errors.
    for (var i = 0; i < this.reservations.length; i++) {

      const paymentData = {
        ReservationId: this.reservations[i].reservationId,
        CardNumber: this.paymentForm.value.cardNumber,
        Month: month,
        Year: year,
        CVV: cvv,
        FirstName: this.paymentForm.value.firstName,
        LastName: this.paymentForm.value.lastName,
        Country: this.paymentForm.value.country,
        City: this.paymentForm.value.city,
        Zipcode: this.paymentForm.value.zipcode,
        Email: this.paymentForm.value.email,
        PhoneNumber: this.paymentForm.value.tel
      }

      this.reservationService.addPaymentMethod(paymentData).subscribe({
        next: (response) => {
          console.log('Added payment method', response);
        },
        error: (error) => {
          console.error('Adding payment method failed', error);
          this.errorMessage = error.error?.message || "Adding payment failed. Please try again.";
        }
      });

      this.checkout(i);
    }
    this.router.navigate(['/listings']);
  }

  checkout(resId: number) {

    const reservationData = {
      ReservationId: this.reservations[resId].reservationId,
      MemberId: this.reservations[resId].memberId,
      CarId: this.reservations[resId].carId,
      StartDate: this.reservations[resId].startDate,
      EndDate: this.reservations[resId].endDate,
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

  getUser(): Number {
    var userId = this.authService.getUserId();
    return Number(userId);
  }
}
