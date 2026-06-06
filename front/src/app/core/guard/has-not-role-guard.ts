import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { UserStore } from '@shared/services/stores/user.store';

export const hasNotRoleGuard = (notAllowedRoles: string | string[]): CanActivateFn => {
  return (route, state) => {
    const userStore = inject(UserStore);
    const router = inject(Router);
    const usuario = userStore.user();

    if (!usuario) {
      return router.createUrlTree(['/auth/login']);
    }

    const roles = Array.isArray(notAllowedRoles) ? notAllowedRoles : [notAllowedRoles];

    if (roles.includes(usuario.rol_actual)) {
      return router.createUrlTree(['/auth/unauthorized']);
    }

    return true;
  };
};
