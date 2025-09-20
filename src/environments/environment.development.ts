export const environment = {
  production: false,
  apiBaseUrl: 'http://localhost:8081',
  authEnabled: true,
  keycloak: { url: 'http://localhost:8080', realm: 'uni4', clientId: 'uni4-frontend' },
  fakeAuth: {
    enabled: true,
    email: 'dev@uni4.com',
    password: '123456',
    user: { id: 1, name: 'Dev Admin', email: 'dev@uni4.com', role: 'ADMIN' as const },
  },
};
