/**
 * Catálogo de demonstração (dados mockados).
 *
 * Cada título tem: id (IMDb), título, ano, classificação indicativa, duração
 * ou temporadas, gêneros e sinopse em português. Os textos são ilustrativos.
 *
 * As IMAGENS não ficam aqui: o hook useCatalog busca o pôster de cada id na
 * OMDb API (e guarda em cache). A OMDb não fornece banners horizontais; se
 * quiser um banner próprio, adicione o campo opcional  backdrop: 'https://...'
 * em qualquer título e ele será usado no destaque e no modal.
 */

const filme = (id, titulo, ano, classificacao, duracao, generos, sinopse) => ({
  id, tipo: 'movie', titulo, ano, classificacao, duracao, generos, sinopse,
});

const serie = (id, titulo, ano, classificacao, temporadas, generos, sinopse) => ({
  id, tipo: 'series', titulo, ano, classificacao, generos, sinopse,
  duracao: `${temporadas} temporada${temporadas > 1 ? 's' : ''}`,
});

/** Trilhos exibidos na página inicial, na ordem. */
export const ROWS = [
  {
    id: 'em-alta',
    title: 'Em Alta',
    items: [
      serie('tt4574334', 'Stranger Things', 2016, '14', 5, ['Ficção científica', 'Terror', 'Drama'],
        'Em Hawkins, o desaparecimento de um garoto revela experimentos secretos, forças sobrenaturais e uma menina com poderes extraordinários.'),
      filme('tt1160419', 'Duna', 2021, '14', '2h 35min', ['Ficção científica', 'Aventura'],
        'Paul Atreides viaja ao perigoso planeta Arrakis para proteger sua família e o recurso mais valioso do universo.'),
      serie('tt10919420', 'Round 6', 2021, '16', 3, ['Suspense', 'Drama'],
        'Centenas de pessoas endividadas aceitam disputar jogos infantis mortais por um prêmio bilionário.'),
      filme('tt15398776', 'Oppenheimer', 2023, '16', '3h 0min', ['Drama', 'Histórico'],
        'A história do físico J. Robert Oppenheimer e do desenvolvimento da bomba atômica no Projeto Manhattan.'),
      serie('tt3581920', 'The Last of Us', 2023, '18', 2, ['Drama', 'Terror', 'Ação'],
        'Num mundo devastado por uma infecção, um contrabandista precisa escoltar uma adolescente por um país em ruínas.'),
      serie('tt13443470', 'Wandinha', 2022, '14', 2, ['Comédia', 'Mistério', 'Fantasia'],
        'Estudante da Escola Nevermore, Wandinha Addams investiga crimes misteriosos enquanto lida com seus poderes.'),
      filme('tt1517268', 'Barbie', 2023, '12', '1h 54min', ['Comédia', 'Fantasia'],
        'Expulsa da Barbieland por não ser perfeita, Barbie parte para o mundo real em busca de sentido.'),
      filme('tt7286456', 'Coringa', 2019, '16', '2h 2min', ['Drama', 'Crime', 'Suspense'],
        'Arthur Fleck, um comediante fracassado, mergulha na loucura e se transforma no Coringa em Gotham City.'),
    ],
  },
  {
    id: 'series-recomendadas',
    title: 'Séries Recomendadas',
    items: [
      serie('tt0903747', 'Breaking Bad', 2008, '16', 5, ['Crime', 'Drama'],
        'Um professor de química com câncer terminal passa a fabricar metanfetamina para garantir o futuro da família.'),
      serie('tt0944947', 'Game of Thrones', 2011, '18', 8, ['Fantasia', 'Drama', 'Aventura'],
        'Famílias nobres disputam o Trono de Ferro enquanto uma ameaça antiga desperta além da Muralha.'),
      serie('tt5753856', 'Dark', 2017, '16', 3, ['Ficção científica', 'Mistério'],
        'O sumiço de crianças numa cidade alemã expõe segredos de quatro famílias e viagens no tempo.'),
      serie('tt2442560', 'Peaky Blinders', 2013, '16', 6, ['Crime', 'Drama'],
        'Na Inglaterra pós-guerra, a família Shelby constrói um império criminoso liderado por Tommy.'),
      serie('tt7366338', 'Chernobyl', 2019, '16', 1, ['Drama', 'Histórico'],
        'A reconstituição do desastre nuclear de 1986 e do esforço de quem tentou conter suas consequências.'),
      serie('tt2085059', 'Black Mirror', 2011, '16', 7, ['Ficção científica', 'Suspense'],
        'Episódios independentes mostram o lado sombrio da tecnologia e seus efeitos na vida cotidiana.'),
      serie('tt6468322', 'La Casa de Papel', 2017, '16', 5, ['Ação', 'Crime', 'Suspense'],
        'Um grupo comandado pelo Professor planeja o maior assalto da história à Casa da Moeda da Espanha.'),
      serie('tt7660850', 'Sucessão', 2018, '16', 4, ['Drama', 'Comédia'],
        'Os herdeiros de um magnata da mídia disputam o controle da empresa da família.'),
    ],
  },
  {
    id: 'filmes-de-acao',
    title: 'Filmes de Ação',
    items: [
      filme('tt1392190', 'Mad Max: Estrada da Fúria', 2015, '16', '2h 0min', ['Ação', 'Aventura', 'Ficção científica'],
        'Em um deserto pós-apocalíptico, Furiosa e Max fogem de um tirano numa perseguição sem trégua.'),
      filme('tt0095016', 'Duro de Matar', 1988, '16', '2h 12min', ['Ação', 'Suspense'],
        'Um policial de Nova York enfrenta sozinho terroristas que tomaram um arranha-céu na noite de Natal.'),
      filme('tt2911666', 'John Wick', 2014, '16', '1h 41min', ['Ação', 'Crime'],
        'Um ex-assassino aposentado volta à ativa para se vingar de quem matou o cão deixado por sua esposa.'),
      filme('tt0172495', 'Gladiador', 2000, '16', '2h 35min', ['Ação', 'Drama', 'Histórico'],
        'Traído pelo império, um general romano vira gladiador e busca vingança contra o imperador Cômodo.'),
      filme('tt4912910', 'Missão: Impossível – Efeito Fallout', 2018, '14', '2h 28min', ['Ação', 'Aventura', 'Suspense'],
        'Ethan Hunt e sua equipe correm para impedir que plutônio roubado caia em mãos erradas.'),
      filme('tt4154796', 'Vingadores: Ultimato', 2019, '12', '3h 1min', ['Ação', 'Ficção científica', 'Aventura'],
        'Os heróis restantes se unem para desfazer o estrago causado por Thanos e restaurar o universo.'),
      filme('tt1745960', 'Top Gun: Maverick', 2022, '12', '2h 11min', ['Ação', 'Drama'],
        'Após mais de trinta anos de serviço, Maverick treina a nova geração de pilotos para uma missão quase impossível.'),
      filme('tt0468569', 'Batman: O Cavaleiro das Trevas', 2008, '12', '2h 32min', ['Ação', 'Crime', 'Drama'],
        'Batman, Gordon e Harvey Dent enfrentam o caos criado pelo Coringa em Gotham.'),
    ],
  },
  {
    id: 'ficcao-cientifica',
    title: 'Ficção Científica',
    items: [
      filme('tt0133093', 'Matrix', 1999, '14', '2h 16min', ['Ficção científica', 'Ação'],
        'Um hacker descobre que a realidade é uma simulação e se une à resistência contra as máquinas.'),
      filme('tt1375666', 'A Origem', 2010, '14', '2h 28min', ['Ficção científica', 'Ação', 'Suspense'],
        'Um ladrão especializado em invadir sonhos recebe a missão de implantar uma ideia na mente de um herdeiro.'),
      filme('tt1856101', 'Blade Runner 2049', 2017, '16', '2h 44min', ['Ficção científica', 'Drama'],
        'Um novo caçador de replicantes descobre um segredo capaz de abalar o que resta da sociedade.'),
      filme('tt0816692', 'Interestelar', 2014, '10', '2h 49min', ['Ficção científica', 'Drama', 'Aventura'],
        'Com a Terra à beira do colapso, astronautas atravessam um buraco de minhoca em busca de um novo lar para a humanidade.'),
      filme('tt0470752', 'Ex Machina', 2014, '16', '1h 48min', ['Ficção científica', 'Suspense'],
        'Um programador é convidado a testar a consciência de uma androide criada por um gênio recluso.'),
      filme('tt0076759', 'Star Wars: Uma Nova Esperança', 1977, '10', '2h 1min', ['Aventura', 'Ficção científica'],
        'Luke Skywalker se junta a rebeldes para destruir a arma suprema do Império Galáctico.'),
      filme('tt0078748', 'Alien: O 8º Passageiro', 1979, '16', '1h 57min', ['Terror', 'Ficção científica'],
        'A tripulação de uma nave de carga descobre que algo letal embarcou com eles.'),
      filme('tt1454468', 'Gravidade', 2013, '12', '1h 31min', ['Ficção científica', 'Suspense'],
        'Após um acidente no espaço, dois astronautas lutam para voltar à Terra com recursos cada vez mais escassos.'),
    ],
  },
  {
    id: 'adicionados-recentemente',
    title: 'Adicionados Recentemente',
    items: [
      filme('tt15239678', 'Duna: Parte Dois', 2024, '14', '2h 46min', ['Ficção científica', 'Aventura'],
        'Paul Atreides se une aos Fremen para vingar sua família e impedir um futuro terrível que só ele consegue ver.'),
      filme('tt22022452', 'Divertida Mente 2', 2024, 'L', '1h 36min', ['Animação', 'Comédia', 'Família'],
        'Riley entra na adolescência e novas emoções, como a Ansiedade, chegam para bagunçar a central de comando.'),
      filme('tt1262426', 'Wicked', 2024, '12', '2h 40min', ['Musical', 'Fantasia'],
        'Elphaba e Glinda constroem uma amizade improvável em Oz antes de seguirem caminhos opostos.'),
      filme('tt14230458', 'Pobres Criaturas', 2023, '18', '2h 21min', ['Comédia', 'Ficção científica', 'Drama'],
        'Revivida por um cientista excêntrico, Bella Baxter parte pelo mundo em busca de liberdade e conhecimento.'),
      serie('tt11280740', 'Ruptura', 2022, '16', 2, ['Ficção científica', 'Suspense'],
        'Funcionários de uma empresa misteriosa têm as memórias do trabalho separadas das da vida pessoal.'),
      serie('tt2788316', 'Xógum', 2024, '18', 1, ['Drama', 'Histórico', 'Aventura'],
        'No Japão feudal, um navegador inglês naufraga e se envolve na disputa de poder entre senhores da guerra.'),
      serie('tt14452776', 'O Urso', 2022, '18', 4, ['Drama', 'Comédia'],
        'Um chef renomado volta a Chicago para comandar a lanchonete da família e enfrenta a pressão da cozinha.'),
      serie('tt12637874', 'Fallout', 2024, '18', 1, ['Ficção científica', 'Ação', 'Drama'],
        'Mais de dois séculos após a guerra nuclear, moradores de um abrigo sobem à superfície devastada.'),
    ],
  },
];

/** Lista simples de todos os títulos (usada para buscar os pôsteres). */
export const ALL_TITLES = ROWS.flatMap((row) => row.items);

/** Títulos que se alternam no banner de destaque. */
export const FEATURED_IDS = ['tt4574334', 'tt1160419', 'tt10919420', 'tt0816692'];