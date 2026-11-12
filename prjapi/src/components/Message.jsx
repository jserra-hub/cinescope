/**
 * Bloco de mensagem usado para erros e para o estado vazio.
 * Se "onRetry" for passado, exibe o botão de tentar de novo.
 */
export default function Message({ title, children, onRetry, tone = 'neutral' }) {
  return (
    <div className={`message message--${tone}`} role={tone === 'error' ? 'alert' : undefined}>
      <h2>{title}</h2>
      <p>{children}</p>
      {onRetry && (
        <button className="btn" onClick={onRetry}>
          Tentar novamente
        </button>
      )}
    </div>
  );
}