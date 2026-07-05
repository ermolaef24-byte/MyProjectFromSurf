import { useState, useCallback } from 'react';
import { getToken, setToken, clearToken } from '../api/client';
import { requestAuthCode, verifyAuthCode, logout as apiLogout } from '../api/auth';

interface AuthState {
  token: string | null;
  loading: boolean;
}

export function useAuth() {
  const [state, setState] = useState<AuthState>(() => ({
    token: getToken(),
    loading: false,
  }));

  const isAuthenticated = !!state.token;

  const sendCode = useCallback(async (phone: string) => {
    setState(s => ({ ...s, loading: true }));
    try {
      const result = await requestAuthCode(phone);
      return result.retry_after;
    } finally {
      setState(s => ({ ...s, loading: false }));
    }
  }, []);

  const verifyCode = useCallback(async (phone: string, code: string) => {
    setState(s => ({ ...s, loading: true }));
    try {
      const result = await verifyAuthCode(phone, code);
      setToken(result.token);
      setState({ token: result.token, loading: false });
      return true;
    } catch {
      setState(s => ({ ...s, loading: false }));
      return false;
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await apiLogout();
    } catch {
      // ignore
    }
    clearToken();
    setState({ token: null, loading: false });
  }, []);

  return { isAuthenticated, loading: state.loading, sendCode, verifyCode, logout };
}
