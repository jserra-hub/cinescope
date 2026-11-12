import { HeartIcon } from './Icons.jsx';
import { useAccount } from '../context/AccountContext.jsx';

/**
 * Botão de coração do card. Fica ao lado do botão do card (não dentro dele),
 * pois um botão não pode conter outro botão.
 * Sem login, o clique abre o modal de entrada (ver AccountContext).
 */
export default function FavoriteButton({ item }) {
  const { isFavorite, toggleFavorite } = useAccount();
  const active = isFavorite(item.id);
  const label = active ? `Remover ${item.titulo} dos favoritos` : `Adicionar ${item.titulo} aos favoritos`;

  return (
    <button
      type="button"
      className={`fav ${active ? 'is-active' : ''}`}
      onClick={() => toggleFavorite(item)}
      aria-pressed={active}
      aria-label={label}
      title={active ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
    >
      <HeartIcon solid={active} />
    </button>
  );
}