import { Component, OnInit } from '@angular/core';
import { CarService } from '../services/car.service';
import { Car } from '../models/car.model'; 
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-listings',
  standalone: false,
  templateUrl: './listings.component.html',
  styleUrls: ['./listings.component.css']
})
export class ListingsComponent implements OnInit {
  cars: Car[] = []; // Holds the list of cars
  errorMessage: string = '';

  constructor(public authService: AuthService, private carService: CarService, private router: Router) {}

  ngOnInit(): void {
    this.loadCars();
  }

  loadCars(): void {
    this.carService.getAvailableCars().subscribe({
      next: (data: any) => this.cars = data,
      error: (err: any) => this.errorMessage = 'Failed to load cars. Please try again later.'
    });
  }

 passCarId(id: any){
    this.router.navigate(['/reservation'], { state: {data: id} });
  }

}

