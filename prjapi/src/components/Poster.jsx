import { useEffect, useState } from 'react';

/** Pôster com placeholder (mostra o título) enquanto carrega ou se falhar. */
export default function Poster({ src, title }) {
  const [failed, setFailed] = useState(false);

  useEffect(() => setFailed(false), [src]);

  if (!src || failed) {
    return (
      <span className="poster poster--empty">
        <span>{title}</span>
      </span>
    );
  }

  return <img className="poster" src={src} alt={`Pôster de ${title}`} loading="lazy" onError={() => setFailed(true)} />;
}