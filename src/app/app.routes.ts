import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { AdminDashboardComponent } from './components/admin-dashboard/admin-dashboard.component';
import { StorefrontComponent } from './components/storefront/storefront.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'admin', component: AdminDashboardComponent },
  { path: 'store', component: StorefrontComponent },
  { path: '', redirectTo: '/login', pathMatch: 'full' }
];
