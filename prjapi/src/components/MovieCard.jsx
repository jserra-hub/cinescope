/** Rótulos amigáveis para o campo "Type" da API. */
export const TYPE_LABELS = { movie: 'Filme', series: 'Série', episode: 'Episódio', game: 'Game' };

/** A API devolve a string "N/A" quando não há informação. */
export const hasValue = (v) => Boolean(v) && v !== 'N/A';

/**
 * Card em formato de "ingresso": pôster no topo e canhoto tracejado
 * com ano e tipo. Ao clicar, abre o modal de detalhes.
 */
export default function MovieCard({ movie, onSelect }) {
  const { Title, Year, Type, Poster, imdbID } = movie;

  return (
    <button className="card" onClick={() => onSelect(imdbID)} aria-label={`Ver detalhes de ${Title}`}>
      <div className="card__poster">
        {hasValue(Poster) ? (
          <img src={Poster} alt={`Pôster de ${Title}`} loading="lazy" />
        ) : (
          <div className="card__noposter">Sem pôster</div>
        )}
      </div>

      <div className="card__stub">
        <h3 className="card__title">{Title}</h3>
        <div className="card__meta">
          <span>{Year}</span>
          <span className="tag">{TYPE_LABELS[Type] ?? Type}</span>
        </div>
      </div>
    </button>
  );
}