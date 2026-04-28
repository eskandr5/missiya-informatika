import { useState, type FormEvent } from 'react';
import { LuArrowLeft, LuSparkles, LuUserPlus } from 'react-icons/lu';

interface Props {
  isLoading?: boolean;
  onRegister: (params: {
    email: string;
    password: string;
    displayName?: string;
  }) => Promise<unknown>;
  onBack: () => void;
  onLogin: () => void;
}

export default function RegisterScreen({
  isLoading = false,
  onRegister,
  onBack,
  onLogin,
}: Props) {
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const busy = isLoading || submitting;

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setSuccess(null);
    setSubmitting(true);

    try {
      await onRegister({
        email: email.trim(),
        password,
        displayName: displayName.trim() || undefined,
      });
      setSuccess('Аккаунт создан. Если Supabase требует подтверждение email, проверьте почту.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Не удалось создать аккаунт.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="app-page auth-screen">
      <div className="auth-screen__shell">
        <section className="auth-screen__panel auth-screen__panel--copy">
          <button type="button" className="auth-screen__back" onClick={onBack}>
            <LuArrowLeft aria-hidden="true" />
            <span>К карте обучения</span>
          </button>

          <div className="auth-screen__badge">
            <LuSparkles aria-hidden="true" />
            <span>Регистрация без username</span>
          </div>

          <h1>Создайте аккаунт для будущей синхронизации.</h1>
          <p>
            Имя можно оставить пустым. В Supabase уйдет только безопасная
            metadata: optional display_name и preferred_language = ru.
          </p>

          <div className="auth-screen__mini-card">
            <strong>Без лишнего</strong>
            <span>role, username и кастомные JWT здесь не создаются</span>
          </div>
        </section>

        <section className="auth-screen__panel auth-screen__panel--form">
          <div className="auth-screen__form-head">
            <span className="auth-screen__form-icon" aria-hidden="true">
              <LuUserPlus />
            </span>
            <div>
              <p>Аккаунт</p>
              <h2>Регистрация</h2>
            </div>
          </div>

          <form className="auth-form" onSubmit={handleSubmit}>
            <label className="auth-form__field">
              <span>Имя на платформе, необязательно</span>
              <input
                type="text"
                value={displayName}
                onChange={event => setDisplayName(event.target.value)}
                placeholder="Например, Амина"
                autoComplete="name"
              />
            </label>

            <label className="auth-form__field">
              <span>Email</span>
              <input
                type="email"
                value={email}
                onChange={event => setEmail(event.target.value)}
                placeholder="student@example.com"
                autoComplete="email"
                required
              />
            </label>

            <label className="auth-form__field">
              <span>Пароль</span>
              <input
                type="password"
                value={password}
                onChange={event => setPassword(event.target.value)}
                placeholder="Минимум 6 символов"
                autoComplete="new-password"
                minLength={6}
                required
              />
            </label>

            {error && <p className="auth-form__error">{error}</p>}
            {success && <p className="auth-form__success">{success}</p>}

            <button type="submit" className="btn btn-primary auth-form__submit" disabled={busy}>
              {busy ? 'Создаем...' : 'Создать аккаунт'}
            </button>
          </form>

          <p className="auth-screen__switch">
            Уже есть аккаунт?
            <button type="button" onClick={onLogin}>
              Войти
            </button>
          </p>
        </section>
      </div>
    </div>
  );
}
