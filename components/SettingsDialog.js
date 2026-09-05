'use client';
import { useEffect, useState } from 'react';
import { MONET_SCHEMES } from '../lib/monet';
import { login, register, logout, isAuthenticated, getUser, setPBUrl } from '../lib/pb';

export default function SettingsDialog({ isOpen, onClose, theme, colorScheme, pbUrl, onThemeChange, onColorSchemeChange, onPbUrlChange, onAuthChange }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isAuth, setIsAuth] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const themeOptions = [
    { value: 'light', icon: 'light_mode', label: 'Light' },
    { value: 'dark', icon: 'dark_mode', label: 'Dark' },
    { value: 'auto', icon: 'auto_mode', label: 'Auto' }
  ];

  useEffect(() => {
    if (isOpen) {
      setIsAuth(isAuthenticated());
      setUserEmail(getUser()?.email || '');
      setError('');
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const handleUrlChange = (e) => {
    const newUrl = e.target.value;
    onPbUrlChange(newUrl);
    setPBUrl(newUrl);
  };

  const handleLogin = async () => {
    setLoading(true);
    setError('');
    try {
      await login(email, password);
      setIsAuth(true);
      setUserEmail(getUser()?.email || '');
      if (onAuthChange) onAuthChange();
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  const handleRegister = async () => {
    setLoading(true);
    setError('');
    try {
      await register(email, password);
      setIsAuth(true);
      setUserEmail(getUser()?.email || '');
      if (onAuthChange) onAuthChange();
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  const handleLogout = () => {
    logout();
    setIsAuth(false);
    setUserEmail('');
    if (onAuthChange) onAuthChange();
  };

  return (
    <div className={`settings-overlay ${isOpen ? 'settings-overlay--visible' : ''}`}>
      <div className="settings-overlay__scrim" onClick={onClose} />
      <div className={`settings-surface ${isOpen ? 'settings-surface--visible' : ''}`}>
        <div className="settings-header">
          <button className="icon-button settings-header__back" onClick={onClose}>
            <span className="material-symbols-rounded">close</span>
          </button>
          <span className="settings-header__title">Settings</span>
        </div>
        <div className="settings-body">
          <div className="settings-section">
            <div className="settings-section__title">Cloud Sync (PocketBase)</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              
              {isAuth ? (
                <div style={{ padding: '12px', borderRadius: '12px', background: 'var(--md-sys-color-secondary-container)', color: 'var(--md-sys-color-on-secondary-container)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '14px' }}>Logged in as: <b>{userEmail}</b></span>
                  <button onClick={handleLogout} style={{ padding: '6px 12px', borderRadius: '8px', border: 'none', background: 'var(--md-sys-color-error)', color: 'var(--md-sys-color-on-error)', cursor: 'pointer' }}>Logout</button>
                </div>
              ) : (
                <>
                  <input 
                    type="email" 
                    placeholder="Email" 
                    value={email} 
                    onChange={e => setEmail(e.target.value)}
                    style={{ padding: '12px', borderRadius: '12px', border: '1px solid var(--md-sys-color-outline-variant)', background: 'var(--md-sys-color-surface-container-highest)', color: 'var(--md-sys-color-on-surface)', outline: 'none' }}
                  />
                  <input 
                    type="password" 
                    placeholder="Password (min 8 chars)" 
                    value={password} 
                    onChange={e => setPassword(e.target.value)}
                    style={{ padding: '12px', borderRadius: '12px', border: '1px solid var(--md-sys-color-outline-variant)', background: 'var(--md-sys-color-surface-container-highest)', color: 'var(--md-sys-color-on-surface)', outline: 'none' }}
                  />
                  {error && <div style={{ color: 'var(--md-sys-color-error)', fontSize: '12px' }}>{error}</div>}
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button onClick={handleLogin} disabled={loading} style={{ flex: 1, padding: '10px', borderRadius: '12px', border: 'none', background: 'var(--md-sys-color-primary)', color: 'var(--md-sys-color-on-primary)', cursor: 'pointer' }}>
                      {loading ? '...' : 'Login'}
                    </button>
                    <button onClick={handleRegister} disabled={loading} style={{ flex: 1, padding: '10px', borderRadius: '12px', border: 'none', background: 'var(--md-sys-color-secondary)', color: 'var(--md-sys-color-on-secondary)', cursor: 'pointer' }}>
                      {loading ? '...' : 'Register'}
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>

          <div className="settings-section">
            <div className="settings-section__title">Theme</div>
            <div className="settings-theme-toggle">
              {themeOptions.map(opt => (
                <button
                  key={opt.value}
                  className={`settings-theme-option ${theme === opt.value ? 'settings-theme-option--active' : ''}`}
                  onClick={() => {
                    onThemeChange(opt.value);
                    if (navigator.vibrate) navigator.vibrate(10);
                  }}
                >
                  <span className="material-symbols-rounded">{opt.icon}</span>
                  <span>{opt.label}</span>
                </button>
              ))}
            </div>
          </div>
          <div className="settings-section">
            <div className="settings-section__title">Color</div>
            <div className="settings-color-grid">
              {Object.entries(MONET_SCHEMES).map(([key, scheme]) => (
                <button
                  key={key}
                  className={`settings-color-chip ${colorScheme === key ? 'settings-color-chip--active' : ''}`}
                  onClick={() => {
                    onColorSchemeChange(key);
                    if (navigator.vibrate) navigator.vibrate(10);
                  }}
                >
                  <div className="settings-color-chip__swatch" style={{ backgroundColor: scheme.seed }}>
                    {colorScheme === key && <span className="material-symbols-rounded settings-color-chip__check">check</span>}
                  </div>
                  <span className="settings-color-chip__name">{scheme.displayName}</span>
                </button>
              ))}
            </div>
          </div>
          <div className="settings-section">
            <div className="settings-section__title">About</div>
            <p style={{ fontSize: '14px', color: 'var(--md-sys-color-on-surface-variant)', lineHeight: 1.6 }}>
              MoltenStar v1.0<br />
              AI chat powered by Grok 4.6<br />
              via OpenRouter API
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
