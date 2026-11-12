import { useEffect, useMemo, useState } from 'react';
import { ROWS } from '../data/rows.js';
import { getTitleById } from '../services/omdb.js';
import { fetchMixed } from '../services/mixedSearch.js';
import { readCache, writeCache } from '../utils/cache.js';
import { hasValue, translateGenre } from '../utils/format.js';

/**
 * Monta o catálogo 100% a partir da OMDb API:
 *  1. Para cada fileira, busca VÁRIOS termos (data/rows.js) e mistura os resultados.
 *  2. Escolhe os títulos de destaque e busca os detalhes deles (sinopse, gêneros...).
 *
 * Os resultados ficam em cache no localStorage para economizar requisições.
 */
const ROWS_KEY = 'cinescope:rows:v3'; // v3: fileiras agora são misturadas (cache antigo é ignorado)
const ROWS_TTL = 6 * 60 * 60 * 1000; // 6 horas
const DETAILS_KEY = 'cinescope:details:v1';
const DETAILS_TTL = 7 * 24 * 60 * 60 * 1000; // 7 dias
const FEATURED_COUNT = 4;
const FATAL = /chave|limite/i; // erros que não adianta repetir

/** Converte os detalhes de um título (consulta por ID) para o formato do app. */
function toDetails(d) {
  let duracao = null;
  if (d.Type === 'series' && hasValue(d.totalSeasons)) {
    duracao = `${d.totalSeasons} temporada${d.totalSeasons === '1' ? '' : 's'}`;
  } else if (hasValue(d.Runtime)) {
    duracao = d.Runtime;
  }

  return {
    classificacao: hasValue(d.Rated) ? d.Rated : null,
    duracao,
    generos: hasValue(d.Genre) ? d.Genre.split(', ').map(translateGenre) : [],
    sinopse: hasValue(d.Plot) ? d.Plot : '',
    rating: hasValue(d.imdbRating) ? d.imdbRating : null,
  };
}

/**
 * @param {'all' | 'movie' | 'series'} tab  filtro das abas do menu
 * @returns {{rows: Array, featured: Array, loading: boolean, error: string}}
 */
export default function useCatalog(tab = 'all') {
  const [rowData, setRowData] = useState(() => readCache(ROWS_KEY, ROWS_TTL) ?? {}); // { [rowId]: itens }
  const [details, setDetails] = useState(() => readCache(DETAILS_KEY, DETAILS_TTL) ?? {}); // { [imdbID]: detalhes }
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // 1) Busca as fileiras que ainda não estão no cache (cada uma mistura vários termos)
  useEffect(() => {
    const controller = new AbortController();
    const collected = { ...(readCache(ROWS_KEY, ROWS_TTL) ?? {}) };
    const missing = ROWS.filter((row) => !collected[row.id]);

    if (missing.length === 0) {
      setLoading(false);
      return undefined;
    }

    let firstError = '';

    Promise.all(
      missing.map(async (row) => {
        try {
          const items = await fetchMixed({
            terms: row.terms,
            type: row.type,
            perTerm: row.perTerm,
            limit: row.limit,
            signal: controller.signal,
          });

          if (items.length > 0) {
            collected[row.id] = items;
            setRowData({ ...collected }); // as fileiras aparecem conforme chegam
          }
        } catch (err) {
          if (err.name !== 'AbortError') firstError = firstError || err.message;
        }
      })
    ).then(() => {
      if (controller.signal.aborted) return;
      const hasRows = Object.keys(collected).length > 0;
      if (hasRows) writeCache(ROWS_KEY, collected);
      setError(hasRows ? '' : firstError); // só mostra erro se NADA carregou
      setLoading(false);
    });

    return () => controller.abort();
  }, []);

  // Fileiras visíveis conforme a aba (a aba "Séries" mostra só fileiras de séries, etc.)
  const rows = useMemo(
    () =>
      ROWS.filter((row) => tab === 'all' || row.type === tab)
        .map((row) => ({ id: row.id, title: row.title, items: rowData[row.id] ?? [] }))
        .filter((row) => row.items.length > 0),
    [rowData, tab]
  );

  // Destaques: o primeiro título de cada fileira (sem repetir)
  const featuredBase = useMemo(() => {
    const picks = [];
    const used = new Set();
    for (const row of rows) {
      const first = row.items.find((item) => !used.has(item.id));
      if (first) {
        used.add(first.id);
        picks.push(first);
      }
      if (picks.length === FEATURED_COUNT) break;
    }
    return picks;
  }, [rows]);

  // 2) Busca sinopse, gêneros e classificação dos destaques (depois que as fileiras carregarem)
  useEffect(() => {
    if (loading || featuredBase.length === 0) return undefined;

    const missing = featuredBase.filter((item) => !(item.id in details));
    if (missing.length === 0) return undefined;

    const controller = new AbortController();
    const collected = { ...details };

    (async () => {
      for (const item of missing) {
        try {
          const data = await getTitleById(item.id, controller.signal, 'short');
          collected[item.id] = toDetails(data);
          setDetails({ ...collected });
        } catch (err) {
          if (err.name === 'AbortError' || FATAL.test(err.message)) break;
        }
      }
      if (!controller.signal.aborted) writeCache(DETAILS_KEY, collected);
    })();

    return () => controller.abort();
    // "details" fica de fora de propósito: só queremos reagir a mudanças nos destaques
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, featuredBase]);

  const featured = useMemo(
    () => featuredBase.map((item) => ({ ...item, ...(details[item.id] ?? {}) })),
    [featuredBase, details]
  );

  return { rows, featured, loading, error };
}