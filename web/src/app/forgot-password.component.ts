import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="center-container">
      <form [formGroup]="form" (ngSubmit)="submit()" class="auth-form">
        <h2>Forgot Password</h2>
        <input formControlName="email" placeholder="Email" type="email" />
        <button type="submit" [disabled]="form.invalid">Send Reset Link</button>
        <div *ngIf="message" class="info">{{ message }}</div>
        <a routerLink="/signin">Back to Sign In</a>
      </form>
    </div>
  `,
  styles: [`
    .center-container { min-height: 100vh; display: flex; align-items: center; justify-content: center; }
    .auth-form { display: flex; flex-direction: column; gap: 1rem; width: 300px; background: #fff; padding: 2rem; border-radius: 8px; box-shadow: 0 2px 8px #0001; }
    input { padding: 0.5rem; border: 1px solid #ccc; border-radius: 4px; }
    button { padding: 0.5rem; border: none; background: #1976d2; color: #fff; border-radius: 4px; cursor: pointer; }
    .info { color: #388e3c; font-size: 0.95em; }
    a { text-align: center; color: #1976d2; text-decoration: none; font-size: 0.95em; }
  `]
})
export class ForgotPasswordComponent {
  form: FormGroup;
  message = '';
  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }
  async submit() {
    if (this.form.invalid) return;
    this.message = '';
    await fetch('/api/forgot-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(this.form.value),
    });
    this.message = 'If the email exists, a reset link was sent.';
  }
} 