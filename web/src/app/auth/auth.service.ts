import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = 'http://localhost:3000'; // Update if different
  private tokenKey = 'auth_token';

  constructor(private http: HttpClient, private router: Router) {}

  signup(data: any) {
    return this.http.post(`${this.apiUrl}/signup`, data);
  }

  signin(data: any) {
    return this.http.post(`${this.apiUrl}/signin`, data);
  }

  forgotPassword(email: string) {
    return this.http.post(`${this.apiUrl}/forgot-password`, { email });
  }

  logout() {
    localStorage.removeItem(this.tokenKey);
    this.router.navigate(['/signin']);
  }

  saveToken(token: string) {
    localStorage.setItem(this.tokenKey, token);
  }

  getToken() {
    return localStorage.getItem(this.tokenKey);
  }

  isLoggedIn() {
    return !!this.getToken();
  }

  getTokenExpiration(): number {
    const token = this.getToken();
    if (!token) return 0;
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.exp * 1000; // convert to ms
  }

  getUsername(): string {
    const token = this.getToken();
    if (!token) return '';
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.username;
  }
}
