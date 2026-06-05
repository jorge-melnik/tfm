import { CanActivateFn } from '@angular/router';

export const isConsumidorGuard: CanActivateFn = (route, state) => {
  return true;
};
