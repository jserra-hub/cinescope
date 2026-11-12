/**
 * Logotipo CINESCOPE.
 *  - Texto em peso 900 (Black), caixa-alta e letter-spacing generoso.
 *  - O "O" é um anel ciano desenhado em CSS, para que a intro consiga
 *    medir sua posição e "entrar" pela cavidade dele (zoom).
 *
 * Props:
 *  - className: classe extra (ex.: "logo--intro")
 *  - oRef: ref opcional apontando para o anel do "O"
 */
export default function Logo({ className = '', oRef }) {
  return (
    <span className={`logo ${className}`} role="img" aria-label="CINESCOPE">
      <span className="logo__txt" aria-hidden="true">CINESC</span>
      <span className="logo__o" ref={oRef} aria-hidden="true" />
      <span className="logo__txt logo__txt--end" aria-hidden="true">PE</span>
    </span>
  );
}