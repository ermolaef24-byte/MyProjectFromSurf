import { api } from './client';

export function requestAuthCode(phone: string): Promise<{ retry_after: number }> {
  return api.post('/auth/request-code', { phone });
}

export function verifyAuthCode(phone: string, code: string): Promise<{ token: string }> {
  return api.post('/auth/verify-code', { phone, code });
}

export function logout(): Promise<void> {
  return api.post('/auth/logout');
}
