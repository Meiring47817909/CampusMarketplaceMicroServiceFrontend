import { Component } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, CommonModule],
  template: `
    <div class="card">
      <h2>Student Registration</h2>
      <form (ngSubmit)="onSubmit()">
        <div>
          <label>Username:</label>
          <input type="text" [(ngModel)]="username" name="username" required>
        </div>
        <div>
          <label>Password:</label>
          <input type="password" [(ngModel)]="password" name="password" required minlength="5">
        </div>
        <button type="submit">Register as Student</button>
      </form>
      <p *ngIf="error" class="error">{{error}}</p>
      <p *ngIf="success" class="success">{{success}}</p>
    </div>
  `,
  styles: [`
    .card { background: #f9f9f9; padding: 20px; border-radius: 8px; max-width: 400px; margin: 0 auto; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
    div { margin-bottom: 15px; }
    label { display: block; margin-bottom: 5px; }
    input { width: 100%; padding: 8px; box-sizing: border-box; }
    button { background: #28a745; color: white; padding: 10px 15px; border: none; border-radius: 4px; cursor: pointer; width: 100%;}
    .error { color: red; }
    .success { color: green; }
  `]
})
export class RegisterComponent {
  username = '';
  password = '';
  error = '';
  success = '';

  constructor(private api: ApiService, private router: Router) {}

  onSubmit() {
    this.api.register({ username: this.username, password: this.password }).subscribe({
      next: (res) => {
        this.success = 'Registered successfully! You can now login.';
        this.error = '';
        setTimeout(() => this.router.navigate(['/login']), 2000);
      },
      error: (err) => this.error = err.error?.error || 'Registration failed.'
    });
  }
}
