/**
 * Cache simples no localStorage com prazo de validade (TTL).
 * Evita repetir requisições à OMDb e economiza o limite diário da chave gratuita.
 */

/** Lê um valor do cache. Devolve null se não existir ou se estiver vencido. */
export function readCache(key, ttl) {
  try {
    const raw = JSON.parse(localStorage.getItem(key));
    if (raw && Date.now() - raw.savedAt < ttl) return raw.data;
  } catch {
    /* cache inválido ou storage bloqueado: ignora */
  }
  return null;
}

/** Grava um valor no cache com a data atual. */
export function writeCache(key, data) {
  try {
    localStorage.setItem(key, JSON.stringify({ savedAt: Date.now(), data }));
  } catch {
    /* storage cheio ou bloqueado: ignora */
  }
}