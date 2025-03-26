import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-admin-login',
  standalone: false,
  templateUrl: './admin-login.component.html',
  styleUrl: './admin-login.component.css'
})

export class AdminLoginComponent {
  loginForm: FormGroup;
  errorMessage: string = '';

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }


  onSubmit() {
    if (this.loginForm.invalid) return;

    const loginData = {
      adminUsername: this.loginForm.value.username,
      adminPassword: this.loginForm.value.password
    };

    this.authService.adminLogin(loginData).subscribe({
      next: (response) => {
        console.log('Login successful', response);
        //save jwt
        localStorage.setItem('token', response.token);
        //save refresh token
        localStorage.setItem('refreshToken', response.refreshToken);
        //redirect to home
        this.router.navigate(['/']);
      },
      error: (error) => {
        //errors for handling
        console.error('Login failed', error);
        this.errorMessage = error.error?.message || "Invalid username or password!";
      }
    });
  }

  goBack() {
    this.router.navigate(['/']);
  }

}
