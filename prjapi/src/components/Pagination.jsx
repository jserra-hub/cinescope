import { PAGE_SIZE } from '../services/omdb.js';

/** Paginação simples. A OMDb permite no máximo 100 páginas por busca. */
export default function Pagination({ page, total, onChange, disabled }) {
  const totalPages = Math.min(Math.ceil(total / PAGE_SIZE), 100);
  if (totalPages <= 1) return null;

  return (
    <nav className="pagination" aria-label="Paginação dos resultados">
      <button className="btn btn--ghost" disabled={disabled || page <= 1} onClick={() => onChange(page - 1)}>
        Anterior
      </button>
      <span>
        Página {page} de {totalPages}
      </span>
      <button
        className="btn btn--ghost"
        disabled={disabled || page >= totalPages}
        onClick={() => onChange(page + 1)}
      >
        Próxima
      </button>
    </nav>
  );
}