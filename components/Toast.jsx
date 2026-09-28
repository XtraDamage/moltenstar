'use client';

export default function Toast({ message, visible }) {
  if (!visible) return null;

  return (
    <div className="toast-container">
      <div className="toast-card">
        <span className="material-symbols-rounded toast-icon">check_circle</span>
        <span className="toast-message">{message}</span>
      </div>
    </div>
  );
}
