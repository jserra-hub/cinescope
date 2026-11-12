import { useCallback, useEffect, useState } from 'react';
import { searchTitles } from '../services/omdb.js';

/**
 * Encapsula toda a lógica de busca por título (estado + chamada à API).
 * Mudar termo, tipo ou página dispara uma nova requisição (useEffect).
 */
export default function useSearch() {
  const [params, setParams] = useState({ term: '', type: '', page: 1 });
  const [results, setResults] = useState([]);
  const [total, setTotal] = useState(0);
  const [status, setStatus] = useState('idle'); // idle | loading | success | error
  const [error, setError] = useState('');

  useEffect(() => {
    if (!params.term) {
      setStatus('idle');
      return undefined;
    }

    const controller = new AbortController(); // cancela a requisição anterior (evita "corrida")

    async function load() {
      setStatus('loading');
      setError('');
      try {
        const data = await searchTitles({ ...params, signal: controller.signal });
        setResults(data.results);
        setTotal(data.total);
        setStatus('success');
      } catch (err) {
        if (err.name === 'AbortError') return;
        setResults([]);
        setTotal(0);
        setError(err.message);
        setStatus('error');
      }
    }

    load();
    return () => controller.abort();
  }, [params]);

  const run = useCallback((term) => setParams((p) => ({ ...p, term, page: 1 })), []);
  const setType = useCallback((type) => setParams((p) => ({ ...p, type, page: 1 })), []);
  const setPage = useCallback((page) => {
    setParams((p) => ({ ...p, page }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);
  const retry = useCallback(() => setParams((p) => ({ ...p })), []);
  const clear = useCallback(() => {
    setParams({ term: '', type: '', page: 1 });
    setResults([]);
    setTotal(0);
    setStatus('idle');
  }, []);

  return { ...params, active: Boolean(params.term), results, total, status, error, run, setType, setPage, retry, clear };
}