'use client';

export default function TopBar({ onOpenPalette, onOpenFdroid, mode, onToggleMode }) {
  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="topbar">
      <div className="topbar-inner">
        <div className="topbar-brand" onClick={() => scrollTo('hero')}>
          <div className="topbar-logo-wrap">
            {/* SVG Logo */}
            <img src="/logo.svg" alt="MoltenStar" className="topbar-logo" draggable="false" />
          </div>
          <div className="topbar-title-group">
            <span className="topbar-title">MoltenStar</span>
            <span className="topbar-badge">Projects</span>
          </div>
        </div>

        <nav className="topbar-nav">
          <button className="topbar-link" onClick={() => scrollTo('exterams')}>
            <span className="material-symbols-rounded">phone_android</span>
            <span>ExteraMS</span>
          </button>
          <button className="topbar-link" onClick={() => scrollTo('kdems')}>
            <span className="material-symbols-rounded">desktop_windows</span>
            <span>kdeMS</span>
          </button>
          <button className="topbar-link" onClick={onOpenFdroid}>
            <span className="material-symbols-rounded">storefront</span>
            <span>F-Droid</span>
          </button>
          <button className="topbar-link" onClick={() => scrollTo('themes')}>
            <span className="material-symbols-rounded">palette</span>
            <span>Темы</span>
          </button>
        </nav>

        <div className="topbar-actions">
          <button
            className="icon-btn"
            onClick={onOpenPalette}
            title="Палитра Material You"
            aria-label="Выбрать цвет палитры"
          >
            <span className="material-symbols-rounded">colors</span>
          </button>

          <button
            className="icon-btn"
            onClick={onToggleMode}
            title={mode === 'dark' ? 'Светлая тема' : 'Тёмная тема'}
            aria-label="Переключить тему"
          >
            <span className="material-symbols-rounded">
              {mode === 'dark' ? 'light_mode' : 'dark_mode'}
            </span>
          </button>

          <a
            href="https://github.com/MoltenSt4r"
            target="_blank"
            rel="noopener noreferrer"
            className="icon-btn"
            title="GitHub"
            aria-label="GitHub"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
            </svg>
          </a>
        </div>
      </div>
    </header>
  );
}
