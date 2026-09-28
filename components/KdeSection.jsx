'use client';

import { useState } from 'react';

export default function KdeSection({ onShowToast }) {
  const [activeTab, setActiveTab] = useState('shade');
  const installCmd = 'tar -xzf kdeMS.tar.gz && cd md3-customization && ./install.sh';

  const copyCommand = () => {
    navigator.clipboard.writeText(installCmd);
    onShowToast('Команда установки скопирована!');
  };

  return (
    <section className="section-block kdems-section" id="kdems">
      <div className="section-header">
        <div className="section-eyebrow">
          <span className="material-symbols-rounded">desktop_windows</span>
          <span>Linux Desktop Customization</span>
        </div>
        <h2 className="section-title">kdeMS</h2>
        <p className="section-desc">
          Комплексный автономный набор кастомизации окружения <b>KDE Plasma 6</b> в стиле <b>Material Design 3 (Expressive)</b> и <b>Android 15/16</b>.
        </p>
      </div>

      <div className="kde-grid">
        {/* Screenshot / Visual Showcase */}
        <div className="interactive-card kde-screenshot-card">
          <div className="kde-preview-header">
            <span className="showcase-tag">Реальный скриншот</span>
            <span className="showcase-status">Android 16 Quick Settings</span>
          </div>

          <div className="kde-preview-image-wrap">
            <img
              src="/kde_android_shade.png"
              alt="kdeMS Android Shade Screenshot"
              className="kde-preview-img"
            />
          </div>

          <div className="kde-caption-box">
            <span className="material-symbols-rounded kde-caption-icon">info</span>
            <p className="kde-caption-text">
              Шторка быстрых настроек `org.kde.plasma.androidshade`: плавные регуляторы звука (PipeWire `wpctl`) и яркости, медиаплеер, тайлы Wi-Fi, Bluetooth и кастомных скриптов.
            </p>
          </div>
        </div>

        {/* Feature Grid & Installation */}
        <div className="kde-details-wrap">
          <div className="feature-cards-grid">
            <div className="m3-feature-card">
              <div className="feature-icon-bubble">
                <span className="material-symbols-rounded">notifications_active</span>
              </div>
              <h3 className="feature-title">Android Шторка & Центр</h3>
              <p className="feature-text">
                Полноценная шторка Android 15/16 с управлением мультимедиа, системными слайдерами и вызовом по хоткею.
              </p>
            </div>

            <div className="m3-feature-card">
              <div className="feature-icon-bubble">
                <span className="material-symbols-rounded">lock</span>
              </div>
              <h3 className="feature-title">MD3 Экран блокировки</h3>
              <p className="feature-text">
                Кастомный локскрин на QML с гигантскими адаптивными часами Google Sans Flex и звуками разблокировки Pixel.
              </p>
            </div>

            <div className="m3-feature-card">
              <div className="feature-icon-bubble">
                <span className="material-symbols-rounded">volume_up</span>
              </div>
              <h3 className="feature-title">Звуки Google Pixel</h3>
              <p className="feature-text">
                76 аутентичных звуков системы, уведомлений, сообщений и периферии из смартфонов Google Pixel.
              </p>
            </div>

            <div className="m3-feature-card">
              <div className="feature-icon-bubble">
                <span className="material-symbols-rounded">layers</span>
              </div>
              <h3 className="feature-title">MD3 TaskManager Injector</h3>
              <p className="feature-text">
                Скомпилированный C++ инжектор `libtaskmanager_md3.so` для идеального рендеринга активных задач в Plasma.
              </p>
            </div>

            <div className="m3-feature-card">
              <div className="feature-icon-bubble">
                <span className="material-symbols-rounded">mouse</span>
              </div>
              <h3 className="feature-title">Курсоры & Иконки</h3>
              <p className="feature-text">
                Курсоры Bibata-Material-Salmon, монохромные иконки yet-another-monochrome и заставка EndeavourOS-MaterialYou.
              </p>
            </div>

            <div className="m3-feature-card">
              <div className="feature-icon-bubble">
                <span className="material-symbols-rounded">auto_fix_high</span>
              </div>
              <h3 className="feature-title">Автоустановка в 1 шаг</h3>
              <p className="feature-text">
                Универсальный скрипт `install.sh` автоматически копирует все плазмоиды, темы, конфиги и перезапускает Plasma Shell.
              </p>
            </div>
          </div>

          {/* Quick Install Terminal Box */}
          <div className="terminal-install-card">
            <div className="terminal-header">
              <div className="terminal-dots">
                <span className="dot dot--red" />
                <span className="dot dot--yellow" />
                <span className="dot dot--green" />
              </div>
              <span className="terminal-title">Быстрая установка</span>
            </div>

            <div className="terminal-code-row">
              <code className="terminal-code-text">$ {installCmd}</code>
              <button
                className="icon-btn icon-btn--copy"
                onClick={copyCommand}
                title="Скопировать команду"
              >
                <span className="material-symbols-rounded">content_copy</span>
              </button>
            </div>

            <div className="terminal-actions">
              <a
                href="/kdeMS.tar.gz"
                download="kdeMS.tar.gz"
                className="btn btn--filled btn--icon-left"
              >
                <span className="material-symbols-rounded">download</span>
                <span>Скачать архив kdeMS (26 МБ)</span>
              </a>

              <a
                href="/MaterialYou.tdesktop-theme"
                download="MaterialYou.tdesktop-theme"
                className="btn btn--tonal btn--icon-left"
              >
                <span className="material-symbols-rounded">palette</span>
                <span>Скачать тему Telegram Desktop</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
