/**
 * Barra de busca + filtro de tipo (todos / filmes / séries).
 * É um componente "controlado": o estado fica no App.
 */
const TYPES = [
  { value: '', label: 'Tudo' },
  { value: 'movie', label: 'Filmes' },
  { value: 'series', label: 'Séries' },
];

export default function SearchBar({ value, onChange, onSubmit, type, onTypeChange, disabled }) {
  const handleSubmit = (event) => {
    event.preventDefault(); // evita recarregar a página
    onSubmit();
  };

  return (
    <form className="search" onSubmit={handleSubmit} role="search">
      <div className="search__field">
        <input
          type="search"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Busque por título: Interestelar, Dark, Matrix…"
          aria-label="Título do filme ou série"
          autoFocus
        />
        <button type="submit" disabled={disabled || !value.trim()}>
          Buscar
        </button>
      </div>

      <div className="segmented" role="radiogroup" aria-label="Filtrar por tipo">
        {TYPES.map((t) => (
          <button
            key={t.value}
            type="button"
            role="radio"
            aria-checked={type === t.value}
            className={type === t.value ? 'is-active' : ''}
            onClick={() => onTypeChange(t.value)}
          >
            {t.label}
          </button>
        ))}
      </div>
    </form>
  );
}