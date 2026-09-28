'use client';

export default function ThemesSection({ onShowToast }) {
  return (
    <section className="section-block themes-section" id="themes">
      <div className="section-header">
        <div className="section-eyebrow">
          <span className="material-symbols-rounded">brush</span>
          <span>Сопутствующие компоненты</span>
        </div>
        <h2 className="section-title">Темы и ресурсы</h2>
        <p className="section-desc">
          Комплекты визуальных материалов, палитр и тем для завершения единого стиля на всех ваших устройствах.
        </p>
      </div>

      <div className="companion-grid">
        <div className="companion-card">
          <div className="companion-icon-wrap">
            <span className="material-symbols-rounded">chat</span>
          </div>
          <div className="companion-body">
            <h3 className="companion-title">Telegram Desktop Material You</h3>
            <p className="companion-desc">
              Официальная тема `.tdesktop-theme` и цветовая палитра `.tdesktop-palette` для настольной версии Telegram.
            </p>
            <div className="companion-links">
              <a
                href="/MaterialYou.tdesktop-theme"
                download="MaterialYou.tdesktop-theme"
                className="btn btn--tonal btn--sm btn--icon-left"
              >
                <span className="material-symbols-rounded">download</span>
                <span>Тема (.theme)</span>
              </a>
              <a
                href="/MaterialYou.tdesktop-palette"
                download="MaterialYou.tdesktop-palette"
                className="btn btn--outlined btn--sm btn--icon-left"
              >
                <span className="material-symbols-rounded">download</span>
                <span>Палитра (.palette)</span>
              </a>
            </div>
          </div>
        </div>

        <div className="companion-card">
          <div className="companion-icon-wrap">
            <span className="material-symbols-rounded">wallpaper</span>
          </div>
          <div className="companion-body">
            <h3 className="companion-title">Коллекция обоев Opaline</h3>
            <p className="companion-desc">
              Абстрактные плавные обои высокого разрешения в пяти основных оттенках: Yellow, Purple, Orange, Green и Blue. Включены в архив kdeMS.
            </p>
            <div className="companion-links">
              <a
                href="/kdeMS.tar.gz"
                download="kdeMS.tar.gz"
                className="btn btn--tonal btn--sm btn--icon-left"
              >
                <span className="material-symbols-rounded">folder_zip</span>
                <span>В комплекте kdeMS</span>
              </a>
            </div>
          </div>
        </div>

        <div className="companion-card">
          <div className="companion-icon-wrap">
            <span className="material-symbols-rounded">volume_up</span>
          </div>
          <div className="companion-body">
            <h3 className="companion-title">Google Pixel Sound Pack</h3>
            <p className="companion-desc">
              Полный комплект оригинальных системных стерео-звуков Google Pixel для звонков, сообщений, будильников и подключения периферии.
            </p>
            <div className="companion-links">
              <a
                href="/kdeMS.tar.gz"
                download="kdeMS.tar.gz"
                className="btn btn--tonal btn--sm btn--icon-left"
              >
                <span className="material-symbols-rounded">audiotrack</span>
                <span>В комплекте kdeMS</span>
              </a>
            </div>
          </div>
        </div>

        <div className="companion-card">
          <div className="companion-icon-wrap">
            <span className="material-symbols-rounded">javascript</span>
          </div>
          <div className="companion-body">
            <h3 className="companion-title">Electron Monet Theme Engine</h3>
            <p className="companion-desc">
              Модуль `md3Theme.js` для динамической генерации CSS переменных палитр Material You в веб- и Electron-приложениях.
            </p>
            <div className="companion-links">
              <a
                href="https://github.com/MoltenSt4r/ExteraMS"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn--outlined btn--sm btn--icon-left"
              >
                <span className="material-symbols-rounded">code</span>
                <span>GitHub</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
