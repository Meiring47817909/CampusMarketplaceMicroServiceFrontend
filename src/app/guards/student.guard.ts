import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const studentGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isStudent()) {
    return true;
  }

  // Redirect to admin if admin, otherwise login
  if (authService.isAdmin()) {
    return router.parseUrl('/admin');
  }
  return router.parseUrl('/login');
};
