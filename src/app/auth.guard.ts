import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './services/auth.service';

export const authGuard = (route: any, state: any) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAuthenticated()) {
    return true;
  }

  // Si le token a expiré, le supprimer et rediriger vers la connexion
  if (authService.isTokenExpired()) {
    authService.logout();
  }

  // Redirect to login if not authenticated
  router.navigate(['/connexion']);
  return false;
};
