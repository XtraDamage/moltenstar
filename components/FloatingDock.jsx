'use client';

export default function FloatingDock({ onOpenPalette, onOpenFdroid, mode, onToggleMode }) {
  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <aside className="floating-dock-wrap">
      <div className="floating-dock">
        <button
          className="dock-item"
          onClick={() => scrollTo('hero')}
          title="Наверх"
          aria-label="В начало страницы"
        >
          <span className="material-symbols-rounded">arrow_upward</span>
        </button>

        <div className="dock-separator" />

        <button
          className="dock-item"
          onClick={() => scrollTo('exterams')}
          title="ExteraMS (Android)"
          aria-label="Перейти к ExteraMS"
        >
          <span className="material-symbols-rounded">phone_android</span>
        </button>

        <button
          className="dock-item"
          onClick={() => scrollTo('kdems')}
          title="kdeMS (KDE Plasma 6)"
          aria-label="Перейти к kdeMS"
        >
          <span className="material-symbols-rounded">desktop_windows</span>
        </button>

        <button
          className="dock-item"
          onClick={onOpenFdroid}
          title="Репозиторий F-Droid"
          aria-label="Открыть репозиторий F-Droid"
        >
          <span className="material-symbols-rounded">storefront</span>
        </button>

        <div className="dock-separator" />

        <button
          className="dock-item"
          onClick={onOpenPalette}
          title="Цветовая палитра Monet"
          aria-label="Выбрать тему Monet"
        >
          <span className="material-symbols-rounded">palette</span>
        </button>

        <button
          className="dock-item"
          onClick={onToggleMode}
          title={mode === 'dark' ? 'Включить светлую тему' : 'Включить тёмную тему'}
          aria-label="Переключить день/ночь"
        >
          <span className="material-symbols-rounded">
            {mode === 'dark' ? 'light_mode' : 'dark_mode'}
          </span>
        </button>
      </div>
    </aside>
  );
}
