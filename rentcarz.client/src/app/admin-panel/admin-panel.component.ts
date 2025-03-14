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

  constructor(private fb: FormBuilder, private adminService: AdminService) {
    this.carForm = this.fb.group({
      make: ['', Validators.required],
      model: ['', Validators.required],
      year: [null, [Validators.required, Validators.min(1900)]],
      pricePerDay: [null, [Validators.required, Validators.min(1)]],
      availability: [true, Validators.required],
      colour: ['', Validators.required],
      carTypeId: [null, Validators.required],
      adminId: [null, Validators.required]
    });
  }

  onSubmit(): void {
    if (this.carForm.invalid) {
      this.errorMessage = 'Please fill in all required fields correctly.';
      return;
    }

    const formData = this.carForm.value;
    this.adminService.addCar(formData.adminId, formData).subscribe({
      next: () => {
        this.successMessage = 'Car added successfully!';
        this.carForm.reset();
      },
      error: (err) => {
        this.errorMessage = 'Failed to add car. Please try again.';
        console.error(err);
      }
    });
  }
}
