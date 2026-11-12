import { useEffect, useRef, useState } from 'react';
import Logo from './Logo.jsx';
import {
  ChevronDownIcon,
  ClockIcon,
  CloseIcon,
  HeartIcon,
  LogoutIcon,
  SearchIcon,
  UserIcon,
} from './Icons.jsx';
import { GENRES } from '../data/genres.js';
import { useAccount } from '../context/AccountContext.jsx';

/** Abas principais. A "key" é a view que o App exibe ao clicar. */
const TABS = [
  { key: 'home:all', label: 'Início' },
  { key: 'home:series', label: 'Séries' },
  { key: 'home:movie', label: 'Filmes' },
];

/**
 * Barra superior: logo, abas, menu de Gêneros, busca, atalhos
 * (Continuar assistindo, Favoritos) e conta (Entrar / avatar com "Sair").
 * Fica transparente sobre o banner e ganha fundo de vidro ao rolar a página.
 * Em telas até 820px, tudo (exceto a logo) vai para o menu hambúrguer.
 *
 * Props:
 *  - view: view atual ('home:all', 'genre:acao', 'favorites', 'continue'...)
 *  - onNavigate(key): troca de view
 *  - onSearch(term) / onClear(): busca por título
 *  - searching: true enquanto os resultados de uma busca estão na tela
 */
