'use client';
import { useState, useRef, useEffect } from 'react';

export default function InputBar({ onSend, isLoading }) {
  const [text, setText] = useState('');
  const textareaRef = useRef(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      const scrollHeight = textareaRef.current.scrollHeight;
      textareaRef.current.style.height = `${Math.min(scrollHeight, 150)}px`;
    }
  }, [text]);

  const handleSend = () => {
    const trimmed = text.trim();
    if (trimmed && !isLoading) {
      onSend(trimmed);
      setText('');
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
      if (navigator.vibrate) {
        navigator.vibrate(10);
      }
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="input-bar">
      <div className="input-bar__container">
        <textarea
          ref={textareaRef}
          className="input-bar__textarea"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Message MoltenStar..."
          rows={1}
          disabled={isLoading}
        />
      </div>
      <button
        className={`input-bar__send ${text.trim() ? 'input-bar__send--active' : ''}`}
        onClick={handleSend}
        disabled={isLoading || !text.trim()}
        aria-label="Send"
      >
        <span className="material-symbols-rounded">send</span>
      </button>
    </div>
  );
}
