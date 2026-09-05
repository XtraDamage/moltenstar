'use client';
import Logo from './Logo';

export default function TopBar({ onMenuClick, onSettingsClick }) {
  return (
    <header className="top-bar">
      <div className="top-bar__leading">
        <button className="icon-button" onClick={onMenuClick} aria-label="Menu">
          <span className="material-symbols-rounded">menu</span>
        </button>
        <div className="top-bar__title-group">
          <Logo size={28} />
          <h1 className="top-bar__title">MoltenStar</h1>
        </div>
      </div>
      <div className="top-bar__trailing">
        <button className="icon-button" onClick={onSettingsClick} aria-label="Settings">
          <span className="material-symbols-rounded">settings</span>
        </button>
      </div>
    </header>
  );
}
