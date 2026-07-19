import { HttpInterceptorFn, HttpErrorResponse, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, firstValueFrom } from 'rxjs';
import { UserStore } from '@shared/services/stores/user.store';
import { AuthService } from '@shared/services/auth.service';

export const tokenInterceptor: HttpInterceptorFn = (req, next) => {
  const userStore = inject(UserStore);
  const authService = inject(AuthService);
  const token = userStore.token();
  if (!token) return next(req);

  const authReq = addToken(req, token);

  return next(authReq).pipe(
    catchError(async (error) => {
      if (error instanceof HttpErrorResponse && error.status === 401) {
        try {
          if (req.url.includes('/auth/refresh')) throw error; //para que no entre en bucle si el error fue en la ruta de refrescar el token o si ni siquiera hay token.

          await authService.refreshToken();
          const token = userStore.token(); //Nuevo token
          if (!token) throw error; //Si por las moscas no hay nuevo token
          return firstValueFrom(next(addToken(req, token)));
        } catch {
          await authService.doLogout();
          throw error;
        }
      }
      throw error;
    }),
  );
};

function addToken(req: HttpRequest<unknown>, token: string) {
  return req.clone({
    setHeaders: { Authorization: `Bearer ${token}` },
  });
}
