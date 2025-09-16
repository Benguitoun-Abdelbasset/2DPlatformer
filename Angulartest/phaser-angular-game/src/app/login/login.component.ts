import { Component } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm: FormGroup;
  submitted = false;
  errorMessage: string = '';
  loading = false;

  constructor(
    private fb: FormBuilder, 
    private http: HttpClient,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required]],  
      password: ['', [Validators.required, Validators.minLength(1)]]
    });
  }

  get f() { return this.loginForm.controls; }

  onSubmit() {
  this.submitted = true;
  this.errorMessage = '';

  if (this.loginForm.invalid) return;

  this.loading = true;

  const loginPayload = {
    username: this.loginForm.value.username,
    password: this.loginForm.value.password
  };

  this.http.post<any>('http://localhost:8080/auth/login', loginPayload, { withCredentials: true })
    .subscribe({
      next: (response) => {
        // Only store username for UI display (optional)
        localStorage.setItem('username', response.username);
        
        this.router.navigate(['/dashboard']);
        this.loading = false;
      },
      error: (error: HttpErrorResponse) => {
        this.loading = false;
        this.errorMessage = error.status === 400
          ? 'Invalid username or password'
          : 'An error occurred during login. Please try again.';
        console.error('Login error:', error);
      }
    });
}
}
