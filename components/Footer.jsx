'use client';

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="footer-block">
      <div className="footer-inner">
        <div className="footer-main">
          <div className="footer-brand">
            <div className="footer-logo-row">
              <img src="/logo.svg" alt="MoltenStar" className="footer-logo" />
              <span className="footer-title">MoltenStar</span>
            </div>
            <p className="footer-desc">
              Открытые решения с бескомпромиссным вниманием к дизайну интерфейса и свободе пользователя.
            </p>
          </div>

          <div className="footer-nav-col">
            <h4 className="footer-nav-title">Проекты</h4>
            <a href="#exterams" className="footer-link">ExteraMS (Android)</a>
            <a href="#kdems" className="footer-link">kdeMS (KDE Plasma 6)</a>
            <a href="#themes" className="footer-link">Темы и ресурсы</a>
          </div>

          <div className="footer-nav-col">
            <h4 className="footer-nav-title">Сообщество</h4>
            <a
              href="https://t.me/ExteraMS"
              target="_blank"
              rel="noopener noreferrer"
              className="footer-link footer-link--highlight"
            >
              <span className="material-symbols-rounded">near_me</span>
              <span>Канал @ExteraMS</span>
            </a>
            <a
              href="https://github.com/MoltenSt4r/ExteraMS"
              target="_blank"
              rel="noopener noreferrer"
              className="footer-link"
            >
              <span>GitHub ExteraMS</span>
            </a>
            <a
              href="https://github.com/MoltenSt4r"
              target="_blank"
              rel="noopener noreferrer"
              className="footer-link"
            >
              <span>GitHub MoltenSt4r</span>
            </a>
          </div>
        </div>

        <div className="footer-bottom">
          <p className="footer-copy">
            © 2026 <b>MoltenStar</b>. Все проекты распространяются под свободными лицензиями.
          </p>

          <button className="footer-back-to-top" onClick={scrollToTop}>
            <span>Наверх</span>
            <span className="material-symbols-rounded">arrow_upward</span>
          </button>
        </div>
      </div>
    </footer>
  );
}
