import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { UserStore } from '@shared/services/stores/user.store';
import { Rol } from '@shared/types/user.types';

/**
 * Guard para verificar si el rol actual del usuario coincide con el especificado
 * @param rol
 * @returns
 */
export const activeRoleGuard = (rol: Rol): CanActivateFn => {
  return (route, state) => {
    const userStore = inject(UserStore);
    const router = inject(Router);
    const usuario = userStore.user();

    if (!usuario) {
      return router.createUrlTree(['/auth/login']);
    }

    if (usuario.rol_actual !== rol) {
      return router.createUrlTree(['/auth/unauthorized']);
    }

    return true;
  };
};
