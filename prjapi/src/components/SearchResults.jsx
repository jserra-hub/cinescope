import TitleCard from './TitleCard.jsx';
import Pagination from './Pagination.jsx';
import Message from './Message.jsx';
import { GridSkeleton } from './Loader.jsx';
import { hasValue } from '../utils/format.js';

const TYPES = [
  { value: '', label: 'Tudo' },
  { value: 'movie', label: 'Filmes' },
  { value: 'series', label: 'Séries' },
];

/** Tela de resultados da busca (OMDb): filtro de tipo, grade, paginação e estados de erro/loading. */
export default function SearchResults({ search, onSelect }) {
  const { term, type, page, results, total, status, error, setType, setPage, retry } = search;

  // Converte o formato da OMDb para o formato usado pelos cards
  const items = results.map((r) => ({
    id: r.imdbID,
    titulo: r.Title,
    ano: r.Year,
    tipo: r.Type,
    poster: hasValue(r.Poster) ? r.Poster : null,
  }));

  return (
    <section className="search-page" aria-live="polite">
      <div className="search-page__head">
        <h1>Resultados para “{term}”</h1>

        <div className="segmented" role="radiogroup" aria-label="Filtrar por tipo">
          {TYPES.map((t) => (
            <button
              key={t.value}
              role="radio"
              aria-checked={type === t.value}
              className={type === t.value ? 'is-active' : ''}
              onClick={() => setType(t.value)}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {status === 'loading' && <GridSkeleton />}

      {status === 'error' && (
        <Message tone="error" title="Nada por aqui" onRetry={retry}>
          {error}
        </Message>
      )}

      {status === 'success' && (
        <>
          <p className="summary">
            {total} resultado{total !== 1 && 's'}
          </p>
          <ul className="grid">
            {items.map((item) => (
              <li key={item.id}>
                <TitleCard item={item} onSelect={onSelect} />
              </li>
            ))}
          </ul>
          <Pagination page={page} total={total} onChange={setPage} />
        </>
      )}
    </section>
  );
}