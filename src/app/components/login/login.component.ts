import { Component } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule],
  template: `
    <div class="card">
      <h2>Login</h2>
      <form (ngSubmit)="onSubmit()">
        <div>
          <label>Username:</label>
          <input type="text" [(ngModel)]="username" name="username" required>
        </div>
        <div>
          <label>Password:</label>
          <input type="password" [(ngModel)]="password" name="password" required>
        </div>
        <button type="submit">Login</button>
      </form>
      <p *ngIf="error" class="error">{{error}}</p>
      <p>Use 'admin' and 'admin123' for the admin account.</p>
    </div>
  `,
  styles: [`
    .card { background: #f9f9f9; padding: 20px; border-radius: 8px; max-width: 400px; margin: 0 auto; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
    div { margin-bottom: 15px; }
    label { display: block; margin-bottom: 5px; }
    input { width: 100%; padding: 8px; box-sizing: border-box; }
    button { background: #003b5c; color: white; padding: 10px 15px; border: none; border-radius: 4px; cursor: pointer; width: 100%;}
    .error { color: red; }
  `]
})
export class LoginComponent {
  username = '';
  password = '';
  error = '';

  constructor(private api: ApiService, private auth: AuthService, private router: Router) {}

  onSubmit() {
    this.api.login({ username: this.username, password: this.password }).subscribe({
      next: (res) => {
        this.auth.setAuthData(res.token, res.role, res.username);
        if (res.role === 'Admin') this.router.navigate(['/admin']);
        else this.router.navigate(['/store']);
      },
      error: (err) => this.error = 'Login failed. Check credentials.'
    });
  }
}
