import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AuthService {
  setSession(data: { token: string; expiresAt: number; user: any }) {
    localStorage.setItem('token', data.token);
    localStorage.setItem('expiresAt', data.expiresAt.toString());
    localStorage.setItem('user', JSON.stringify(data.user));
  }
  getToken() {
    return localStorage.getItem('token');
  }
  getUser() {
    const u = localStorage.getItem('user');
    return u ? JSON.parse(u) : null;
  }
  getExpiry() {
    return +(localStorage.getItem('expiresAt') || 0);
  }
  isLoggedIn() {
    return !!this.getToken() && Date.now() < this.getExpiry();
  }
  signout() {
    localStorage.clear();
  }
} 