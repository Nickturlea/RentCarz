import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private apiUrl = 'http://localhost:5240/api/admins'; // Update with your actual API base URL

  constructor(private http: HttpClient) {}

  addCar(adminId: number, carData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/addCar?adminId=${adminId}`, carData);
  }
}
