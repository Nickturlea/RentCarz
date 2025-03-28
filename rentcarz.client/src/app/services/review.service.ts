import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Reservation } from '../models/reservation.model';
import { Payment } from '../models/payment.model';
import { Reviews } from '../models/reviews.model';
import { Member } from '../models/member.model';

@Injectable({
  providedIn: 'root'
})
export class ReviewService {
  private apiUrl = 'http://localhost:5240/api/review';

    constructor(private http: HttpClient) {}

  deleteReview(id:number): Observable<Reviews> {
    return this.http.post<Reviews>(`${this.apiUrl}/deleteReview`, id);
  }

  addReview(Review : { MemberId: number; Rating: number; Comment: string; ReviewDate: Date }): Observable<Reviews>{
    return this.http.post<Reviews>(`${this.apiUrl}/addReview`, Review)
  }

  getReviews(): Observable<Reviews> {
    return this.http.get<Reviews>(`${this.apiUrl}/getReviews`);
  }

  getUsers(): Observable<Member> {
    return this.http.get<Member>(`${this.apiUrl}/getUsers`);
  }

  hasReviewed(id:number): Observable<Boolean> {
    return this.http.get<Boolean>(`${this.apiUrl}/hasReviewed/${id}`);
  }
}
