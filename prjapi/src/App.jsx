import { useCallback, useEffect, useState } from 'react';
import useCatalog from './hooks/useCatalog.js';
import useSearch from './hooks/useSearch.js';
import { AccountProvider, useAccount } from './context/AccountContext.jsx';
import { getGenre } from './data/genres.js';
import IntroScreen from './components/IntroScreen.jsx';
import Navbar from './components/Navbar.jsx';
import HeroBanner from './components/HeroBanner.jsx';
import Row from './components/Row.jsx';
import SearchResults from './components/SearchResults.jsx';
import GenrePage from './components/GenrePage.jsx';
import LibraryPage from './components/LibraryPage.jsx';
import MovieModal from './components/MovieModal.jsx';
import Message from './components/Message.jsx';
import { RowsSkeleton } from './components/Loader.jsx';

/**
 * "view" é a tela atual:
 *   'home:all' | 'home:series' | 'home:movie'  -> catálogo (com filtro de aba)
 *   'genre:<id>'                               -> página de gênero (data/genres.js)
 *   'favorites'                                -> favoritos
 *   'continue'                                 -> continuar assistindo
 * Quando há uma busca ativa, os resultados dela têm prioridade sobre a view.
 */
function Cinescope() {
  const [introDone, setIntroDone] = useState(false);
  const [view, setView] = useState('home:all');
  const [selected, setSelected] = useState(null); // título aberto no modal
  const [notice, setNotice] = useState(''); // aviso temporário (toast)

  const { user, favorites, history, openAuth, startWatching, clearHistory } = useAccount();

  const tab = view.startsWith('home:') ? view.slice(5) : 'all';
  const { rows, featured, loading, error: catalogError } = useCatalog(tab);
  const search = useSearch();
  const { clear: clearSearch } = search;

  const finishIntro = useCallback(() => setIntroDone(true), []);
  const closeModal = useCallback(() => setSelected(null), []);
  const login = useCallback(() => openAuth(), [openAuth]);

  // Troca de tela: encerra a busca, muda a view e volta ao topo
  const navigate = useCallback(
    (next) => {
      clearSearch();
      setView(next);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },
    [clearSearch]
  );

  // "Assistir": não há vídeo, então simulamos o progresso e salvamos em "Continuar assistindo"
  const play = useCallback(
    (item) => {
      if (!user) {
        openAuth('Entre na sua conta para assistir e salvar seu progresso.');
        return;
      }
      const progress = startWatching(item);
      setNotice(`Demonstração sem vídeo: "${item.titulo}" foi para Continuar assistindo (${progress}%).`);
    },
    [user, openAuth, startWatching]
  );

  // some com o aviso depois de alguns segundos
  useEffect(() => {
    if (!notice) return undefined;
    const timer = setTimeout(() => setNotice(''), 3600);
    return () => clearTimeout(timer);
  }, [notice]);

  // ---- escolhe o conteúdo principal conforme a view ----
  let content = null;

  if (search.active) {
    content = <SearchResults search={search} onSelect={setSelected} />;
  } else if (view === 'favorites') {
    content = (
      <LibraryPage
        key="favorites"
        title="Favoritos"
        items={favorites}
        user={user}
        onSelect={setSelected}
        onLogin={login}
        lockedText="Entre para salvar filmes e séries nos favoritos e vê-los aqui."
        emptyTitle="Nenhum favorito ainda"
        emptyText="Toque no coração de qualquer filme ou série para guardá-lo aqui."
      />
    );
  } else if (view === 'continue') {
    content = (
      <LibraryPage
        key="continue"
        title="Continuar Assistindo"
        items={history}
        user={user}
        onSelect={setSelected}
        onLogin={login}
        lockedText="Entre para acompanhar o que você começou a assistir."
        emptyTitle="Nada em andamento"
        emptyText="Clique em “Assistir” em qualquer título e ele aparecerá aqui."
        onClear={clearHistory}
        clearLabel="Limpar histórico"
      />
    );
  } else if (view.startsWith('genre:')) {
    const genre = getGenre(view.slice(6));
    content = genre ? <GenrePage key={genre.id} genre={genre} onSelect={setSelected} /> : null;
  } else {
    // Início (com filtro Séries / Filmes). key={tab}: ao trocar de aba roda o fade + slide
    const showContinue = tab === 'all' && user && history.length > 0;

    content = (
      <div className="catalog" key={tab}>
        <HeroBanner items={featured} loading={loading} onInfo={setSelected} onPlay={play} />

        {catalogError && (
          <div className="catalog__notice">
            <Message tone="error" title="Não foi possível carregar o catálogo">
              {catalogError}
            </Message>
          </div>
        )}

        {loading && rows.length === 0 ? (
          <RowsSkeleton />
        ) : (
          <div className="rows">
            {showContinue && <Row key="continue" title="Continuar Assistindo" items={history} onSelect={setSelected} />}
            {rows.map((row) => (
              <Row key={row.id} title={row.title} items={row.items} onSelect={setSelected} />
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="app">
      {/* O catálogo já carrega por trás enquanto a intro é exibida */}
      {!introDone && <IntroScreen onDone={finishIntro} />}

      <Navbar
        view={view}
        onNavigate={navigate}
        onSearch={search.run}
        onClear={search.clear}
        searching={search.active}
      />

      <main>{content}</main>

      <footer className="footer">
        Dados e imagens fornecidos pela{' '}
        <a href="https://www.omdbapi.com/" target="_blank" rel="noreferrer">OMDb API</a>. Projeto acadêmico.
      </footer>

      {selected && <MovieModal item={selected} onClose={closeModal} onPlay={play} />}
      {notice && <div className="toast" role="status">{notice}</div>}
    </div>
  );
}

export default function App() {
  return (
    <AccountProvider>
      <Cinescope />
    </AccountProvider>
  );
}