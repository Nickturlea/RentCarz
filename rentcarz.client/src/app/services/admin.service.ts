import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private apiUrl = 'http://localhost:5240/api/admins';

  constructor(private http: HttpClient) { }

  addCar(adminId: number, carData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/addCar?adminId=${adminId}`, carData);
  }

  // Update existing car details
  updateCar(carId: number, updatedCarData: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/editCar/${carId}`, updatedCarData);
  }

  // Delete car listing
  deleteCar(carId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/deleteCar/${carId}`);
  }


}
