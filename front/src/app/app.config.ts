import {
  ApplicationConfig,
  inject,
  provideAppInitializer,
  provideBrowserGlobalErrorListeners,
} from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';

import { routes } from './app.routes';

import { providePrimeNG } from 'primeng/config';
import Aura from '@primeuix/themes/aura';
import { ConfirmationService, MessageService } from 'primeng/api';
import { provideHttpClient, withInterceptors, withXhr } from '@angular/common/http';
import { tokenInterceptor } from '@core/interceptors/token-interceptor';
import { AuthService } from '@shared/services/auth.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes, withComponentInputBinding()),
    provideHttpClient(withXhr(), withInterceptors([tokenInterceptor])),
    providePrimeNG({
      theme: {
        preset: Aura,
      },
      license:
        'eyJpZCI6ImExMWVjOWNjLWExYmUtNDA0Mi05MDQ4LTFmZjJlMDY3MDliNSIsInByb2R1Y3QiOiJwcmltZXVpIiwidGllciI6ImNvbW11bml0eSIsInR5cGUiOiJkZXYiLCJpYXQiOjE3ODQzMTU1MTgsImV4cCI6MTgxNTg1MTUxOH0.Az3vPUIjI4lf9XE_5uCIlv_P_YTWZOLP3JX50uwyjeBYkbirzY92lU2OZJVEugMbF41B7g1ym3lzlTXVJjmuAA',
    }),
    MessageService,
    ConfirmationService,
    provideAppInitializer(() => {
      const authService = inject(AuthService);
      return authService.cargarSesionAlArrancar();
    }),
  ],
};
