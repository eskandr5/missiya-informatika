import { useState, type FormEvent } from 'react';
import { LuArrowLeft, LuLogIn, LuShieldCheck } from 'react-icons/lu';

interface Props {
  isLoading?: boolean;
  onLogin: (email: string, password: string) => Promise<unknown>;
  onBack: () => void;
  onRegister: () => void;
}

export default function LoginScreen({
  isLoading = false,
  onLogin,
  onBack,
  onRegister,
}: Props) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const busy = isLoading || submitting;

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      await onLogin(email.trim(), password);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Не удалось войти. Проверьте данные.');
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
            <LuShieldCheck aria-hidden="true" />
            <span>Supabase Auth · Phase 7</span>
          </div>

          <h1>Войдите, чтобы подготовить облачный прогресс.</h1>
          <p>
            Сейчас вход не блокирует обучение и не заменяет локальный прогресс.
            Мы только подключаем сессию, чтобы следующие фазы могли аккуратно
            перенести результаты в Supabase.
          </p>

          <div className="auth-screen__mini-card">
            <strong>Что уже работает</strong>
            <span>email + пароль, текущая сессия, выход из аккаунта</span>
          </div>
        </section>

        <section className="auth-screen__panel auth-screen__panel--form">
          <div className="auth-screen__form-head">
            <span className="auth-screen__form-icon" aria-hidden="true">
              <LuLogIn />
            </span>
            <div>
              <p>Аккаунт</p>
              <h2>Вход</h2>
            </div>
          </div>

          <form className="auth-form" onSubmit={handleSubmit}>
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
                placeholder="Ваш пароль"
                autoComplete="current-password"
                required
              />
            </label>

            {error && <p className="auth-form__error">{error}</p>}

            <button type="submit" className="btn btn-primary auth-form__submit" disabled={busy}>
              {busy ? 'Входим...' : 'Войти'}
            </button>
          </form>

          <p className="auth-screen__switch">
            Нет аккаунта?
            <button type="button" onClick={onRegister}>
              Зарегистрироваться
            </button>
          </p>
        </section>
      </div>
    </div>
  );
}
