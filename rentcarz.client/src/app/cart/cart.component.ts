
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
    this.carService.getAllCars().subscribe({
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
    
    console.log(checkPay);
    this.reservationService.checkPaymentMethod(checkPay).subscribe({
      next: (response) => {
        this.addPayment();
      },
      error: (error) => {
        console.error('Adding payment method failed', error);
        this.errorMessage = error.error?.message || "Adding payment failed. Please try again.";
      }
    });
  }

  //adds the payment method
  addPayment(){
    var month = Number(this.paymentForm.value.month);
    var year = Number(this.paymentForm.value.year);
    var cvv = Number(this.paymentForm.value.cvv);
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
    this.generateAndDownloadReceipt();
    this.router.navigate(['/listings']).then(() => window.location.reload());

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


  generateAndDownloadReceipt(): void {
    let receipt = `==== RentCarz Receipt ====\n\n`;
    receipt += `Date: ${new Date().toLocaleString()}\n\n`;
    receipt += `Customer: ${this.paymentForm.value.firstName} ${this.paymentForm.value.lastName}\n`;
    receipt += `Email: ${this.paymentForm.value.email}\n`;
    receipt += `Phone: ${this.paymentForm.value.tel}\n`;
    receipt += `Address: ${this.paymentForm.value.city}, ${this.paymentForm.value.country}, ${this.paymentForm.value.zipcode}\n\n`;
  
    receipt += `--- Reservations ---\n`;
  
    for (let res of this.reservations) {
      const car = this.cars.find(c => c.carId === res.carId);
      if (car) {
        receipt += `Car: ${car.make} ${car.model} (${car.year})\n`;
        receipt += `Color: ${car.colour}\n`;
        receipt += `From: ${res.startDate.toString().replace('T', ' ')}\n`;
        receipt += `To: ${res.endDate.toString().replace('T', ' ')}\n`;
        receipt += `Price per Day: $${car.pricePerDay}\n`;
        receipt += `-----------------------------\n`;
      }
    }
  
    receipt += `\nThank you for booking with RentCarz!`;
  
    const blob = new Blob([receipt], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'rentcarz_receipt.txt';
    link.click();
    window.URL.revokeObjectURL(url);
  }
  
}


