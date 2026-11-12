import { useCallback, useState } from 'react';
import { getSessionUser, loginUser, logoutUser, registerUser } from '../utils/auth.js';

/**
 * Estado de autenticação. A sessão é restaurada do localStorage ao abrir o site.
 * login/register devolvem uma Promise que rejeita com a mensagem de erro (para o formulário exibir).
 */
export default function useAuth() {
  const [user, setUser] = useState(getSessionUser);

  const login = useCallback(async (credentials) => {
    setUser(await loginUser(credentials));
  }, []);

  const register = useCallback(async (data) => {
    setUser(await registerUser(data));
  }, []);

  const logout = useCallback(() => {
    logoutUser();
    setUser(null);
  }, []);

  return { user, login, register, logout };
}