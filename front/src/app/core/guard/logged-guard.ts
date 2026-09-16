import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { UserStore } from '@shared/services/stores/user.store';

export const loggedGuard: CanActivateFn = (route, state) => {
  const userStore = inject(UserStore);
  const router = inject(Router);
  const usuario = userStore.user();

  if (!usuario) {
    return router.createUrlTree(['/auth/login']);
  }

  return true;
};
