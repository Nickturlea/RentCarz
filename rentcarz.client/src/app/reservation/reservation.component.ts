import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
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
  today: String;
  //car : Car;
  errorMessage: string = '';
  /*
  carMake = "";
  carModel = "";
  carYear = "";
  carColor = "";
  */

constructor(private reservationService: ReservationService, private authService: AuthService, private fb: FormBuilder, private router: Router) {
    this.reservationForm = this.fb.group({
      startDate: [''],
      startTime: [''],
      endDate: [''],
      endTime: [''],
    });
    this.today = new Date().toISOString().split('T')[0];
  } 



 ngOnInit(): void {
  this.getCar();
  this.getUser();
}

getUser(): void{
  this.authService
}

getCar(): void {
  this.reservationService.getCarByID(Number(history.state.data)).subscribe({
    next: (data: any) => this.cars = data,
    error: (err: any) => this.errorMessage = 'Failed to load cars. Please try again later.'
  });
}


 onSubmit(){
  
  this.router.navigate(['/listings']);
 }

 goBack() {
    this.router.navigate(['/listings']); 
  }
}
