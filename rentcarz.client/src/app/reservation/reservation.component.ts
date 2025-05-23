
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ReservationService } from '../services/reservation.service';
import { Car } from '../models/car.model'; 
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-reservation',
  standalone: false,
  
  templateUrl: './reservation.component.html',
  styleUrl: './reservation.component.css'
})
export class ReservationComponent {
  reservationForm: FormGroup;
  cars: Car[] = []; // Holds the list of cars
  today: string;
  errorMessage: string = '';
  userId: string | null = "";

constructor(private reservationService: ReservationService, private authService: AuthService, private fb: FormBuilder, private router: Router) {
    this.reservationForm = this.fb.group({
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
    });
    //isostring uses utc timezone
    var local = new Date().toLocaleString("en-US", {timeZone: "America/New_York", year: "numeric", month: "2-digit", day: "2-digit"});
    this.today = new Date(local).toISOString().split('T')[0];
  } 



 ngOnInit(): void {
  this.getCar();
  this.getUser();
  this.reservationForm.setValue({
    startDate: `${this.today}T06:00`, 
    endDate: `${this.today}T06:00`
  });
}

getUser(): void{
  this.userId = this.authService.getUserId();
}

getCar(): void {
  this.reservationService.getCarByID(Number(history.state.data)).subscribe({
    next: (data: any) => this.cars = data,
    error: (err: any) => this.errorMessage = 'Failed to load cars. Please try again later.'
  });
}


 onSubmit(){
  var user = Number(this.userId);

  const reservationData = {
    MemberId: user,
    CarId: this.cars[0].carId,
    StartDate: this.reservationForm.value.startDate,
    EndDate: this.reservationForm.value.endDate,
    Status: 0
  }

  this.reservationService.reserve(reservationData).subscribe({
    next: (response) => {
      console.log('Reservation successful', response);
      this.router.navigate(['/listings']).then(() => {window.location.reload();
  });
    },
    error: (error) => {
      console.error('Reservation failed', error);
      this.errorMessage = error.error?.message || "Reservation failed. Please try again.";
      console.log(error.error?.message);
    }
  });
 }

 goBack() {
    this.router.navigate(['/listings']); 
  }
}
