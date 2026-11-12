import { useEffect, useRef, useState } from 'react';
import Logo from './Logo.jsx';

const SHOW_MS = 2200; // tempo com a logo na tela antes do zoom
const ZOOM_MS = 1600; // duração do zoom (mantenha igual ao CSS: --zoom-ms em .intro--zoom)

/**
 * Tela de abertura em 3 fases:
 *  - wait: espera a fonte carregar (evita "pulo" de tipografia)
 *  - show: a logo CINESCOPE aparece (fade + blur + scale)
 *  - zoom: a câmera entra pela cavidade do "O". A camada escura ganha um
 *          "furo" no centro do anel e tudo é ampliado a partir desse ponto,
 *          revelando o site por dentro do "O".
 */
export default function IntroScreen({ onDone }) {
  const [phase, setPhase] = useState('wait');
  const stageRef = useRef(null);
  const oRef = useRef(null);

  // trava a rolagem enquanto a intro está visível
  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  // fase "wait" -> "show": aguarda a fonte Inter 900 (com limite de 1,2 s)
  useEffect(() => {
    let alive = true;
    const fontReady = document.fonts?.load ? document.fonts.load('900 1em Inter') : Promise.resolve();
    const timeout = new Promise((resolve) => setTimeout(resolve, 1200));

    Promise.race([fontReady, timeout])
      .catch(() => {})
      .then(() => alive && setPhase('show'));

    return () => {
      alive = false;
    };
  }, []);

  // controla os tempos das fases "show" e "zoom"
  useEffect(() => {
    if (phase === 'show') {
      const timer = setTimeout(() => {
        // Mede o anel do "O" e calcula os parâmetros do zoom
        const o = oRef.current;
        const stage = stageRef.current;
        if (o && stage) {
          const rect = o.getBoundingClientRect();
          const cx = rect.left + rect.width / 2;
          const cy = rect.top + rect.height / 2;
          const border = parseFloat(getComputedStyle(o).borderTopWidth) || 0;
          const hole = Math.max(rect.width / 2 - border, 4); // raio interno do anel
          const farthest = Math.hypot(
            Math.max(cx, window.innerWidth - cx),
            Math.max(cy, window.innerHeight - cy)
          );

          stage.style.setProperty('--ox', `${cx}px`); // centro do "O" (x)
          stage.style.setProperty('--oy', `${cy}px`); // centro do "O" (y)
          stage.style.setProperty('--hole', `${hole}px`); // raio da cavidade
          stage.style.setProperty('--zoom', String((farthest / hole) * 1.15)); // escala final
        }
        setPhase('zoom');
      }, SHOW_MS);
      return () => clearTimeout(timer);
    }

    if (phase === 'zoom') {
      const timer = setTimeout(onDone, ZOOM_MS + 100);
      return () => clearTimeout(timer);
    }

    return undefined;
  }, [phase, onDone]);

  return (
    <div className={`intro intro--${phase}`} aria-hidden="true">
      <div className="intro__stage" ref={stageRef}>
        <div className="intro__veil" />
        <div className="intro__logo">
          <Logo className="logo--intro" oRef={oRef} />
        </div>
      </div>
    </div>
  );
}