import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { DialogService } from '@shared/services/dialog.service';
import { UserStore } from '@shared/services/stores/user.store';

export const isProductorOwnerGuard: CanActivateFn = (route, state) => {
  const userStore = inject(UserStore);
  const router = inject(Router);
  const dialogService = inject(DialogService);

  const productorParam = route.parent?.paramMap.get('productor');

  const username = userStore.user()?.username;

  if (username && productorParam === username) {
    return true;
  }

  dialogService.addWarn('No puedes acceder a los datos de otro productor.');
  return router.createUrlTree(['/']);
};