export default function Navbar({ view, onNavigate, onSearch, onClear, searching }) {
  const { user, logout, favorites, history, openAuth } = useAccount();

  const [solid, setSolid] = useState(false);
  const [open, setOpen] = useState(false); // campo de busca aberto (desktop)
  const [menuOpen, setMenuOpen] = useState(false); // menu hambúrguer (mobile)
  const [genresOpen, setGenresOpen] = useState(false); // dropdown de gêneros
  const [accountOpen, setAccountOpen] = useState(false); // dropdown da conta (desktop)
  const [value, setValue] = useState('');

  const inputRef = useRef(null);
  const genresRef = useRef(null);
  const accountRef = useRef(null);

  // fundo de vidro depois de rolar a página
  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  // Esc fecha o menu mobile
  useEffect(() => {
    if (!menuOpen) return undefined;
    const onKey = (e) => e.key === 'Escape' && setMenuOpen(false);
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [menuOpen]);

  // ao ampliar a janela (ex.: girar o tablet), fecha o menu mobile
  useEffect(() => {
    const media = window.matchMedia('(min-width: 821px)');
    const onChange = (e) => e.matches && setMenuOpen(false);
    media.addEventListener('change', onChange);
    return () => media.removeEventListener('change', onChange);
  }, []);

  // clique fora ou Esc fecham os dropdowns de gêneros e de conta
  useEffect(() => {
    if (!genresOpen && !accountOpen) return undefined;

    const onPointer = (e) => {
      if (genresRef.current && !genresRef.current.contains(e.target)) setGenresOpen(false);
      if (accountRef.current && !accountRef.current.contains(e.target)) setAccountOpen(false);
    };
    const onKey = (e) => {
      if (e.key === 'Escape') {
        setGenresOpen(false);
        setAccountOpen(false);
      }
    };

    document.addEventListener('pointerdown', onPointer);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('pointerdown', onPointer);
      document.removeEventListener('keydown', onKey);
    };
  }, [genresOpen, accountOpen]);

  const closeMenus = () => {
    setMenuOpen(false);
    setGenresOpen(false);
    setAccountOpen(false);
  };

  const closeSearch = () => {
    setOpen(false);
    setValue('');
    if (searching) onClear();
  };

  const goTo = (key) => {
    setOpen(false);
    setValue('');
    closeMenus();
    onNavigate(key);
  };

  const submit = (event) => {
    event.preventDefault();
    if (!value.trim()) return;
    onSearch(value.trim());
    closeMenus();
  };

  const isActive = (key) => !searching && view === key;
  const genreActive = !searching && view.startsWith('genre:');

  return (
    <header className={`nav ${solid || searching || menuOpen ? 'is-solid' : ''}`}>
      <button className="nav__logo" onClick={() => goTo('home:all')} aria-label="CINESCOPE, ir para o início">
        <Logo />
      </button>

      <button
        className={`nav__burger ${menuOpen ? 'is-open' : ''}`}
        onClick={() => setMenuOpen((m) => !m)}
        aria-label={menuOpen ? 'Fechar menu' : 'Abrir menu'}
        aria-expanded={menuOpen}
        aria-controls="nav-panel"
      >
        <span />
        <span />
        <span />
      </button>

      <div id="nav-panel" className={`nav__panel ${menuOpen ? 'is-open' : ''}`}>
        <nav className="nav__links" aria-label="Categorias">
          {TABS.map((t) => (
            <button
              key={t.key}
              className={isActive(t.key) ? 'is-active' : ''}
              aria-current={isActive(t.key) ? 'page' : undefined}
              onClick={() => goTo(t.key)}
            >
              {t.label}
            </button>
          ))}

          {/* Menu de gêneros */}
          <div className="nav__menu" ref={genresRef}>
            <button
              className={`nav__trigger ${genreActive ? 'is-active' : ''}`}
              aria-expanded={genresOpen}
              aria-haspopup="true"
              onClick={() => {
                setGenresOpen((o) => !o);
                setAccountOpen(false);
              }}
            >
              Gêneros <ChevronDownIcon className="nav__chevron" />
            </button>

            <div className={`nav__dropdown ${genresOpen ? 'is-open' : ''}`}>
              {GENRES.map((genre) => (
                <button
                  key={genre.id}
                  className={isActive(`genre:${genre.id}`) ? 'is-active' : ''}
                  aria-current={isActive(`genre:${genre.id}`) ? 'page' : undefined}
                  onClick={() => goTo(`genre:${genre.id}`)}
                >
                  {genre.label}
                </button>
              ))}
            </div>
          </div>
        </nav>

        <form className={`nav__search ${open ? 'is-open' : ''}`} onSubmit={submit} role="search">
          <button
            type="button"
            className="nav__icon"
            aria-label={open ? 'Fechar busca' : 'Abrir busca'}
            onClick={open ? closeSearch : () => setOpen(true)}
          >
            {open ? <CloseIcon /> : <SearchIcon />}
          </button>
          <input
            ref={inputRef}
            type="search"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={(e) => e.key === 'Escape' && closeSearch()}
            placeholder="Buscar títulos, filmes, séries"
            aria-label="Buscar por título"
          />
        </form>

        {/* Atalhos: Continuar assistindo e Favoritos */}
        <div className="nav__shortcuts">
          <button
            className={`nav__shortcut ${isActive('continue') ? 'is-active' : ''}`}
            onClick={() => goTo('continue')}
            title="Continuar assistindo"
            aria-label="Continuar assistindo"
            aria-current={isActive('continue') ? 'page' : undefined}
          >
            <ClockIcon />
            <span className="nav__label">Continuar assistindo</span>
            {history.length > 0 && <span className="nav__count">{history.length}</span>}
          </button>

          <button
            className={`nav__shortcut ${isActive('favorites') ? 'is-active' : ''}`}
            onClick={() => goTo('favorites')}
            title="Favoritos"
            aria-label="Favoritos"
            aria-current={isActive('favorites') ? 'page' : undefined}
          >
            <HeartIcon />
            <span className="nav__label">Favoritos</span>
            {favorites.length > 0 && <span className="nav__count">{favorites.length}</span>}
          </button>
        </div>

        {/* Conta */}
        <div className="nav__menu nav__menu--account" ref={accountRef}>
          {user ? (
            <>
              <button
                className="nav__avatar"
                aria-label={`Conta de ${user.name}`}
                aria-expanded={accountOpen}
                aria-haspopup="true"
                onClick={() => {
                  setAccountOpen((o) => !o);
                  setGenresOpen(false);
                }}
              >
                {user.name.charAt(0).toUpperCase()}
              </button>

              <div className={`nav__dropdown nav__dropdown--right ${accountOpen ? 'is-open' : ''}`}>
                <p className="nav__who">
                  <strong>{user.name}</strong>
                  <span>{user.email}</span>
                </p>
                <button
                  onClick={() => {
                    closeMenus();
                    logout();
                  }}
                >
                  <LogoutIcon /> Sair
                </button>
              </div>
            </>
          ) : (
            <button
              className="btn btn--accent nav__login"
              onClick={() => {
                closeMenus();
                openAuth();
              }}
            >
              <UserIcon /> Entrar
            </button>
          )}
        </div>
      </div>
    </header>
  );
}