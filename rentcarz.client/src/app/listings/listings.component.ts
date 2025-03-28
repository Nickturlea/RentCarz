import { Component, OnInit } from '@angular/core';
import { CarService } from '../services/car.service';
import { AdminService } from '../services/admin.service';
import { AuthService } from '../services/auth.service';
import { Car } from '../models/car.model'; 
import { Router } from '@angular/router';

@Component({
  selector: 'app-listings',
  standalone: false,
  templateUrl: './listings.component.html',
  styleUrls: ['./listings.component.css']
})
export class ListingsComponent implements OnInit {
  cars: Car[] = [];
  errorMessage: string = '';
  selectedCar: Car = { carId: 0, make: '', model: '', pricePerDay: 0, colour: '', year: 0, availability: true , carTypeId: 1};
  isAdmin: boolean= false;
  editingCar: Car | null = null;
  isModalOpen: boolean = false;




  constructor(
    private carService: CarService,
    private adminService: AdminService,
    public authService: AuthService,
    private router: Router
  ) {}



  ngOnInit(): void {
    this.loadCars();
    this.isAdmin = this.authService.isAdmin();
  }

  loadCars(): void {
    this.carService.getAvailableCars().subscribe({
      next: (data: any) => this.cars = data,
      error: (err: any) => this.errorMessage = 'Failed to load cars. Please try again later.'
    });
  }



  deleteCar(carId: number): void {
    if (confirm('Are you sure you want to delete this car?')) {
      this.adminService.deleteCar(carId).subscribe({
        next: () => {
          this.cars = this.cars.filter(car => car.carId !== carId);
        },
        error: (err) => this.errorMessage = 'Failed to delete car.'
      });
    }
  }

  startEdit(car: Car): void {
    this.selectedCar = { ...car };
    this.isModalOpen = true;
  }

  openEditModal(car: Car): void {
    this.editingCar = { ...car }; 
    this.isModalOpen = true;
  }

  closeEditModal(): void {
    this.editingCar = null; 
    this.isModalOpen = false;
  }

  updateCar(): void {
    if (this.selectedCar) {
      this.adminService.updateCar(this.selectedCar.carId, this.selectedCar).subscribe({
        next: () => {
          this.loadCars();
          this.selectedCar = { carId: 0, make: '', model: '', pricePerDay: 0, colour: '', year: 0, availability: true , carTypeId: 1};
          this.isModalOpen = false;
        },
        error: (err) => this.errorMessage = 'Failed to update car.'
      });
    }
  }

  cancelEdit(): void {
    this.selectedCar = { carId: 0, make: '', model: '', pricePerDay: 0, colour: '', year: 0, availability: true , carTypeId: 1};
  }

  passCarId(id: any): void {
    this.router.navigate(['/reservation'], { state: { data: id } });
  }
}
