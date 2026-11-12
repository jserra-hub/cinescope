/**
 * Configuração das fileiras do catálogo.
 *
 * Aqui NÃO há filmes nem séries: apenas termos de busca enviados à OMDb API
 * (parâmetro "s"). Cada fileira combina VÁRIOS termos, e os resultados são
 * intercalados (um de cada termo por vez) para garantir variedade real.
 *
 * Campos:
 *   id      -> identificador único
 *   title   -> nome exibido na tela
 *   terms   -> lista de termos de busca (ex.: ['Batman', 'John Wick', ...])
 *   type    -> 'movie' ou 'series' (também define em qual aba a fileira aparece)
 *   perTerm -> (opcional) máximo de títulos aproveitados por termo (padrão: 4)
 *   limit   -> (opcional) máximo de títulos na fileira (padrão: 16)
 */
export const ROWS = [
  {
    id: 'em-alta',
    title: 'Em Alta',
    type: 'movie',
    terms: ['Avengers', 'Batman', 'Star Wars', 'Jurassic Park'],
  },
  {
    id: 'series-populares',
    title: 'Séries Populares',
    type: 'series',
    perTerm: 3,
    terms: ['Game of Thrones', 'Breaking Bad', 'Stranger Things', 'The Boys'],
  },
  {
    id: 'filmes-de-acao',
    title: 'Filmes de Ação',
    type: 'movie',
    terms: ['Mission Impossible', 'John Wick', 'Mad Max', 'Die Hard'],
  },
  {
    id: 'ficcao-cientifica',
    title: 'Ficção Científica',
    type: 'movie',
    terms: ['Interstellar', 'Matrix', 'Dune', 'Blade Runner'],
  },
  {
    id: 'comedia',
    title: 'Comédia',
    type: 'movie',
    terms: ['Hangover', 'Superbad', 'Deadpool', 'Home Alone'],
  },
  {
    id: 'drama',
    title: 'Drama',
    type: 'movie',
    terms: ['Forrest Gump', 'The Godfather', 'Fight Club', 'Whiplash'],
  },
  {
    id: 'series-suspense',
    title: 'Séries de Suspense',
    type: 'series',
    perTerm: 3,
    terms: ['Dark', 'Black Mirror', 'Mindhunter', 'Sherlock'],
  },
  {
    id: 'series-ficcao',
    title: 'Séries de Ficção',
    type: 'series',
    perTerm: 3,
    terms: ['Star Trek', 'Westworld', 'Doctor Who', 'Mandalorian'],
  },
];