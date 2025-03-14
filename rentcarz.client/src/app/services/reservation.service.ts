import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Car } from '../models/car.model';

@Injectable({
  providedIn: 'root'
})
export class ReservationService {
  //private apiUrl = 'http://localhost:5240/api/reservation'; 
  //temp url until backend service fixed
  private apiUrl = 'http://localhost:5240/api/reservation';

  constructor(private http: HttpClient) {}
  
  
  getCarByID(id : Number): Observable<Car> {
    return this.http.get<Car>(`${this.apiUrl}/carById/${id}`);
  }
}
