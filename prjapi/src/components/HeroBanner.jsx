import { useEffect, useState } from 'react';
import Backdrop from './Backdrop.jsx';
import Poster from './Poster.jsx';
import { HeartIcon, InfoIcon, PlayIcon } from './Icons.jsx';
import { useAccount } from '../context/AccountContext.jsx';
import { TYPE_LABELS } from '../utils/format.js';

const ROTATE_MS = 8000;

/**
 * Destaque principal em largura total: imagem ambiente (pôster ampliado e
 * desfocado), gradiente escuro, título, metadados, sinopse curta e botões.
 * Os dados vêm da OMDb; sinopse e gêneros chegam alguns instantes depois do título.
 */
export default function HeroBanner({ items, loading, onInfo, onPlay }) {
  const { isFavorite, toggleFavorite } = useAccount();
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  // troca automática de destaque (pausa ao passar o mouse)
  useEffect(() => {
    if (items.length < 2 || paused) return undefined;
    const timer = setInterval(() => setIndex((i) => (i + 1) % items.length), ROTATE_MS);
    return () => clearInterval(timer);
  }, [items.length, paused]);

  const item = items.length ? items[index % items.length] : null;

  // enquanto nada chegou da API, mostra um bloco com efeito de carregamento
  if (!item) {
    return <div className={`hero hero--empty ${loading ? 'is-loading' : ''}`} aria-busy={loading} />;
  }

  const genres = (item.generos ?? []).slice(0, 3);
  const typeLabel = TYPE_LABELS[item.tipo];
  const favorite = isFavorite(item.id);

  return (
    <section
      className="hero"
      aria-label="Destaque"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* key = id: ao trocar de título, o slide remonta e roda a animação de fade */}
      <div className="hero__slide" key={item.id}>
        <Backdrop backdrop={item.backdrop} poster={item.poster} className="hero__bg" />
        <div className="hero__shade" />

        {!item.backdrop && item.poster && (
          <div className="hero__poster">
            <Poster src={item.poster} title={item.titulo} />
          </div>
        )}

        <div className="hero__content">
          <h1 className="hero__title">{item.titulo}</h1>

          <p className="hero__meta">
            {item.classificacao && <span className="badge">{item.classificacao}</span>}
            <span>{item.ano}</span>
            {item.duracao && <span>{item.duracao}</span>}
            {typeLabel && <span>{typeLabel}</span>}
            {item.rating && <span className="rating">★ {item.rating}</span>}
          </p>

          {genres.length > 0 && (
            <ul className="chips" aria-label="Gêneros">
              {genres.map((g) => (
                <li key={g}>{g}</li>
              ))}
            </ul>
          )}

          {item.sinopse ? (
            <p className="hero__synopsis">{item.sinopse}</p>
          ) : (
            <div className="hero__synopsis-skeleton" aria-hidden="true">
              <span />
              <span />
            </div>
          )}

          <div className="hero__actions">
            <button className="btn btn--play" onClick={() => onPlay(item)}>
              <PlayIcon /> Assistir
            </button>
            <button className="btn btn--info" onClick={() => onInfo(item)}>
              <InfoIcon /> Mais informações
            </button>
            <button className="btn btn--info" onClick={() => toggleFavorite(item)} aria-pressed={favorite}>
              <HeartIcon solid={favorite} /> {favorite ? 'Favoritado' : 'Favoritar'}
            </button>
          </div>
        </div>
      </div>

      {items.length > 1 && (
        <div className="hero__dots">
          {items.map((it, i) => (
            <button
              key={it.id}
              className={i === index % items.length ? 'is-active' : ''}
              onClick={() => setIndex(i)}
              aria-label={`Destaque ${i + 1}: ${it.titulo}`}
            />
          ))}
        </div>
      )}
    </section>
  );
}