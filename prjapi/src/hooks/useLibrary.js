import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * Biblioteca pessoal da conta: FAVORITOS e HISTÓRICO ("Continuar assistindo").
 * Cada conta tem a sua, salva no localStorage com a chave "cinescope:library:v1:<email>".
 */
const MAX_HISTORY = 30;
const PROGRESS_START = 8; // % ao dar o primeiro "Assistir"
const PROGRESS_STEP = 17; // % somados a cada novo "Assistir" (simulação, não há vídeo)
const PROGRESS_MAX = 95;

const EMPTY = { favorites: [], history: [] };
const keyFor = (email) => `cinescope:library:v1:${email}`;

// Campos guardados de cada título (assim o card aparece sem nova consulta à API)
const FIELDS = ['id', 'titulo', 'ano', 'tipo', 'poster', 'classificacao', 'duracao', 'generos', 'sinopse', 'rating', 'backdrop'];

function snapshot(item) {
  const copy = {};
  for (const field of FIELDS) {
    if (item[field] != null) copy[field] = item[field];
  }
  return copy;
}

function load(email) {
  if (!email) return EMPTY;
  try {
    const raw = JSON.parse(localStorage.getItem(keyFor(email)));
    return {
      favorites: Array.isArray(raw?.favorites) ? raw.favorites : [],
      history: Array.isArray(raw?.history) ? raw.history : [],
    };
  } catch {
    return EMPTY;
  }
}

function save(email, data) {
  try {
    localStorage.setItem(keyFor(email), JSON.stringify(data));
  } catch {
    /* storage cheio ou bloqueado: ignora */
  }
}

/**
 * @param {{name: string, email: string} | null} user
 */
export default function useLibrary(user) {
  const email = user?.email ?? null;
  const [owner, setOwner] = useState(email);
  const [data, setData] = useState(() => load(email));

  // Quando entra outro usuário (login/logout), carrega a biblioteca dele ainda neste render
  if (owner !== email) {
    setOwner(email);
    setData(load(email));
  }

  const dataRef = useRef(data);
  dataRef.current = data;

  // Salva a cada alteração
  useEffect(() => {
    if (email && owner === email) save(email, data);
  }, [email, owner, data]);

  const isFavorite = useCallback((id) => data.favorites.some((f) => f.id === id), [data.favorites]);

  const toggleFavorite = useCallback((item) => {
    setData((prev) => {
      const exists = prev.favorites.some((f) => f.id === item.id);
      const favorites = exists
        ? prev.favorites.filter((f) => f.id !== item.id)
        : [snapshot(item), ...prev.favorites];
      return { ...prev, favorites };
    });
  }, []);

  const addFavorite = useCallback((item) => {
    setData((prev) =>
      prev.favorites.some((f) => f.id === item.id)
        ? prev
        : { ...prev, favorites: [snapshot(item), ...prev.favorites] }
    );
  }, []);

  /** Registra (ou avança) o progresso do título. Devolve a porcentagem atual. */
  const startWatching = useCallback((item) => {
    const existing = dataRef.current.history.find((h) => h.id === item.id);
    const progress = existing ? Math.min(PROGRESS_MAX, (existing.progress ?? 0) + PROGRESS_STEP) : PROGRESS_START;

    setData((prev) => ({
      ...prev,
      history: [
        { ...snapshot(item), progress, watchedAt: Date.now() },
        ...prev.history.filter((h) => h.id !== item.id),
      ].slice(0, MAX_HISTORY),
    }));

    return progress;
  }, []);

  const clearHistory = useCallback(() => setData((prev) => ({ ...prev, history: [] })), []);

  return {
    favorites: data.favorites,
    history: data.history,
    isFavorite,
    toggleFavorite,
    addFavorite,
    startWatching,
    clearHistory,
  };
}