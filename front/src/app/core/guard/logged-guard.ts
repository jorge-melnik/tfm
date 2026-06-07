import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { DialogService } from '@shared/services/dialog.service';
import { UserStore } from '@shared/services/stores/user.store';

export const loggedGuard: CanActivateFn = (route, state) => {
  const userStore = inject(UserStore);
  const router = inject(Router);
  const usuario = userStore.user();
  const dialogService = inject(DialogService);

  if (!usuario) {
    dialogService.addWarn('Debes iniciar sesión');
    console.log();
    return router.createUrlTree(['/auth/login']);
  }

  //Si hay usuario
  return true;
};
