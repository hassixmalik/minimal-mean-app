import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';

@Component({
  selector: 'app-signin',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="center-container">
      <form [formGroup]="form" (ngSubmit)="signin()" class="auth-form">
        <h2>Sign In</h2>
        <input formControlName="email" placeholder="Email" type="email" />
        <input formControlName="password" placeholder="Password" type="password" />
        <button type="submit" [disabled]="form.invalid">Sign In</button>
        <div *ngIf="error" class="error">{{ error }}</div>
        <a routerLink="/forgot-password">Forgot Password?</a>
        <a routerLink="/signup">Don't have an account?</a>
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
export class SigninComponent {
  form: FormGroup;
  error = '';
  constructor(private fb: FormBuilder, private router: Router, private auth: AuthService) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }
  async signin() {
    if (this.form.invalid) return;
    this.error = '';
    try {
      const res = await fetch('/api/signin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(this.form.value),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Signin failed');
      this.auth.setSession(data);
      this.router.navigate(['/dashboard']);
    } catch (e: any) {
      this.error = e.message;
    }
  }
} 