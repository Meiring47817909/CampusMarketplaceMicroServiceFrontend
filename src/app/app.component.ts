import { Component } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';
import { AuthService } from './services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, CommonModule],
  template: `
    <div class="container">
      <nav>
        <h1>Campus Marketplace</h1>
        <div class="nav-links">
          <a routerLink="/store">Storefront</a>
          <a *ngIf="!authService.isLoggedIn()" routerLink="/login">Login</a>
          <a *ngIf="!authService.isLoggedIn()" routerLink="/register">Register</a>
          <a *ngIf="authService.isAdmin()" routerLink="/admin">Admin Dashboard</a>
          <button *ngIf="authService.isLoggedIn()" (click)="logout()">Logout ({{authService.getUsername()}})</button>
        </div>
      </nav>
      <main>
        <router-outlet></router-outlet>
      </main>
    </div>
  `,
  styles: [`
    .container { font-family: Arial, sans-serif; max-width: 1200px; margin: 0 auto; padding: 20px; }
    nav { display: flex; justify-content: space-between; align-items: center; background: #003b5c; color: white; padding: 15px 30px; border-radius: 8px; margin-bottom: 20px;}
    nav h1 { margin: 0; }
    .nav-links a, .nav-links button { color: white; text-decoration: none; margin-left: 15px; background: none; border: none; cursor: pointer; font-size: 16px;}
    .nav-links a:hover, .nav-links button:hover { text-decoration: underline; }
  `]
})
export class AppComponent {
  constructor(public authService: AuthService) {}

  logout() {
    this.authService.clearAuthData();
    window.location.href = '/login';
  }
}
