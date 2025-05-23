import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Car } from '../models/car.model';

@Injectable({
  providedIn: 'root'
})
export class CarService {
  private apiUrl = 'http://localhost:5240/api/cars'; 

  constructor(private http: HttpClient) {}

  // Fetch available cars from API
  getAvailableCars(): Observable<Car[]> {
    return this.http.get<Car[]>(`${this.apiUrl}/available-cars`);
  }

  // Fetch all cars from API
  getAllCars(): Observable<Car[]> {
    return this.http.get<Car[]>(`${this.apiUrl}/all-cars`);
  }
}
