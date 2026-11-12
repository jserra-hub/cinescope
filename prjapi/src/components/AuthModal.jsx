import { useEffect, useRef, useState } from 'react';
import Logo from './Logo.jsx';
import { CloseIcon } from './Icons.jsx';

/**
 * Modal minimalista de login / criação de conta (simulado, ver utils/auth.js).
 * Fecha com Esc, clique fora ou no botão ×.
 *
 * Props:
 *  - reason: mensagem opcional exibida sob o título (ex.: "Entre para salvar favoritos")
 *  - onClose(): fecha o modal
 *  - onLogin(form) / onRegister(form): devolvem Promise que rejeita com a mensagem de erro
 */
export default function AuthModal({ reason, onClose, onLogin, onRegister }) {
  const [mode, setMode] = useState('login'); // login | register
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const firstFieldRef = useRef(null);

  const isRegister = mode === 'register';
  const update = (field) => (event) => setForm((f) => ({ ...f, [field]: event.target.value }));

  // Esc fecha e a rolagem da página fica travada enquanto o modal estiver aberto
  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = previousOverflow;
    };
  }, [onClose]);

  // foca o primeiro campo ao abrir e ao alternar entre entrar / criar conta
  useEffect(() => {
    firstFieldRef.current?.focus();
  }, [mode]);

  const switchMode = () => {
    setMode(isRegister ? 'login' : 'register');
    setError('');
  };

  const submit = async (event) => {
    event.preventDefault();
    setError('');
    setBusy(true);

    try {
      if (isRegister) await onRegister(form);
      else await onLogin(form);
      // sucesso: o provider fecha o modal
    } catch (err) {
      setError(err.message);
      setBusy(false);
    }
  };

  return (
    <div className="overlay overlay--center" onClick={onClose}>
      <div
        className="auth"
        role="dialog"
        aria-modal="true"
        aria-labelledby="auth-title"
        onClick={(e) => e.stopPropagation()}
      >
        <button className="modal__close" onClick={onClose} aria-label="Fechar">
          <CloseIcon />
        </button>

        <div className="auth__brand">
          <Logo />
          <h2 id="auth-title">{isRegister ? 'Criar conta' : 'Entrar'}</h2>
          {reason && <p className="auth__reason">{reason}</p>}
        </div>

        <form className="auth__form" onSubmit={submit} noValidate>
          {isRegister && (
            <div className="field">
              <label htmlFor="auth-name">Nome</label>
              <input
                id="auth-name"
                ref={firstFieldRef}
                type="text"
                autoComplete="name"
                placeholder="Como devemos te chamar?"
                value={form.name}
                onChange={update('name')}
              />
            </div>
          )}

          <div className="field">
            <label htmlFor="auth-email">E-mail</label>
            <input
              id="auth-email"
              ref={isRegister ? null : firstFieldRef}
              type="email"
              autoComplete="email"
              placeholder="voce@email.com"
              value={form.email}
              onChange={update('email')}
            />
          </div>

          <div className="field">
            <label htmlFor="auth-password">Senha</label>
            <input
              id="auth-password"
              type="password"
              autoComplete={isRegister ? 'new-password' : 'current-password'}
              placeholder="Mínimo de 6 caracteres"
              value={form.password}
              onChange={update('password')}
            />
          </div>

          {error && (
            <p className="auth__error" role="alert">
              {error}
            </p>
          )}

          <button className="btn btn--play auth__submit" type="submit" disabled={busy}>
            {busy ? 'Aguarde…' : isRegister ? 'Criar conta' : 'Entrar'}
          </button>
        </form>

        <p className="auth__switch">
          {isRegister ? 'Já tem conta?' : 'Ainda não tem conta?'}{' '}
          <button type="button" onClick={switchMode}>
            {isRegister ? 'Entrar' : 'Criar conta'}
          </button>
        </p>

        <p className="auth__note">Conta de demonstração: os dados ficam salvos apenas neste navegador.</p>
      </div>
    </div>
  );
}