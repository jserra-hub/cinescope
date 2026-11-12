import { useEffect, useRef, useState } from 'react';
import { getTitleDetails } from '../services/omdb.js';
import Backdrop from './Backdrop.jsx';
import Poster from './Poster.jsx';
import { Spinner } from './Loader.jsx';
import Message from './Message.jsx';
import { CloseIcon, HeartIcon, PlayIcon } from './Icons.jsx';
import { useAccount } from '../context/AccountContext.jsx';
import { TYPE_LABELS, hasValue, translateGenre } from '../utils/format.js';

/** Linha "rótulo: valor" que só aparece quando há dado. */
function Info({ label, value }) {
  if (!hasValue(value)) return null;
  return (
    <div className="info">
      <dt>{label}</dt>
      <dd>{value}</dd>
    </div>
  );
}

/**
 * Modal de detalhes em painéis de vidro.
 * Abre na hora com os dados do card e completa (elenco, avaliações, prêmios...)
 * com uma consulta à OMDb. Fecha com Esc, clique fora ou no botão ×.
 */
export default function MovieModal({ item, onClose, onPlay }) {
  const { isFavorite, toggleFavorite, authOpen } = useAccount();
  const [details, setDetails] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const closeRef = useRef(null);

  // Carrega os detalhes completos (cancela se o modal fechar antes)
  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError('');
    setDetails(null);

    getTitleDetails(item.id, controller.signal)
      .then(setDetails)
      .catch((err) => {
        if (err.name !== 'AbortError') setError(err.message);
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });

    return () => controller.abort();
  }, [item.id]);

  // Trava a rolagem da página e foca o botão de fechar
  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeRef.current?.focus();

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  // Esc fecha o modal (exceto quando o modal de login está aberto por cima dele)
  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && !authOpen && onClose();
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose, authOpen]);

  // Usa o que já temos do card e completa com os dados da consulta detalhada
  const poster = hasValue(details?.Poster) ? details.Poster : item.poster;
  const rated = item.classificacao ?? (hasValue(details?.Rated) ? details.Rated : null);
  const year = item.ano ?? details?.Year;
  const duration = item.duracao ?? (hasValue(details?.Runtime) ? details.Runtime : null);
  const typeLabel = TYPE_LABELS[item.tipo ?? details?.Type];
  const genres =
    item.generos && item.generos.length > 0
      ? item.generos
      : hasValue(details?.Genre)
        ? details.Genre.split(', ').map(translateGenre)
        : [];
  const plot = item.sinopse || (hasValue(details?.Plot) ? details.Plot : '');
  const favorite = isFavorite(item.id);

  return (
    <div className="overlay" onClick={onClose}>
      <div
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-label={`Detalhes de ${item.titulo}`}
        onClick={(e) => e.stopPropagation()}
      >
        <button ref={closeRef} className="modal__close" onClick={onClose} aria-label="Fechar detalhes">
          <CloseIcon />
        </button>

        <div className="modal__banner">
          <Backdrop backdrop={item.backdrop} poster={poster} className="modal__bg" />
        </div>

        {/* Pôster sobreposto ao banner + título e ações */}
        <div className="modal__top">
          <div className="modal__poster">
            <Poster src={poster} title={item.titulo} />
          </div>

          <div className="modal__titleblock">
            <h2>{item.titulo}</h2>
            <p className="hero__meta">
              {rated && <span className="badge">{rated}</span>}
              {year && <span>{year}</span>}
              {duration && <span>{duration}</span>}
              {typeLabel && <span>{typeLabel}</span>}
            </p>
            <div className="hero__actions">
              <button className="btn btn--play" onClick={() => onPlay(item)}>
                <PlayIcon /> Assistir
              </button>
              <button className="btn btn--info" onClick={() => toggleFavorite(item)} aria-pressed={favorite}>
                <HeartIcon solid={favorite} /> {favorite ? 'Favoritado' : 'Favoritar'}
              </button>
              <a className="btn btn--info" href={`https://www.imdb.com/title/${item.id}/`} target="_blank" rel="noreferrer">
                Ver no IMDb
              </a>
            </div>
          </div>
        </div>

        <div className="modal__body">
          {/* Painel 1: sinopse, gêneros e avaliações */}
          <section className="panel" aria-label="Sinopse e avaliações">
            <h3>Sinopse</h3>
            <p className="modal__plot">{plot || (loading ? 'Carregando sinopse…' : 'Sinopse não disponível.')}</p>

            {genres.length > 0 && (
              <ul className="chips" aria-label="Gêneros">
                {genres.map((g) => (
                  <li key={g}>{g}</li>
                ))}
              </ul>
            )}

            {/* Avaliações: IMDb, Rotten Tomatoes, Metacritic… */}
            {details?.Ratings?.length > 0 && (
              <ul className="ratings" aria-label="Avaliações">
                {details.Ratings.map((r) => (
                  <li key={r.Source}>
                    <strong>{r.Value}</strong>
                    <span>{r.Source === 'Internet Movie Database' ? 'IMDb' : r.Source}</span>
                  </li>
                ))}
              </ul>
            )}
          </section>

          {/* Painel 2: ficha técnica */}
          <section className="panel" aria-label="Ficha técnica">
            <h3>Ficha técnica</h3>

            {loading && <Spinner label="Carregando detalhes…" />}
            {error && (
              <Message tone="error" title="Não foi possível carregar todos os detalhes">
                {error}
              </Message>
            )}

            <dl className="infos">
              <Info label="Direção" value={details?.Director} />
              <Info label="Elenco" value={details?.Actors} />
              <Info label="Lançamento" value={details?.Released} />
              <Info label="Idioma" value={details?.Language} />
              <Info label="País" value={details?.Country} />
              <Info label="Prêmios" value={details?.Awards} />
              <Info label="Temporadas" value={details?.totalSeasons} />
            </dl>
          </section>
        </div>
      </div>
    </div>
  );
}