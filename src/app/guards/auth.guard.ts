import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  if (auth.loading()) {
    // Wait for session restore — in practice loading resolves quickly
    return auth.isAuthenticated();
  }

  if (auth.isAuthenticated()) return true;

  router.navigate(['/login'], { queryParams: { from: state.url } });
  return false;
};
