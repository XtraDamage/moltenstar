'use client';

import confetti from 'canvas-confetti';

export default function Hero({ onOpenFdroid, onShowToast }) {
  const handleDownloadExtera = (e) => {
    // Launch celebratory confetti from button position
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (rect.left + rect.width / 2) / window.innerWidth;
    const y = (rect.top + rect.height / 2) / window.innerHeight;

    confetti({
      particleCount: 60,
      spread: 70,
      origin: { x, y },
      colors: ['#D32F2F', '#FCDEAC', '#FF8A80', '#FFCDD2'],
    });

    onShowToast('Загрузка ExteraMS v12.10.3 началась...');
  };

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="hero-section" id="hero">
      <div className="hero-ambient-orb hero-ambient-orb--1" />
      <div className="hero-ambient-orb hero-ambient-orb--2" />

      <div className="hero-container">
        {/* Animated Brand Emblem */}
        <div className="hero-emblem-wrap">
          <div className="hero-emblem-pulse" />
          <img
            src="/logo.svg"
            alt="MoltenStar Emblem"
            className="hero-emblem-svg"
            draggable="false"
          />
        </div>

        {/* Headline */}
        <div className="hero-badge">
          <span className="hero-badge-dot" />
          <span>MoltenStar Hub • 2026</span>
        </div>

        <h1 className="hero-title">
          Эстетика и мощь <br />
          <span className="hero-title-accent">Material Design 3</span>
        </h1>

        <p className="hero-subtitle">
          Хаб флагманских открытых проектов: от ультра-кастомизированного клиента Telegram <b>ExteraMS</b> для Android до всеобъемлющей среды <b>kdeMS</b> для KDE Plasma 6.
        </p>

        {/* Dual Flagship Fast Switcher */}
        <div className="hero-project-pills">
          <button className="project-pill project-pill--active" onClick={() => scrollTo('exterams')}>
            <span className="material-symbols-rounded">phone_android</span>
            <div className="project-pill-text">
              <span className="project-pill-title">ExteraMS</span>
              <span className="project-pill-desc">Android Telegram Client</span>
            </div>
            <span className="project-pill-tag">v12.10.3</span>
          </button>

          <button className="project-pill" onClick={() => scrollTo('kdems')}>
            <span className="material-symbols-rounded">desktop_windows</span>
            <div className="project-pill-text">
              <span className="project-pill-title">kdeMS</span>
              <span className="project-pill-desc">KDE Plasma 6 Suite</span>
            </div>
            <span className="project-pill-tag">Android 16 Style</span>
          </button>
        </div>

        {/* Actions Deck */}
        <div className="hero-actions">
          <a
            href="https://github.com/MoltenSt4r/ExteraMS/releases/download/v12.10.3/ExteraMS-v12.10.3-4c39727.1261.apk"
            className="btn btn--filled btn--large btn--icon-left hero-btn-download"
            onClick={handleDownloadExtera}
          >
            <span className="material-symbols-rounded">download</span>
            <span>Скачать ExteraMS APK</span>
          </a>

          <button
            className="btn btn--tonal btn--large btn--icon-left"
            onClick={onOpenFdroid}
          >
            <span className="material-symbols-rounded">storefront</span>
            <span>F-Droid Репозиторий</span>
          </button>
        </div>

        {/* Quick Highlights Bar */}
        <div className="hero-specs-bar">
          <div className="spec-item">
            <span className="spec-val">100% Free</span>
            <span className="spec-lbl">Без подписок</span>
          </div>
          <div className="spec-divider" />
          <div className="spec-item">
            <span className="spec-val">Monet MD3</span>
            <span className="spec-lbl">Адаптивные цвета</span>
          </div>
          <div className="spec-divider" />
          <div className="spec-item">
            <span className="spec-val">No Google Lock</span>
            <span className="spec-lbl">Чистая подпись v1+v2+v3</span>
          </div>
          <div className="spec-divider" />
          <div className="spec-item">
            <span className="spec-val">Plasma 6</span>
            <span className="spec-lbl">Полная экосистема</span>
          </div>
        </div>
      </div>
    </section>
  );
}
