/**
 * Autenticação SIMULADA no navegador (projeto acadêmico, sem servidor).
 *
 * As contas ficam no localStorage; a senha é guardada como hash (SHA-256 com
 * o e-mail como "sal"). Isso NÃO substitui um back-end de verdade: qualquer
 * pessoa com acesso ao navegador consegue ver os dados. Para produção, use
 * um serviço de autenticação (Firebase Auth, Supabase, Auth0...).
 */
const USERS_KEY = 'cinescope:users:v1';
const SESSION_KEY = 'cinescope:session:v1';

const normalizeEmail = (email) => email.trim().toLowerCase();

function readUsers() {
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY)) ?? {};
  } catch {
    return {};
  }
}

function writeUsers(users) {
  try {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  } catch {
    throw new Error('Não foi possível salvar a conta: o armazenamento do navegador está indisponível.');
  }
}

function startSession(email) {
  try {
    localStorage.setItem(SESSION_KEY, email);
  } catch {
    /* sem storage: a sessão dura apenas enquanto a página estiver aberta */
  }
}

/** Gera o hash da senha. Usa Web Crypto quando disponível (https e localhost). */
async function hashPassword(password, salt) {
  const text = `${salt}:${password}`;

  if (globalThis.crypto?.subtle) {
    const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text));
    return Array.from(new Uint8Array(digest))
      .map((byte) => byte.toString(16).padStart(2, '0'))
      .join('');
  }

  // Alternativa simples para contextos sem Web Crypto (ex.: http em rede local). Apenas demonstrativa.
  let hash = 5381;
  for (const char of text) hash = ((hash << 5) + hash + char.charCodeAt(0)) >>> 0;
  return `d${hash.toString(16)}`;
}

function assertEmail(email) {
  if (!/^\S+@\S+\.\S+$/.test(email)) throw new Error('Digite um e-mail válido.');
}

function assertPassword(password) {
  if (password.length < 6) throw new Error('A senha precisa ter pelo menos 6 caracteres.');
}

/** Cria a conta e já inicia a sessão. Devolve { name, email }. */
export async function registerUser({ name, email, password }) {
  const cleanName = name.trim();
  const key = normalizeEmail(email);

  if (cleanName.length < 2) throw new Error('Digite seu nome (mínimo de 2 letras).');
  assertEmail(key);
  assertPassword(password);

  const users = readUsers();
  if (users[key]) throw new Error('Já existe uma conta com este e-mail. Use "Entrar".');

  users[key] = { name: cleanName, passHash: await hashPassword(password, key) };
  writeUsers(users);
  startSession(key);

  return { name: cleanName, email: key };
}

/** Confere e-mail e senha e inicia a sessão. Devolve { name, email }. */
export async function loginUser({ email, password }) {
  const key = normalizeEmail(email);
  assertEmail(key);

  const account = readUsers()[key];
  const hash = await hashPassword(password, key);

  if (!account || account.passHash !== hash) throw new Error('E-mail ou senha incorretos.');

  startSession(key);
  return { name: account.name, email: key };
}

/** Devolve o usuário da sessão atual (ou null). */
export function getSessionUser() {
  try {
    const key = localStorage.getItem(SESSION_KEY);
    const account = key ? readUsers()[key] : null;
    return account ? { name: account.name, email: key } : null;
  } catch {
    return null;
  }
}

/** Encerra a sessão. */
export function logoutUser() {
  try {
    localStorage.removeItem(SESSION_KEY);
  } catch {
    /* ignora */
  }
}