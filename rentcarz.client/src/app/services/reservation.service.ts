import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Car } from '../models/car.model';
import { Reservation } from '../models/reservation.model';

@Injectable({
  providedIn: 'root'
})
export class ReservationService {
  private apiUrl = 'http://localhost:5240/api/reservation';

    constructor(private http: HttpClient) {}
  
  
  getCarByID(id : Number): Observable<Car> {
    return this.http.get<Car>(`${this.apiUrl}/carById/${id}`);
  }

  getCartById(id : Number): Observable<Reservation> {
    return this.http.get<Reservation>(`${this.apiUrl}/cartById/${id}`);
  }

  checkout(Reservation : { ReservationId: number; MemberId: number; CarId: number; StartDate: Date; EndDate: Date; Status: number }): Observable<Reservation> {
    return this.http.post<Reservation>(`${this.apiUrl}/checkout`, Reservation);
  }

  reserve(Reservation : { MemberId: number; CarId: number; StartDate: Date; EndDate: Date; Status: number }): Observable<Reservation> {
    return this.http.post<Reservation>(`${this.apiUrl}/reserve`, Reservation);
  }

  deleteReservation(id : Number): Observable<Reservation> {
    return this.http.post<Reservation>(`${this.apiUrl}/deleteReservation`, id);
  }
}
