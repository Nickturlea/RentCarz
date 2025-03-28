import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Car } from '../models/car.model';
import { Reservation } from '../models/reservation.model';
import { Payment } from '../models/payment.model';

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

  addPaymentMethod(Payment : { reservationId: number; cardNumber: string; month: number; year: number; cVV: number; firstName: string; 
    lastName: string; country: string; city: string; zipcode: string; email: string; phoneNumber: string }): Observable<Payment>{
    return this.http.post<Payment>(`${this.apiUrl}/payment`, Payment)
  }

  checkPaymentMethod(Payment : { ReservationId: number; CardNumber: string; Month: number; Year: number; CVV: number; FirstName: string; 
    LastName: string; Country: string; City: string; Zipcode: string; Email: string; PhoneNumber: string }): Observable<Payment>{
    return this.http.post<Payment>(`${this.apiUrl}/checkPay`, Payment)
  }
}
