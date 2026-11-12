import TitleCard from './TitleCard.jsx';
import Message from './Message.jsx';
import { GridSkeleton } from './Loader.jsx';
import useGenre from '../hooks/useGenre.js';

/** Página de um gênero: grade com títulos misturados de várias franquias (via OMDb). */
export default function GenrePage({ genre, onSelect }) {
  const { items, status, error, retry } = useGenre(genre);

  return (
    <section className="search-page" aria-live="polite">
      <div className="search-page__head">
        <h1>{genre.label}</h1>
      </div>

      {status === 'loading' && <GridSkeleton />}

      {status === 'error' && (
        <Message tone="error" title="Não foi possível carregar esta categoria" onRetry={retry}>
          {error}
        </Message>
      )}

      {status === 'success' && (
        <>
          <p className="summary">
            {items.length} título{items.length !== 1 && 's'}
          </p>
          <ul className="grid">
            {items.map((item) => (
              <li key={item.id}>
                <TitleCard item={item} onSelect={onSelect} />
              </li>
            ))}
          </ul>
        </>
      )}
    </section>
  );
}