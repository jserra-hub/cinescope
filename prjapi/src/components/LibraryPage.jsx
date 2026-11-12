import TitleCard from './TitleCard.jsx';

/**
 * Página de biblioteca pessoal (Favoritos ou Continuar assistindo).
 * Tem 3 estados: sem login (convite para entrar), vazia e com itens.
 *
 * Props:
 *  - title, items, user, onSelect
 *  - onLogin(): abre o modal de login
 *  - lockedText: texto exibido quando não há login
 *  - emptyTitle / emptyText: exibidos quando a lista está vazia
 *  - onClear / clearLabel: (opcional) botão para limpar a lista
 */
export default function LibraryPage({
  title,
  items,
  user,
  onSelect,
  onLogin,
  lockedText,
  emptyTitle,
  emptyText,
  onClear,
  clearLabel = 'Limpar',
}) {
  return (
    <section className="search-page" aria-live="polite">
      <div className="search-page__head">
        <h1>{title}</h1>
        {user && items.length > 0 && onClear && (
          <button className="btn btn--ghost" onClick={onClear}>
            {clearLabel}
          </button>
        )}
      </div>

      {!user ? (
        <div className="message">
          <h2>Entre na sua conta</h2>
          <p>{lockedText}</p>
          <button className="btn" onClick={onLogin}>
            Entrar
          </button>
        </div>
      ) : items.length === 0 ? (
        <div className="message">
          <h2>{emptyTitle}</h2>
          <p>{emptyText}</p>
        </div>
      ) : (
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