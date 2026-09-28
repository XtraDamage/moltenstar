'use client';

import { useState } from 'react';
import confetti from 'canvas-confetti';

const ICONS = [
  {
    id: 'md3',
    title: 'ExteraMS MD3',
    subtitle: 'По умолчанию • Monet',
    src: '/exterams_md3.png',
    bgClass: 'phone-mockup-bg--md3',
    desc: 'Адаптивный полноформатный Material 3 фон. Эмблема идеально смасштабирована с запасом, исключая срез крыльев круглой маской лаунчера.',
  },
  {
    id: 'molten',
    title: 'MoltenStar',
    subtitle: 'Кремовый • Волна',
    src: '/moltenstar_emblem.png',
    bgClass: 'phone-mockup-bg--molten',
    desc: 'Оригинальный кремовый волнистый фон и вычищенная стекающая звёздная эмблема без чёрных рамок.',
  },
  {
    id: 'dotted',
    title: 'ExteraMS Dotted',
    subtitle: 'Точечный минимализм',
    src: '/exterams_dotted.png',
    bgClass: 'phone-mockup-bg--dotted',
    desc: 'Минималистичный вариант с точечной фактурой самолётика в безопасных границах отображения.',
  },
];

export default function ExteraSection({ onOpenFdroid, onShowToast }) {
  const [selectedIcon, setSelectedIcon] = useState(ICONS[0]);

  const handleDownload = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (rect.left + rect.width / 2) / window.innerWidth;
    const y = (rect.top + rect.height / 2) / window.innerHeight;

    confetti({
      particleCount: 50,
      spread: 60,
      origin: { x, y },
      colors: ['#D32F2F', '#006A6A', '#386A20', '#FCDEAC'],
    });

    onShowToast('Загрузка ExteraMS v12.10.3 началась...');
  };

  return (
    <section className="section-block exterams-section" id="exterams">
      <div className="section-header">
        <div className="section-eyebrow">
          <span className="material-symbols-rounded">rocket_launch</span>
          <span>Флагманский Android Клиент</span>
        </div>
        <h2 className="section-title">ExteraMS</h2>
        <p className="section-desc">
          Экспериментальный форк Telegram на базе <b>exteraless</b> и <b>NagramX</b>, созданный для тех, кто ценит идеальный дизайн Material You, свободу от ограничений и передовые фичи.
        </p>
      </div>

      <div className="extera-interactive-grid">
        {/* Left: Phone / Icon Interactive Mockup */}
        <div className="interactive-card phone-showcase-card">
          <div className="phone-showcase-header">
            <span className="showcase-tag">Интерактивный предпросмотр</span>
            <span className="showcase-status">v12.10.3 • Release</span>
          </div>

          <div className="phone-mockup-wrap">
            <div className={`phone-mockup-inner ${selectedIcon.bgClass}`}>
              <div className="phone-speaker-notch" />
              <div className="phone-icon-center">
                <img
                  src={selectedIcon.src}
                  alt={selectedIcon.title}
                  className="phone-active-icon"
                  key={selectedIcon.id}
                />
                <span className="phone-icon-label">{selectedIcon.title}</span>
              </div>
            </div>
          </div>

          <div className="icon-selector-tabs">
            {ICONS.map((icon) => (
              <button
                key={icon.id}
                className={`icon-tab-btn ${selectedIcon.id === icon.id ? 'icon-tab-btn--active' : ''}`}
                onClick={() => setSelectedIcon(icon)}
              >
                <img src={icon.src} alt={icon.title} className="icon-tab-thumb" />
                <div className="icon-tab-info">
                  <span className="icon-tab-title">{icon.title}</span>
                  <span className="icon-tab-sub">{icon.subtitle}</span>
                </div>
              </button>
            ))}
          </div>

          <p className="icon-detail-note">{selectedIcon.desc}</p>
        </div>

        {/* Right: Key Features & Download Hub */}
        <div className="extera-features-wrap">
          <div className="feature-cards-grid">
            <div className="m3-feature-card">
              <div className="feature-icon-bubble">
                <span className="material-symbols-rounded">palette</span>
              </div>
              <h3 className="feature-title">True Material You</h3>
              <p className="feature-text">
                Адаптивная тема оформления Monet перекрашивает весь клиент под палитру обоев вашего устройства в реальном времени.
              </p>
            </div>

            <div className="m3-feature-card">
              <div className="feature-icon-bubble">
                <span className="material-symbols-rounded">star</span>
              </div>
              <h3 className="feature-title">Премиум-иконки Free</h3>
              <p className="feature-text">
                Иконки рабочего стола Турбо, Премиум и Нокс доступны абсолютно бесплатно без подписки Telegram Premium.
              </p>
            </div>

            <div className="m3-feature-card">
              <div className="feature-icon-bubble">
                <span className="material-symbols-rounded">send</span>
              </div>
              <h3 className="feature-title">Фирменная кнопка отправки</h3>
              <p className="feature-text">
                Векторная иконка отправки ExteraMS с прозрачным четырёхконечным звёздным вырезом вместо обычного самолётика.
              </p>
            </div>

            <div className="m3-feature-card">
              <div className="feature-icon-bubble">
                <span className="material-symbols-rounded">verified_user</span>
              </div>
              <h3 className="feature-title">Официальный API ID Telegram X</h3>
              <p className="feature-text">
                Использует официальный API ID для надёжного входа по номеру телефона без блокировок неофициальных сборок.
              </p>
            </div>

            <div className="m3-feature-card">
              <div className="feature-icon-bubble">
                <span className="material-symbols-rounded">terminal</span>
              </div>
              <h3 className="feature-title">Chaquopy Python Engine</h3>
              <p className="feature-text">
                Полноценная среда исполнения плагинов на Python прямо внутри приложения с изоляцией и правами доступа.
              </p>
            </div>

            <div className="m3-feature-card">
              <div className="feature-icon-bubble">
                <span className="material-symbols-rounded">security</span>
              </div>
              <h3 className="feature-title">Чистая подпись v1+v2+v3</h3>
              <p className="feature-text">
                Сертификат без ошибочного флага CA:TRUE и полная поддержка JAR/APK схем. Никаких ругательств от Google Play Защиты.
              </p>
            </div>
          </div>

          {/* Action Deck Card */}
          <div className="download-deck-card">
            <div className="deck-info">
              <div className="deck-title-group">
                <span className="deck-title">Готов к установке</span>
                <span className="deck-badge">Официальный релиз</span>
              </div>
              <p className="deck-desc">
                Прямая загрузка подписанного APK или подключение через каталог F-Droid.
              </p>
            </div>

            <div className="deck-buttons">
              <a
                href="https://github.com/MoltenSt4r/ExteraMS/releases/download/v12.10.3/ExteraMS-v12.10.3-4c39727.1261.apk"
                className="btn btn--filled btn--icon-left deck-btn-primary"
                onClick={handleDownload}
              >
                <span className="material-symbols-rounded">download</span>
                <span>Скачать APK (v12.10.3)</span>
              </a>

              <button
                className="btn btn--tonal btn--icon-left"
                onClick={onOpenFdroid}
              >
                <span className="material-symbols-rounded">storefront</span>
                <span>Репозиторий F-Droid</span>
              </button>

              <a
                href="https://t.me/ExteraMS"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn--outlined btn--icon-left"
              >
                <span className="material-symbols-rounded">near_me</span>
                <span>Канал @ExteraMS</span>
              </a>

              <a
                href="https://github.com/MoltenSt4r/ExteraMS"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn--outlined btn--icon-left"
              >
                <span className="material-symbols-rounded">code</span>
                <span>Исходный код</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
