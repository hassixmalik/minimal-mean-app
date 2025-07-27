import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="center-container">
      <form [formGroup]="form" (ngSubmit)="signup()" class="auth-form">
        <h2>Sign Up</h2>
        <input formControlName="name" placeholder="Name" />
        <input formControlName="email" placeholder="Email" type="email" />
        <input formControlName="password" placeholder="Password" type="password" />
        <button type="submit" [disabled]="form.invalid">Sign Up</button>
        <div *ngIf="error" class="error">{{ error }}</div>
        <a routerLink="/signin">Already have an account?</a>
      </form>
    </div>
  `,
  styles: [`
    .center-container { min-height: 100vh; display: flex; align-items: center; justify-content: center; }
    .auth-form { display: flex; flex-direction: column; gap: 1rem; width: 300px; background: #fff; padding: 2rem; border-radius: 8px; box-shadow: 0 2px 8px #0001; }
    input { padding: 0.5rem; border: 1px solid #ccc; border-radius: 4px; }
    button { padding: 0.5rem; border: none; background: #1976d2; color: #fff; border-radius: 4px; cursor: pointer; }
    .error { color: #d32f2f; font-size: 0.9em; }
    a { text-align: center; color: #1976d2; text-decoration: none; font-size: 0.95em; }
  `]
})
export class SignupComponent {
  form: FormGroup;
  error = '';
  constructor(private fb: FormBuilder, private router: Router) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }
  async signup() {
    if (this.form.invalid) return;
    this.error = '';
    try {
      const res = await fetch('/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(this.form.value),
      });
      if (!res.ok) throw new Error((await res.json()).message || 'Signup failed');
      this.router.navigate(['/signin']);
    } catch (e: any) {
      this.error = e.message;
    }
  }
} 