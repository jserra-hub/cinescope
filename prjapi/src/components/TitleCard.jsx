import Poster from './Poster.jsx';
import FavoriteButton from './FavoriteButton.jsx';
import { PlayIcon } from './Icons.jsx';
import { TYPE_LABELS } from '../utils/format.js';

/**
 * Card minimalista: pôster com cantos arredondados e, abaixo, título, ano e tipo.
 * No hover/foco o pôster sobe levemente, ganha um contorno ciano e um botão de
 * vidro com "play". O coração salva nos favoritos. Se o item tiver "progress"
 * (Continuar assistindo), mostra uma barra de progresso. Clicar abre o modal.
 */
export default function TitleCard({ item, onSelect }) {
  const typeLabel = TYPE_LABELS[item.tipo];
  const progress = Math.round(item.progress ?? 0);

  return (
    <div className="tcard-wrap">
      <button className="tcard" onClick={() => onSelect(item)} aria-label={`Ver detalhes de ${item.titulo}`}>
        <span className="tcard__frame">
          <Poster src={item.poster} title={item.titulo} />
          <span className="tcard__play" aria-hidden="true">
            <span>
              <PlayIcon />
            </span>
          </span>

          {progress > 0 && (
            <span
              className="tcard__progress"
              role="progressbar"
              aria-label={`${progress}% assistido`}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={progress}
            >
              <span style={{ width: `${progress}%` }} />
            </span>
          )}
        </span>

        <span className="tcard__caption">
          <span className="tcard__title">{item.titulo}</span>
          <span className="tcard__meta">
            <span>{item.ano}</span>
            {typeLabel && <span className="tcard__type">{typeLabel}</span>}
          </span>
        </span>
      </button>

      <FavoriteButton item={item} />
    </div>
  );
}