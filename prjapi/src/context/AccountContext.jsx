import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import useAuth from '../hooks/useAuth.js';
import useLibrary from '../hooks/useLibrary.js';
import AuthModal from '../components/AuthModal.jsx';

/**
 * Contexto da conta: usuário, favoritos, histórico e o modal de login.
 * Assim TitleCard, HeroBanner, MovieModal e Navbar acessam tudo sem
 * precisar repassar props por vários componentes.
 */
const AccountContext = createContext(null);

export function AccountProvider({ children }) {
  const { user, login: doLogin, register: doRegister, logout: doLogout } = useAuth();
  const library = useLibrary(user);
  const { favorites, history, isFavorite, toggleFavorite: toggleSaved, addFavorite, startWatching, clearHistory } = library;

  // authReason: null = modal fechado; string = modal aberto ('' = sem mensagem)
  const [authReason, setAuthReason] = useState(null);
  // título que o usuário tentou favoritar antes de entrar (é salvo depois do login)
  const pendingFavorite = useRef(null);

  const openAuth = useCallback((reason = '') => setAuthReason(reason), []);

  const closeAuth = useCallback(() => {
    pendingFavorite.current = null;
    setAuthReason(null);
  }, []);

  const login = useCallback(
    async (credentials) => {
      await doLogin(credentials);
      setAuthReason(null);
    },
    [doLogin]
  );

  const register = useCallback(
    async (data) => {
      await doRegister(data);
      setAuthReason(null);
    },
    [doRegister]
  );

  const logout = useCallback(() => {
    pendingFavorite.current = null;
    doLogout();
  }, [doLogout]);

  // Sem login, o coração abre o modal de entrada e guarda o título para salvar depois
  const toggleFavorite = useCallback(
    (item) => {
      if (!user) {
        pendingFavorite.current = item;
        setAuthReason('Entre na sua conta para salvar seus favoritos.');
        return;
      }
      toggleSaved(item);
    },
    [user, toggleSaved]
  );

  // Depois do login, salva o favorito que estava pendente
  useEffect(() => {
    if (!user || !pendingFavorite.current) return;
    addFavorite(pendingFavorite.current);
    pendingFavorite.current = null;
  }, [user, addFavorite]);

  const value = useMemo(
    () => ({
      user,
      logout,
      favorites,
      history,
      isFavorite,
      toggleFavorite,
      startWatching,
      clearHistory,
      openAuth,
      authOpen: authReason !== null,
    }),
    [user, logout, favorites, history, isFavorite, toggleFavorite, startWatching, clearHistory, openAuth, authReason]
  );

  return (
    <AccountContext.Provider value={value}>
      {children}
      {authReason !== null && (
        <AuthModal reason={authReason} onClose={closeAuth} onLogin={login} onRegister={register} />
      )}
    </AccountContext.Provider>
  );
}

export function useAccount() {
  const context = useContext(AccountContext);
  if (!context) throw new Error('useAccount precisa ser usado dentro de <AccountProvider>.');
  return context;
}