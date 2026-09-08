'use client';

export default function RoundControls({ round, onContinue, onStop, disabled }) {
  return (
    <div className={`round-controls ${disabled ? 'round-controls--disabled' : ''}`}>
      <div className="round-controls__indicator">
        <span className="round-controls__round-badge">Round {round}</span>
      </div>
      <div className="round-controls__actions">
        <button
          className="round-controls__btn round-controls__btn--continue"
          onClick={onContinue}
          disabled={disabled}
        >
          <span className="material-symbols-rounded">arrow_forward</span>
          Continue Discussion
        </button>
        <button
          className="round-controls__btn round-controls__btn--stop"
          onClick={onStop}
          disabled={disabled}
        >
          <span className="material-symbols-rounded">check</span>
          Finish
        </button>
      </div>
    </div>
  );
}
