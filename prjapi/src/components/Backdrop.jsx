import { useEffect, useState } from 'react';
import { hiRes } from '../utils/format.js';

/**
 * Imagem de fundo do banner e do modal.
 * - Se o título tiver "backdrop" (banner horizontal próprio), usa-o puro.
 * - Senão, amplia o pôster da OMDb e aplica desfoque (visual "ambiente").
 * - Se a imagem ampliada falhar, volta para o pôster original; se esse também
 *   falhar, nada é exibido e o gradiente do CSS assume.
 */
export default function Backdrop({ backdrop, poster, className = '' }) {
  const wanted = backdrop ?? hiRes(poster, 1400);
  const [src, setSrc] = useState(wanted);

  // o pôster chega de forma assíncrona: atualiza quando "wanted" mudar
  useEffect(() => setSrc(wanted), [wanted]);

  if (!src) return null;

  return (
    <img
      className={`bgimg ${backdrop ? '' : 'bgimg--blur'} ${className}`}
      src={src}
      alt=""
      onError={() => setSrc((current) => (current !== poster ? poster : null))}
    />
  );
}