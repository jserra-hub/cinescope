import { useCallback, useEffect, useState } from 'react';
import { fetchMixed } from '../services/mixedSearch.js';
import { readCache, writeCache } from '../utils/cache.js';

const CACHE_PREFIX = 'cinescope:genre:v1:';
const CACHE_TTL = 6 * 60 * 60 * 1000; // 6 horas

/**
 * Carrega a página de um gênero (ver data/genres.js): busca todos os termos
 * do gênero, mistura os resultados e guarda em cache.
 *
 * @returns {{items: Array, status: 'loading'|'success'|'error', error: string, retry: () => void}}
 */
export default function useGenre(genre) {
  const [state, setState] = useState({ items: [], status: 'loading', error: '' });
  const [attempt, setAttempt] = useState(0); // aumenta ao clicar em "Tentar novamente"

  useEffect(() => {
    const key = `${CACHE_PREFIX}${genre.id}`;
    const cached = readCache(key, CACHE_TTL);

    if (cached) {
      setState({ items: cached, status: 'success', error: '' });
      return undefined;
    }

    const controller = new AbortController();
    setState({ items: [], status: 'loading', error: '' });

    fetchMixed({
      terms: genre.terms,
      type: genre.type,
      perTerm: genre.perTerm,
      limit: genre.limit,
      signal: controller.signal,
    })
      .then((items) => {
        if (items.length === 0) throw new Error('Nenhum título encontrado nesta categoria.');
        writeCache(key, items);
        setState({ items, status: 'success', error: '' });
      })
      .catch((err) => {
        if (err.name === 'AbortError') return;
        setState({ items: [], status: 'error', error: err.message });
      });

    return () => controller.abort();
  }, [genre, attempt]);

  const retry = useCallback(() => setAttempt((a) => a + 1), []);

  return { ...state, retry };
}