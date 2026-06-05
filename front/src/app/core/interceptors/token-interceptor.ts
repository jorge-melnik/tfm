import { HttpInterceptorFn, HttpErrorResponse, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, firstValueFrom } from 'rxjs';
import { UserStore } from '@shared/services/stores/user.store';
import { AuthService } from '@shared/services/auth.service';

export const tokenInterceptor: HttpInterceptorFn = (req, next) => {
  const userStore = inject(UserStore);
  const authService = inject(AuthService);

  const authReq = addToken(req, userStore.token());

  return next(authReq).pipe(
    catchError(async (error) => {
      if (error instanceof HttpErrorResponse && error.status === 401) {
        try {
          await authService.refreshToken();
          return firstValueFrom(next(addToken(req, userStore.token())));
        } catch {
          authService.doLogout();
          throw error;
        }
      }
      throw error;
    }),
  );
};

function addToken(req: HttpRequest<unknown>, token: string | null) {
  if (!token) return req;
  return req.clone({
    setHeaders: { Authorization: `Bearer ${token}` },
  });
}
