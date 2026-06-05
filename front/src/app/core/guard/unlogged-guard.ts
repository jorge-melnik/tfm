import { CanActivateFn } from '@angular/router';

export const unloggedGuard: CanActivateFn = (route, state) => {
  return true;
};
