'use client';

import { useState, useEffect, useRef } from 'react';
import QRCode from 'qrcode';

export default function FdroidModal({ isOpen, onClose, onShowToast }) {
  const [qrDataUrl, setQrDataUrl] = useState('');
  const repoUrl = 'https://moltenst4r.github.io/ExteraMS/fdroid/repo';
  const fingerprint = '4B4EFFEE9D4CCBCB75DC3BF2E2A21655F2F35747B2D95FCF836E186FCE9D5030';
  const deepLink = `fdroidrepos://moltenst4r.github.io/ExteraMS/fdroid/repo?fingerprint=${fingerprint}`;

  useEffect(() => {
    if (isOpen) {
      QRCode.toDataURL(deepLink, {
        width: 240,
        margin: 1,
        color: {
          dark: '#000000',
          light: '#FFFFFF',
        },
      })
        .then((url) => setQrDataUrl(url))
        .catch((err) => console.error(err));
    }
  }, [isOpen, deepLink]);

  if (!isOpen) return null;

  const copyText = (text, label) => {
    navigator.clipboard.writeText(text);
    onShowToast(`${label} скопирован в буфер!`);
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-surface fdroid-modal-surface" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title-group">
            <span className="material-symbols-rounded modal-title-icon">storefront</span>
            <h2 className="modal-title">Репозиторий F-Droid</h2>
          </div>
          <button className="icon-btn" onClick={onClose} aria-label="Закрыть">
            <span className="material-symbols-rounded">close</span>
          </button>
        </div>

        <div className="modal-body fdroid-modal-body">
          <p className="modal-intro">
            Подключите официальный F-Droid репозиторий ExteraMS для получения автоматических обновлений в клиентах F-Droid, Droid-ify или Neo Store.
          </p>

          <div className="fdroid-center-box">
            {qrDataUrl ? (
              <div className="qr-card">
                <img src={qrDataUrl} alt="QR Code" className="qr-img" />
                <span className="qr-hint">Наведите камеру смартфона для быстрого добавления</span>
              </div>
            ) : (
              <div className="qr-skeleton" />
            )}

            <a href={deepLink} className="btn btn--filled btn--icon-left btn--full">
              <span className="material-symbols-rounded">open_in_new</span>
              <span>Добавить в 1 клик на телефоне</span>
            </a>
          </div>

          <div className="fdroid-info-section">
            <div className="info-block">
              <label className="info-label">Адрес репозитория (Repository URL):</label>
              <div className="copy-field">
                <input type="text" readOnly value={repoUrl} className="copy-input" />
                <button
                  className="icon-btn"
                  onClick={() => copyText(repoUrl, 'Адрес')}
                  title="Скопировать"
                >
                  <span className="material-symbols-rounded">content_copy</span>
                </button>
              </div>
            </div>

            <div className="info-block">
              <label className="info-label">Отпечаток ключа (SHA-256 Fingerprint):</label>
              <div className="copy-field">
                <input type="text" readOnly value={fingerprint} className="copy-input font-mono" />
                <button
                  className="icon-btn"
                  onClick={() => copyText(fingerprint, 'Отпечаток')}
                  title="Скопировать"
                >
                  <span className="material-symbols-rounded">content_copy</span>
                </button>
              </div>
            </div>

            <div className="fdroid-steps">
              <span className="steps-title">Инструкция для ручного добавления:</span>
              <ol className="steps-list">
                <li>Откройте клиент (F-Droid, Droid-ify или Neo Store).</li>
                <li>Перейдите в <b>«Настройки» → «Репозитории»</b> и нажмите <b>«+»</b>.</li>
                <li>Вставьте скопированный адрес репозитория и сохраните.</li>
              </ol>
            </div>
          </div>
        </div>

        <div className="modal-actions">
          <button className="btn btn--tonal" onClick={onClose}>
            Закрыть
          </button>
        </div>
      </div>
    </div>
  );
}
