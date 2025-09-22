export const environment = {
  production: false,
  apiBaseUrl: '/api',
  // authBaseUrl: '/auth',
  authBaseUrl: 'http://localhost:8080/auth',
  authEnabled: true,
  keycloak: {
    url: 'https://keycloak.dominio.com',
    realm: 'uni4',
    clientId: 'uni4-frontend',
  },
};
