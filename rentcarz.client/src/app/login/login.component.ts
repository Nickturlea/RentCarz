import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm: FormGroup;
  errorMessage: string = '';

  //for the auth service
  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.loginForm.invalid) return;

    const loginData = {
      username: this.loginForm.value.username,
      password: this.loginForm.value.password
    };

    this.authService.login(loginData).subscribe({
      next: (response) => {
        console.log('Login successful', response);
        //save jwt
        localStorage.setItem('token', response.token); 
        //save refresh token
        localStorage.setItem('refreshToken', response.refreshToken); 

        //save user id
        localStorage.setItem('userId', response.userId);
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
