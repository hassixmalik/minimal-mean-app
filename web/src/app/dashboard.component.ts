import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="center-container">
      <div class="dashboard-card">
        <h2>Welcome, {{ user?.name }}</h2>
        <div>Session expires in: <b>{{ countdown }}</b></div>
        <button (click)="signout()">Sign Out</button>
      </div>
    </div>
  `,
  styles: [`
    .center-container { min-height: 100vh; display: flex; align-items: center; justify-content: center; }
    .dashboard-card { display: flex; flex-direction: column; gap: 1.5rem; width: 320px; background: #fff; padding: 2rem; border-radius: 8px; box-shadow: 0 2px 8px #0001; align-items: center; }
    button { padding: 0.5rem 1.5rem; border: none; background: #1976d2; color: #fff; border-radius: 4px; cursor: pointer; }
    h2 { margin-bottom: 0.5rem; }
  `]
})
export class DashboardComponent implements OnInit, OnDestroy {
  user: any = null;
  countdown = '';
  private timer: any;
  constructor(private auth: AuthService, private router: Router) {}
  ngOnInit() {
    if (!this.auth.isLoggedIn()) {
      this.router.navigate(['/signin']);
      return;
    }
    this.user = this.auth.getUser();
    this.updateCountdown();
    this.timer = setInterval(() => this.updateCountdown(), 1000);
  }
  ngOnDestroy() {
    clearInterval(this.timer);
  }
  updateCountdown() {
    const ms = this.auth.getExpiry() - Date.now();
    if (ms <= 0) {
      this.signout();
      return;
    }
    const s = Math.floor(ms / 1000) % 60;
    const m = Math.floor(ms / 1000 / 60) % 60;
    const h = Math.floor(ms / 1000 / 60 / 60);
    this.countdown = `${h}h ${m}m ${s}s`;
  }
  signout() {
    this.auth.signout();
    this.router.navigate(['/signin']);
  }
} 