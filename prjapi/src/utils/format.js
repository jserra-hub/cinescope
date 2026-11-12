/** Rótulos amigáveis para o campo "Type" da OMDb. */
export const TYPE_LABELS = { movie: 'Filme', series: 'Série', episode: 'Episódio', game: 'Game' };

/** A OMDb devolve a string "N/A" quando não há informação. */
export const hasValue = (v) => Boolean(v) && v !== 'N/A';

/**
 * A OMDb entrega pôsteres de 300px (ex.: ...SX300.jpg). A CDN permite pedir
 * outra largura trocando esse trecho, o que usamos para o banner gigante.
 * Se a CDN não aceitar, o componente <Backdrop> volta para a imagem original.
 */
export function hiRes(url, width = 1400) {
  if (!hasValue(url)) return null;
  return url.replace(/SX\d+/, `SX${width}`);
}

/** Tradução dos gêneros que a OMDb devolve em inglês. */
const GENRES = {
  Action: 'Ação',
  Adventure: 'Aventura',
  Animation: 'Animação',
  Biography: 'Biografia',
  Comedy: 'Comédia',
  Crime: 'Crime',
  Documentary: 'Documentário',
  Drama: 'Drama',
  Family: 'Família',
  Fantasy: 'Fantasia',
  History: 'História',
  Horror: 'Terror',
  Music: 'Música',
  Musical: 'Musical',
  Mystery: 'Mistério',
  Romance: 'Romance',
  'Sci-Fi': 'Ficção científica',
  Sport: 'Esporte',
  Thriller: 'Suspense',
  War: 'Guerra',
  Western: 'Faroeste',
};

/** Devolve o gênero em português (ou o original, se não houver tradução). */
export const translateGenre = (genre) => GENRES[genre] ?? genre;