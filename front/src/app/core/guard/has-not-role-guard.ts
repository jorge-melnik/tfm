import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { UserStore } from '@shared/services/stores/user.store';
import { Rol } from '@shared/types/user.types';

export const hasNotRoleGuard = (notAllowedRoles: Rol | Rol[]): CanActivateFn => {
  return (route, state) => {
    const userStore = inject(UserStore);
    const router = inject(Router);
    const usuario = userStore.user();

    if (!usuario) {
      return router.createUrlTree(['/auth/login']);
    }

    const roles = Array.isArray(notAllowedRoles) ? notAllowedRoles : [notAllowedRoles];

    for (const rol of roles) {
      //Verifico que no incluya alguno de los roles
      if (usuario.roles.includes(rol)) return router.createUrlTree(['/auth/unauthorized']);
    }

    return true;
  };
};
