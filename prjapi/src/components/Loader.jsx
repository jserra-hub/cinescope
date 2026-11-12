/** Indicador de carregamento acessível (spinner + texto para leitores de tela). */
export function Spinner({ label = 'Carregando…' }) {
  return (
    <div className="spinner" role="status" aria-live="polite">
      <span className="spinner__ring" aria-hidden="true" />
      <span>{label}</span>
    </div>
  );
}

/** Esqueletos que ocupam o lugar dos cards enquanto a busca acontece. */
export function GridSkeleton({ count = 12 }) {
  return (
    <div aria-busy="true">
      <Spinner label="Buscando títulos…" />
      <ul className="grid">
        {Array.from({ length: count }, (_, i) => (
          <li key={i} className="skeleton" aria-hidden="true" />
        ))}
      </ul>
    </div>
  );
}

/** Esqueleto das fileiras do catálogo enquanto a OMDb responde. */
export function RowsSkeleton({ rows = 3, cards = 8 }) {
  return (
    <div className="rows" aria-busy="true">
      <Spinner label="Carregando catálogo…" />
      {Array.from({ length: rows }, (_, r) => (
        <div className="row" key={r} aria-hidden="true">
          <div className="skeleton skeleton--title" />
          <ul className="row__track">
            {Array.from({ length: cards }, (_, c) => (
              <li key={c} className="skeleton" />
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}