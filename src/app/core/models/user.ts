export type Role = 'ADMIN' | 'COORDENADOR' | 'PROFESSOR' | 'ALUNO';

export interface User {
  id: number;
  name: string;
  email: string;
  role: Role;
}
