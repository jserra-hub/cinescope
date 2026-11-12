/** Ícones SVG inline (herdam a cor do texto via currentColor). */
const filled = { width: '1em', height: '1em', viewBox: '0 0 24 24', fill: 'currentColor', 'aria-hidden': true, focusable: false };
const stroked = { ...filled, fill: 'none', stroke: 'currentColor', strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round' };

export const PlayIcon = (props) => (
  <svg {...filled} {...props}><path d="M8 5v14l11-7z" /></svg>
);

export const InfoIcon = (props) => (
  <svg {...filled} {...props}>
    <path d="M12 2a10 10 0 100 20 10 10 0 000-20zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" />
  </svg>
);

export const SearchIcon = (props) => (
  <svg {...stroked} {...props}><circle cx="11" cy="11" r="7" /><path d="M20 20l-3.5-3.5" /></svg>
);

export const CloseIcon = (props) => (
  <svg {...stroked} {...props}><path d="M6 6l12 12M18 6L6 18" /></svg>
);

export const ChevronIcon = (props) => (
  <svg {...stroked} {...props}><path d="M9 6l6 6-6 6" /></svg>
);

export const ChevronDownIcon = (props) => (
  <svg {...stroked} {...props}><path d="M6 9l6 6 6-6" /></svg>
);

/** Coração: contorno por padrão; use solid para preenchê-lo (favoritado). */
export const HeartIcon = ({ solid = false, ...props }) => (
  <svg {...stroked} {...props} fill={solid ? 'currentColor' : 'none'}>
    <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 0 0-7.8 7.8l1 1.1L12 21.2l7.8-7.7 1-1.1a5.5 5.5 0 0 0 0-7.8z" />
  </svg>
);

export const ClockIcon = (props) => (
  <svg {...stroked} {...props}><circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" /></svg>
);

export const UserIcon = (props) => (
  <svg {...stroked} {...props}><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
);

export const LogoutIcon = (props) => (
  <svg {...stroked} {...props}><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" /></svg>
);