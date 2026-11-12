/**
 * Gêneros do menu superior. Cada gênero abre uma página que mistura vários
 * termos de busca da OMDb (intercalados), sem nenhum título fixo no código.
 *
 *   id      -> usado na navegação (view "genre:<id>")
 *   label   -> texto exibido no menu e no título da página
 *   type    -> 'movie' ou 'series'
 *   perTerm -> máximo de títulos aproveitados por termo
 *   limit   -> máximo de títulos na página
 */
export const GENRES = [
  {
    id: 'acao',
    label: 'Ação',
    type: 'movie',
    perTerm: 5,
    limit: 40,
    terms: ['Batman', 'Mission Impossible', 'John Wick', 'Avengers', 'Mad Max', 'Die Hard', 'Fast Furious', 'Gladiator'],
  },
  {
    id: 'comedia',
    label: 'Comédia',
    type: 'movie',
    perTerm: 5,
    limit: 40,
    terms: ['Hangover', 'Superbad', 'Deadpool', 'Home Alone', 'Ted', 'Night at the Museum', 'Anchorman', 'Mean Girls'],
  },
  {
    id: 'ficcao-cientifica',
    label: 'Ficção Científica',
    type: 'movie',
    perTerm: 5,
    limit: 40,
    terms: ['Star Wars', 'Interstellar', 'Matrix', 'Dune', 'Blade Runner', 'Alien', 'Terminator', 'Back to the Future'],
  },
  {
    id: 'drama',
    label: 'Drama',
    type: 'movie',
    perTerm: 5,
    limit: 40,
    terms: ['Forrest Gump', 'The Godfather', 'Fight Club', 'Whiplash', 'Parasite', 'Shawshank', 'Joker', 'Green Mile'],
  },
  {
    id: 'series',
    label: 'Séries',
    type: 'series',
    perTerm: 3,
    limit: 40,
    terms: ['Game of Thrones', 'Breaking Bad', 'Stranger Things', 'The Boys', 'Dark', 'Black Mirror', 'Peaky Blinders', 'Money Heist'],
  },
];

/** Procura um gênero pelo id (ou undefined). */
export const getGenre = (id) => GENRES.find((genre) => genre.id === id);