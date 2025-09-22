export type Role = 'ADMIN' | 'COORDENADOR' | 'PROFESSOR' | 'ALUNO' | 'user';

export interface AuthUser {
  id: number;
  name: string;
  email: string;
  role: Role;
}

export interface LoginRequestDTO {
  username: string;
  password: string;
}

export interface LoginResponseDTO {
  accessToken?: string;
  token?: string;
  jwt?: string;
  refreshToken?: string;
}

export interface RegisterRequestDTO {
  name: string;
  email: string;
  password: string;
  role: Role;
}
