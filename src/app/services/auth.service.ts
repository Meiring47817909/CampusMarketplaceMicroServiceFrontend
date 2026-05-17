import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private tokenKey = 'jwt_token';
  private roleKey = 'user_role';
  private usernameKey = 'username';

  constructor() { }

  setAuthData(token: string, role: string, username: string) {
    localStorage.setItem(this.tokenKey, token);
    localStorage.setItem(this.roleKey, role);
    localStorage.setItem(this.usernameKey, username);
  }

  clearAuthData() {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.roleKey);
    localStorage.removeItem(this.usernameKey);
  }

  getToken(): string | null { return localStorage.getItem(this.tokenKey); }
  getRole(): string | null { return localStorage.getItem(this.roleKey); }
  getUsername(): string | null { return localStorage.getItem(this.usernameKey); }

  isLoggedIn(): boolean { return !!this.getToken(); }
  isAdmin(): boolean { return this.getRole() === 'Admin'; }
  isStudent(): boolean { return this.getRole() === 'Student'; }
}
