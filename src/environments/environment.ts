export const environment = {
  production: true,
  apiBaseUrl: 'https://api.seu-dominio.com',
  authEnabled: true,
  keycloak: {
    url: 'https://keycloak.seu-dominio.com',
    realm: 'uni4',
    clientId: 'uni4-frontend',
  },
  fakeAuth: {
    enabled: false,
    email: '',
    password: '',
    user: {
      id: 0,
      name: '',
      email: '',
      role: 'ALUNO' as const,
    },
  },
};
