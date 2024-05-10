import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { removeAccessToken } from '../utils/local-storage.util';

const publicRoutes = [
]

export const authGuard: CanActivateFn = (route, state) => {
  const jwtService = inject(JwtHelperService);
  const router = inject(Router);
  const currentUrl = state.url;

  // Public routes
  if (currentUrl === "/") {
    return true;
  }

  // Protected routes
  if (!jwtService.isTokenExpired()) {
    return true;
  } else {
    alert(132);
    removeAccessToken();
    router.navigate(["/"]);
    return false;
  }
};
