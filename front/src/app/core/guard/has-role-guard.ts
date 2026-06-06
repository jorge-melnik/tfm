import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { UserStore } from '@shared/services/stores/user.store';

export const hasRoleGuard = (allowedRoles: string | string[]): CanActivateFn => {
  return (route, state) => {
    const userStore = inject(UserStore);
    const router = inject(Router);
    const usuario = userStore.user();

    if (!usuario) {
      return router.createUrlTree(['/auth/login']);
    }

    const roles = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];

    if (!roles.includes(usuario.rol_actual)) {
      return router.createUrlTree(['/auth/unauthorized']);
    }

    return true;
  };
};
