import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AdminService } from '../services/admin.service';

@Component({
  selector: 'app-admin-panel',
  standalone: false,
  templateUrl: './admin-panel.component.html',
  styleUrls: ['./admin-panel.component.css']
})
export class AdminPanelComponent {
  carForm: FormGroup;
  successMessage: string = '';
  errorMessage: string = '';

  carTypes = [
    { id: 1, name: 'Sedan' },
    { id: 2, name: 'SUV' },
    { id: 3, name: 'Truck' },
    { id: 4, name: 'Convertible' },
    { id: 5, name: 'Electric' },
    { id: 6, name: 'Coupe' },
    { id: 7, name: 'Hatchback' },
    { id: 8, name: 'Minivan' },
    { id: 9, name: 'Luxury' },
    { id: 10, name: 'Sports Car' }
  ];
  
  constructor(private fb: FormBuilder, private adminService: AdminService) {
    this.carForm = this.fb.group({
      make: ['', Validators.required],
      model: ['', Validators.required],
      year: [null, [Validators.required, Validators.min(1900)]],
      pricePerDay: [null, [Validators.required, Validators.min(1)]],
      availability: [true, Validators.required],
      colour: ['', Validators.required],
      carTypeId: [null, Validators.required],
    });
  }

  onSubmit(): void {
    if (this.carForm.invalid) {
      this.errorMessage = 'Please fill in all required fields correctly.';
      return;
    }


    console.log(this.carForm.value);


    const formData = this.carForm.value;

    formData.carTypeId = Number(formData.carTypeId);
    formData.adminId = 1;

    this.adminService.addCar(1, formData).subscribe({
      next: () => {
        this.successMessage = 'Car added successfully!';
        this.carForm.reset();
      },
      error: (err) => {
        this.errorMessage = 'Failed to add car. Please try again.';
        console.error(err);
      }
    });
    console.log('FORM DATA:', this.carForm.value);
console.log('TYPE OF carTypeId:', typeof this.carForm.value.carTypeId);

  }
}
