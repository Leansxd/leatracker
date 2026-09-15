import { useState } from 'react';
import { auth } from '../firebase';
import { useAuth } from '../context/AuthContext';

export default function AuthScreen() {
  const { signup, signin } = useAuth();
  const [mode, setMode] = useState('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const switchMode = (nextMode) => {
    setMode(nextMode);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!auth) {
      setError('Firebase ayarları eksik. .env dosyasındaki VITE_FIREBASE_* değerlerini doldurun.');
      return;
    }
    setLoading(true);
    try {
      if (mode === 'signup') {
        await signup(email, password);
      } else {
        await signin(email, password);
      }
    } catch (err) {
      const code = err?.code || '';
      let msg = err?.message || 'Bir hata oluştu.';
      if (code === 'auth/invalid-credential' || code === 'auth/user-not-found' || code === 'auth/wrong-password') {
        msg = 'E-posta veya şifre hatalı.';
      } else if (code === 'auth/email-already-in-use') {
        msg = 'Bu e-posta zaten kayıtlı.';
      } else if (code === 'auth/weak-password') {
        msg = 'Şifre çok zayıf (en az 6 karakter olmalı).';
      } else if (code === 'auth/invalid-email') {
        msg = 'Geçersiz e-posta adresi.';
      } else if (code === 'auth/network-request-failed') {
        msg = 'İnternet bağlantısı yok.';
      }
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-screen">
      <div className="auth-card">
        <div className="auth-logo">
          <span className="auth-logo-icon">💪</span>
          <h1>LeaTracker</h1>
          <p>Antrenman Takip</p>
        </div>

        <div className="auth-tabs">
          <button
            className={`auth-tab ${mode === 'signin' ? 'active' : ''}`}
            onClick={() => switchMode('signin')}
          >
            Giriş Yap
          </button>
          <button
            className={`auth-tab ${mode === 'signup' ? 'active' : ''}`}
            onClick={() => switchMode('signup')}
          >
            Kayıt Ol
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <label className="auth-label">
            E-posta
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="ornek@mail.com"
              autoComplete="email"
              required
            />
          </label>

          <label className="auth-label">
            Şifre
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              minLength={6}
              autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
              required
            />
          </label>

          {error && <p className="auth-error">{error}</p>}

          <button type="submit" className="auth-submit" disabled={loading}>
            {loading ? 'Lütfen bekleyin...' : mode === 'signin' ? 'Giriş Yap' : 'Kayıt Ol'}
          </button>
        </form>

        {mode === 'signup' && (
          <p className="auth-footnote">
            Kayıt olarak verilerinizin bu cihazda güvenle saklanacağını kabul edersiniz.
          </p>
        )}
      </div>
    </div>
  );
}