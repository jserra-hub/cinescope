/**
 * Camada de acesso à OMDb API.
 * Toda comunicação HTTP fica aqui, deixando os componentes focados na interface.
 * Documentação: https://www.omdbapi.com/
 */

const BASE_URL = 'https://www.omdbapi.com/';
const API_KEY = import.meta.env.VITE_OMDB_API_KEY;

/** Quantidade de resultados que a OMDb devolve por página (valor fixo da API). */
export const PAGE_SIZE = 10;

/** Traduz as mensagens de erro da API para português. */
function translateError(message, term) {
  switch (message) {
    case 'Movie not found!':
      return `Nenhum título encontrado para "${term}". Confira a grafia ou tente outro nome.`;
    case 'Too many results.':
      return 'Muitos resultados possíveis. Digite um nome mais específico.';
    case 'Invalid API key!':
      return 'Chave da API inválida. Verifique o valor de VITE_OMDB_API_KEY.';
    case 'Request limit reached!':
      return 'O limite diário de requisições da sua chave foi atingido. Tente novamente amanhã.';
    default:
      return message || 'Erro desconhecido ao consultar a OMDb API.';
  }
}

/** Função base: monta a URL, faz o fetch e padroniza os erros. */
async function request(params, { signal, term } = {}) {
  if (!API_KEY) {
    throw new Error(
      'Chave da API não configurada. Crie um arquivo .env com VITE_OMDB_API_KEY=sua_chave.'
    );
  }

  const url = new URL(BASE_URL);
  url.search = new URLSearchParams({ apikey: API_KEY, ...params }).toString();

  let response;
  try {
    response = await fetch(url, { signal });
  } catch (err) {
    if (err.name === 'AbortError') throw err; // cancelamento é tratado por quem chamou
    throw new Error('Falha de conexão. Verifique sua internet e tente novamente.');
  }

  // A OMDb devolve JSON até em erros (ex.: 401 com chave inválida)
  const data = await response.json().catch(() => null);
  if (!data) throw new Error(`Resposta inesperada do servidor (código ${response.status}).`);
  if (data.Response === 'False') throw new Error(translateError(data.Error, term));

  return data;
}

/**
 * Busca títulos por nome.
 * @param {{term: string, type?: '' | 'movie' | 'series', page?: number, signal?: AbortSignal}} options
 * @returns {Promise<{results: Array, total: number}>}
 */
export async function searchTitles({ term, type = '', page = 1, signal }) {
  const params = { s: term, page: String(page) };
  if (type) params.type = type;

  const data = await request(params, { signal, term });
  return { results: data.Search, total: Number(data.totalResults) };
}

/**
 * Busca os detalhes completos de um título (sinopse completa, avaliações etc.).
 * @param {string} imdbID  Ex.: "tt0133093"
 */
export function getTitleDetails(imdbID, signal) {
  return request({ i: imdbID, plot: 'full' }, { signal });
}

/**
 * Busca um título por ID com sinopse curta ou completa.
 * Usado pelo catálogo para obter o pôster e a nota do IMDb.
 */
export function getTitleById(imdbID, signal, plot = 'short') {
  return request({ i: imdbID, plot }, { signal });
}