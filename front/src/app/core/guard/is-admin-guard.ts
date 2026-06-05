import { inject } from '@angular/core';
import { CanActivateFn, Router, RouterLink } from '@angular/router';
import { UserStore } from '@shared/services/stores/user.store';

export const isAdminGuard: CanActivateFn = (route, state) => {
  const userStore = inject(UserStore);
  const router = inject(Router);
  const usuario = userStore.user();

  if (!usuario) {
    return router.createUrlTree(['/auth/login']);
  }

  if (usuario.rol_actual !== 'ADMIN') {
    return router.createUrlTree(['/auth/unauthorized']);
  }

  return true;
};
