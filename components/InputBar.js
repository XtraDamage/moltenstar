'use client';
import { useState, useRef, useEffect } from 'react';

export default function InputBar({ onSend, isLoading, replyTarget, onCancelReply }) {
  const [text, setText] = useState('');
  const textareaRef = useRef(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      const scrollHeight = textareaRef.current.scrollHeight;
      textareaRef.current.style.height = `${Math.min(scrollHeight, 150)}px`;
    }
  }, [text]);

  useEffect(() => {
    if (replyTarget && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [replyTarget]);

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
      {replyTarget && (
        <div className="input-bar__reply-bar">
          <div className="input-bar__reply-info">
            <div className="input-bar__reply-stripe" style={{ backgroundColor: replyTarget.agent?.color || 'var(--md-sys-color-primary)' }} />
            <div className="input-bar__reply-details">
              <span className="input-bar__reply-name" style={{ color: replyTarget.agent?.color || 'var(--md-sys-color-primary)' }}>
                Replying to {replyTarget.agent?.name || 'message'}
              </span>
              <span className="input-bar__reply-preview">
                {replyTarget.content?.substring(0, 60)}…
              </span>
            </div>
          </div>
          <button className="icon-button input-bar__reply-cancel" onClick={onCancelReply}>
            <span className="material-symbols-rounded">close</span>
          </button>
        </div>
      )}
      <div className="input-bar__row">
        <div className="input-bar__container">
          <textarea
            ref={textareaRef}
            className="input-bar__textarea"
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={replyTarget ? `Reply to ${replyTarget.agent?.name}...` : 'Message MoltenStar...'}
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
    </div>
  );
}
