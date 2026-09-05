'use client';
import { useEffect } from 'react';
import { MONET_SCHEMES } from '../lib/monet';

export default function SettingsDialog({ isOpen, onClose, theme, colorScheme, onThemeChange, onColorSchemeChange }) {
  const themeOptions = [
    { value: 'light', icon: 'light_mode', label: 'Light' },
    { value: 'dark', icon: 'dark_mode', label: 'Dark' },
    { value: 'auto', icon: 'auto_mode', label: 'Auto' }
  ];

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

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
