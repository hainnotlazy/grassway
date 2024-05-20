import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { isAuthenticated, removeAccessToken } from '../helpers/local-storage.helper';

const publicRoutes = [
]

export const authGuard: CanActivateFn = (route, state) => {
  const jwtService = inject(JwtHelperService);
  const router = inject(Router);
  const currentUrl = state.url;

  // Public routes
  // TODO: Use public routes array
  if (currentUrl === "/" || currentUrl === "/auth/success-authentication") {
    if (isAuthenticated() && !jwtService.isTokenExpired()) {
      router.navigate(["/u/links"]);
      return false;
    }
    return true;
  }

  // Protected routes
  if (!jwtService.isTokenExpired()) {
    return true;
  } else {
    removeAccessToken();
    router.navigate(["/"]);
    return false;
  }
};
