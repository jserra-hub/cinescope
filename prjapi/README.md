# CineScope: catálogo de filmes e séries

Aplicação web em **React** com visual de plataforma de streaming (inspirada em Netflix e HBO Max). Mostra um catálogo organizado em trilhos, um banner de destaque e permite buscar qualquer filme ou série pela **OMDb API** (Open Movie Database).

## Funcionalidades

- **Tela de abertura (intro):** logo com fade-in e scale sobre fundo escuro, que some suavemente depois de cerca de 3 segundos e revela o catálogo.
- **Hero banner:** destaque gigante com imagem de fundo, gradiente escuro, título, classificação, sinopse curta e botões "Assistir" e "Mais informações". Alterna entre 4 títulos a cada 8 segundos (pausa ao passar o mouse).
- **Trilhos (carrosséis):** "Em Alta", "Séries Recomendadas", "Filmes de Ação", "Ficção Científica" e "Adicionados Recentemente", com setas e rolagem horizontal.
- **Cards animados:** no hover ou foco por teclado o card cresce (`scale(1.05)`), ganha sombra e mostra nota, classificação, ano, gêneros e ações rápidas.
- **Abas Início / Séries / Filmes** que filtram o catálogo com transição de fade e slide.
- **Busca:** ícone de lupa na barra superior, com filtro Tudo / Filmes / Séries, paginação, indicador de carregamento e tratamento de erros (título não encontrado, falha de rede, chave inválida, limite diário).
- **Modal de detalhes** com sinopse, elenco, direção, avaliações (IMDb, Rotten Tomatoes, Metacritic), prêmios e link para o IMDb.
- Layout responsivo, foco visível no teclado e respeito a `prefers-reduced-motion`.

## Como usar

1. Aguarde a intro. O catálogo aparece em seguida.
2. Role a página para ver os trilhos. Use as setas laterais (ao passar o mouse) ou o scroll horizontal.
3. Passe o mouse em um card para ver o resumo. Clique para abrir os detalhes.
4. Use **Início / Séries / Filmes** no topo para filtrar o catálogo.
5. Clique na lupa, digite um título e pressione Enter para buscar na OMDb. Clique no **×** ou no logo para voltar ao catálogo.

> O botão **Assistir** é demonstrativo: mostra um aviso, pois o projeto não reproduz vídeo.


## Como os dados funcionam

- **Sem dados fixos:** o catálogo é montado em tempo real pela OMDb API. O arquivo `src/data/rows.js` guarda apenas os **termos de busca** de cada fileira (Avengers, Star Wars, Batman...).
- **Hero banner:** usa o primeiro título de cada fileira. Sinopse, gêneros e classificação vêm de uma segunda consulta por ID.
- **Cache:** as fileiras ficam 6 horas no `localStorage` e os detalhes 7 dias. Uma abertura sem cache gasta cerca de 12 requisições do limite diário de 1.000 da chave gratuita.
- **Idioma:** a OMDb devolve sinopses em inglês. Os gêneros são traduzidos em `src/utils/format.js`.
- **Categorias mistas:** em `src/data/rows.js` cada fileira tem uma lista de termos (ex.: `['Mission Impossible', 'John Wick', 'Mad Max', 'Die Hard']`). O `mixedSearch.js` busca cada termo na OMDb e intercala os resultados, então cada fileira mistura várias franquias.
- **Gêneros:** `src/data/genres.js` define as páginas do menu "Gêneros", cada uma com 8 termos.
- **Cache e custo:** as fileiras ficam 6 horas e as páginas de gênero 6 horas no `localStorage`. Uma abertura sem cache gasta cerca de 36 requisições (32 das fileiras e 4 de detalhes), e cada gênero aberto pela primeira vez gasta 8.
- **Limpar o cache:** F12 → Application → Local Storage → apague as chaves que começam com `cinescope:rows` e `cinescope:genre`.

## Conta, favoritos e "Continuar assistindo"

- **Login simulado:** contas e sessão ficam no `localStorage` (senha com hash). Não há servidor, então é apenas uma demonstração. Para uso real, use um serviço como Firebase Auth ou Supabase.
- **Favoritos:** o coração aparece nos cards, no banner e no modal. Sem login, ele abre o modal de entrada e salva o título depois que você entra.
- **Continuar assistindo:** cada clique em "Assistir" simula o progresso (8%, depois +17% por clique). O título aparece na fileira da home e na página dedicada, com barra de progresso.
- **Dados por conta:** favoritos e histórico são separados por e-mail.