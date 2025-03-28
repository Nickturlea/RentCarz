
import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { Reservation } from '../models/reservation.model';
import { ReservationService } from '../services/reservation.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Car } from '../models/car.model';
import { CarService } from '../services/car.service';


@Component({
  selector: 'app-cart',
  standalone: false,
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css'
})
export class CartComponent implements OnInit {
  cars: Car[] = [];
  reservations: Reservation[] = []; // Holds the list of reservations
  errorMessage: string = '';
  startDate: String = "";
  endDate: String = "";
  startTime: String = "";
  endTime: String = "";
  paymentForm: FormGroup;

  constructor(private reservationService: ReservationService, private carService: CarService, private authService: AuthService, private fb: FormBuilder, private router: Router) {
    this.paymentForm = this.fb.group({
      cardNumber: ['', [Validators.required]],
      month: ['', [Validators.required]],
      year: ['', [Validators.required]],
      cvv: ['', [Validators.required]],
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      country: ['', [Validators.required]],
      city: ['', [Validators.required]],
      zipcode: ['', [Validators.required]],
      email: ['', [Validators.required]],
      tel: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
    this.loadReservations();
    this.loadCars();
  }

  loadCars(): void {
    this.carService.getAvailableCars().subscribe({
      next: (data: any) => this.cars = data,
      error: (err: any) => this.errorMessage = 'Failed to load cars. Please try again later.'
    });
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
    var checkoutValid = false;

    const checkPay = {
      ReservationId: this.reservations[0].reservationId,
      CardNumber: String(this.paymentForm.value.cardNumber),
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
    
    console.log("checking payment");
    console.log(checkPay);
    this.reservationService.checkPaymentMethod(checkPay).subscribe({
      next: (response) => {
        checkoutValid = true;
      },
      error: (error) => {
        console.error('Adding payment method failed', error);
        this.errorMessage = error.error?.message || "Adding payment failed. Please try again.";
      }
    });

    if (checkoutValid) {
      console.log("adding payment");
      //not a fan of this would rather send arraylist of objects instead. But keep getting errors.
      for (var i = 0; i < this.reservations.length; i++) {

        const paymentData = {
          reservationId: this.reservations[i].reservationId,
          cardNumber: String(this.paymentForm.value.cardNumber),
          month: month,
          year: year,
          cVV: cvv,
          firstName: this.paymentForm.value.firstName,
          lastName: this.paymentForm.value.lastName,
          country: this.paymentForm.value.country,
          city: this.paymentForm.value.city,
          zipcode: this.paymentForm.value.zipcode,
          email: this.paymentForm.value.email,
          phoneNumber: this.paymentForm.value.tel
        }

        //adds the payment method to the assosiated reservatoin
        this.reservationService.addPaymentMethod(paymentData).subscribe({
          next: (response) => {
            console.log('Added payment method', response);
          },
          error: (error) => {
            console.error('Adding payment method failed', error);
            this.errorMessage = error.error?.message || "Adding payment failed. Please try again.";
          }
        });

        //Checks out that specific reservation
        this.checkout(i);
      }
      this.router.navigate(['/listings']);
    }
  }


  //sends res to db and changes status
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
