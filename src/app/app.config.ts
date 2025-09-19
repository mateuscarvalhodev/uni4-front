import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { appRoutes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import {
  provideKeycloak,
  includeBearerTokenInterceptor,
  INCLUDE_BEARER_TOKEN_INTERCEPTOR_CONFIG,
  createInterceptorCondition,
  IncludeBearerTokenCondition,
} from 'keycloak-angular';
import { environment } from '../environments/environment';

const apiUrl = environment.apiBaseUrl;
const urlCondition = createInterceptorCondition<IncludeBearerTokenCondition>({
  urlPattern: new RegExp(`^${apiUrl.replace(/[.*+?^${}()|[\\]\\]/g, '\\$&')}(\\/.*)?$`, 'i'),
  bearerPrefix: 'Bearer',
});

const browserProvidersAuthOn = [
  provideKeycloak({
    config: {
      url: environment.keycloak.url,
      realm: environment.keycloak.realm,
      clientId: environment.keycloak.clientId,
    },
    initOptions: {
      onLoad: 'check-sso',
      checkLoginIframe: false,
      pkceMethod: 'S256',
    },
  }),
  { provide: INCLUDE_BEARER_TOKEN_INTERCEPTOR_CONFIG, useValue: [urlCondition] },
  provideHttpClient(withInterceptors([includeBearerTokenInterceptor])),
];

const browserProvidersAuthOff = [provideHttpClient()];
const serverProviders = [provideHttpClient()];

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(appRoutes),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideHttpClient(),
  ],
};
