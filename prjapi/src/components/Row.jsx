import { useRef } from 'react';
import TitleCard from './TitleCard.jsx';
import { ChevronIcon } from './Icons.jsx';

/** Trilho horizontal rolável (carrossel) com setas e rolagem por "snap". */
export default function Row({ title, items, onSelect }) {
  const trackRef = useRef(null);

  const scroll = (direction) => {
    const el = trackRef.current;
    if (el) el.scrollBy({ left: direction * el.clientWidth * 0.85, behavior: 'smooth' });
  };

  return (
    <section className="row" aria-label={title}>
      <h2 className="row__title">{title}</h2>

      <div className="row__wrap">
        <button className="row__arrow row__arrow--left" onClick={() => scroll(-1)} aria-label={`Rolar ${title} para a esquerda`}>
          <ChevronIcon />
        </button>

        <ul className="row__track" ref={trackRef}>
          {items.map((item) => (
            <li key={item.id}>
              <TitleCard item={item} onSelect={onSelect} />
            </li>
          ))}
        </ul>

        <button className="row__arrow row__arrow--right" onClick={() => scroll(1)} aria-label={`Rolar ${title} para a direita`}>
          <ChevronIcon />
        </button>
      </div>
    </section>
  );
}