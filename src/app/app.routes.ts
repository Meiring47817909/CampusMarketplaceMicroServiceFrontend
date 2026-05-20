import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { AdminDashboardComponent } from './components/admin-dashboard/admin-dashboard.component';
import { StorefrontComponent } from './components/storefront/storefront.component';

import { adminGuard } from './guards/admin.guard';
import { studentGuard } from './guards/student.guard';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'admin', component: AdminDashboardComponent, canActivate: [adminGuard] },
  { path: 'store', component: StorefrontComponent },
  { path: '', redirectTo: '/store', pathMatch: 'full' }
];
