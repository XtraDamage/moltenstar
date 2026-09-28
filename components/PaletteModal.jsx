'use client';

import { MONET_SCHEMES } from '../lib/monet';

export default function PaletteModal({ isOpen, onClose, currentScheme, onSelectScheme, mode, onSelectMode }) {
  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-surface" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title-group">
            <span className="material-symbols-rounded modal-title-icon">palette</span>
            <h2 className="modal-title">Палитра Material You</h2>
          </div>
          <button className="icon-btn" onClick={onClose} aria-label="Закрыть">
            <span className="material-symbols-rounded">close</span>
          </button>
        </div>

        <div className="modal-body">
          <div className="settings-group">
            <span className="settings-group-label">Режим темы</span>
            <div className="theme-mode-pills">
              <button
                className={`mode-pill ${mode === 'light' ? 'mode-pill--active' : ''}`}
                onClick={() => onSelectMode('light')}
              >
                <span className="material-symbols-rounded">light_mode</span>
                <span>Светлая</span>
              </button>
              <button
                className={`mode-pill ${mode === 'dark' ? 'mode-pill--active' : ''}`}
                onClick={() => onSelectMode('dark')}
              >
                <span className="material-symbols-rounded">dark_mode</span>
                <span>Тёмная</span>
              </button>
            </div>
          </div>

          <div className="settings-group">
            <span className="settings-group-label">Цветовая палитра Monet</span>
            <div className="palette-grid">
              {Object.values(MONET_SCHEMES).map((scheme) => {
                const isActive = currentScheme === scheme.name;
                const swatchColor = scheme.seed;
                return (
                  <button
                    key={scheme.name}
                    className={`palette-chip ${isActive ? 'palette-chip--active' : ''}`}
                    onClick={() => onSelectScheme(scheme.name)}
                  >
                    <div
                      className="palette-swatch"
                      style={{ backgroundColor: swatchColor }}
                    >
                      {isActive && (
                        <span className="material-symbols-rounded swatch-check">check</span>
                      )}
                    </div>
                    <span className="palette-name">{scheme.displayName}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="modal-actions">
          <button className="btn btn--filled" onClick={onClose}>
            Готово
          </button>
        </div>
      </div>
    </div>
  );
}
