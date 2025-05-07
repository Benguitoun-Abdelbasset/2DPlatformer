import { Component } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent {
  signupForm: FormGroup;
  submitted = false;
  loading = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder, 
    private http: HttpClient,
    private router: Router
  ) {
    this.signupForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    }, { validators: this.passwordMatchValidator });
  }

  passwordMatchValidator(form: FormGroup) {
    return form.get('password')?.value === form.get('confirmPassword')?.value
      ? null : { mismatch: true };
  }

  get f() { return this.signupForm.controls; }

  onSubmit() {
    this.submitted = true;
    this.errorMessage = '';
    
    // Check if form is valid
    if (this.signupForm.invalid) {
      return;
    }
    
    // Show loading state
    this.loading = true;
    
    // Prepare request payload
    const signupRequest = {
      username: this.signupForm.value.username,
      password: this.signupForm.value.password
    };
    
    // Call the API directly to register user
    this.http.post('http://localhost:8080/auth/register', signupRequest)
      .subscribe({
        next: (response: any) => {
          console.log('Signup successful', response);
          // Navigate to login page or dashboard
          this.router.navigate(['/login']);
        },
        error: (error) => {
          console.error('Signup failed', error);
          this.errorMessage = error.error?.message || 'Registration failed. Please try again.';
          this.loading = false;
        },
        complete: () => {
          this.loading = false;
        }
      });
  }
}