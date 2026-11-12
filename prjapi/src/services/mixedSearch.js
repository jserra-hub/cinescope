import { searchTitles } from './omdb.js';
import { hasValue } from '../utils/format.js';

/**
 * Busca MISTA na OMDb: faz uma busca por termo e intercala os resultados,
 * pegando um título de cada termo por vez. Resultado: variedade real
 * (Batman, John Wick, Avengers... lado a lado) em vez de uma franquia só.
 */

const MAX_PARALLEL = 6; // limite de requisições simultâneas (global)
const FATAL = /chave|limite/i; // erros que não adianta repetir (chave inválida, limite diário)

// ---- fila simples para não disparar dezenas de requisições de uma vez ----
let active = 0;
const queue = [];

function schedule(task) {
  return new Promise((resolve, reject) => {
    const run = () => {
      active += 1;
      task()
        .then(resolve, reject)
        .finally(() => {
          active -= 1;
          const next = queue.shift();
          if (next) next();
        });
    };

    if (active < MAX_PARALLEL) run();
    else queue.push(run);
  });
}

/** Converte um resultado de busca da OMDb para o formato usado pelos componentes. */
export const toItem = (r) => ({
  id: r.imdbID,
  titulo: r.Title,
  ano: r.Year,
  tipo: r.Type,
  poster: r.Poster,
});

/** Intercala as listas (1º de cada, depois 2º de cada...) removendo repetidos. */
function interleave(lists, limit) {
  const seen = new Set();
  const items = [];
  const depth = Math.max(0, ...lists.map((list) => list.length));

  for (let i = 0; i < depth && items.length < limit; i += 1) {
    for (const list of lists) {
      const result = list[i];
      if (result && !seen.has(result.imdbID) && items.length < limit) {
        seen.add(result.imdbID);
        items.push(toItem(result));
      }
    }
  }
  return items;
}

/**
 * @param {{terms: string[], type?: string, perTerm?: number, limit?: number, signal?: AbortSignal}} options
 * @returns {Promise<Array>} títulos misturados (apenas com pôster)
 */
export async function fetchMixed({ terms, type = '', perTerm = 4, limit = 16, signal }) {
  let firstError = null;

  const lists = await Promise.all(
    terms.map((term) =>
      schedule(() => searchTitles({ term, type, signal }))
        .then(({ results }) => results.filter((r) => hasValue(r.Poster)).slice(0, perTerm))
        .catch((err) => {
          // cancelamento e erros de chave/limite sobem; o resto é tratado termo a termo
          if (err.name === 'AbortError' || FATAL.test(err.message)) throw err;
          if (!firstError) firstError = err;
          return [];
        })
    )
  );

  const items = interleave(lists, limit);

  // Se nada veio por falha de rede, avisa. "Nenhum título encontrado" não é erro de verdade.
  if (items.length === 0 && firstError && !/Nenhum título/.test(firstError.message)) {
    throw firstError;
  }
  return items;
}