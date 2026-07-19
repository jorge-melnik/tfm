import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { DialogService } from '@shared/services/dialog.service';
import { UserStore } from '@shared/services/stores/user.store';

export const unloggedGuard: CanActivateFn = (route, state) => {
  const userStore = inject(UserStore);
  const router = inject(Router);
  const usuario = userStore.user();
  const dialogService = inject(DialogService);
  if (usuario) {
    const rolActual = usuario.rol_actual.toLowerCase();
    dialogService.addWarn('Ya estás registrado. Te redireccionamos al home de ' + rolActual);
    return router.createUrlTree([`/${rolActual}`]);
  }
  //Si hay usuario
  return true;
};
