import { CanActivateFn } from '@angular/router';

export const isProductorGuard: CanActivateFn = (route, state) => {
  return true;
};
