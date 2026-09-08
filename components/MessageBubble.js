'use client';
import { useMemo, useRef, useState, useCallback } from 'react';
import { isEmojiOnly, splitEmojis, getNotoEmojiUrl } from '../lib/emoji';
import { parseMarkdownTokens, renderInlineMarkdown } from '../lib/markdown';
import CodeBlock from './CodeBlock';
import AgentAvatar from './AgentAvatar';

const SWIPE_THRESHOLD = 60;

export default function MessageBubble({ role, content, timestamp, agent, isTyping, replyTo, onSwipeReply, animationDelay = 0 }) {
  const formattedTime = new Date(timestamp).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
  const emojiOnly = isEmojiOnly(content);

  const bubbleRef = useRef(null);
  const [swipeX, setSwipeX] = useState(0);
  const [isSwiping, setIsSwiping] = useState(false);
  const touchStartRef = useRef({ x: 0, y: 0 });
  const swipeLockedRef = useRef(false);

  const handleTouchStart = useCallback((e) => {
    if (!onSwipeReply) return;
    const touch = e.touches[0];
    touchStartRef.current = { x: touch.clientX, y: touch.clientY };
    swipeLockedRef.current = false;
    setIsSwiping(false);
  }, [onSwipeReply]);

  const handleTouchMove = useCallback((e) => {
    if (!onSwipeReply) return;
    const touch = e.touches[0];
    const deltaX = touch.clientX - touchStartRef.current.x;
    const deltaY = Math.abs(touch.clientY - touchStartRef.current.y);

    if (!swipeLockedRef.current && deltaY > 10 && Math.abs(deltaX) < 10) {
      swipeLockedRef.current = true;
      return;
    }
    if (swipeLockedRef.current) return;

    if (deltaX > 5) {
      setIsSwiping(true);
      const clamped = Math.min(deltaX, 100);
      const eased = clamped * (1 - clamped / 300);
      setSwipeX(eased);
      e.preventDefault();
    }
  }, [onSwipeReply]);

  const handleTouchEnd = useCallback(() => {
    if (!onSwipeReply) return;
    if (swipeX >= SWIPE_THRESHOLD) {
      onSwipeReply();
      if (navigator.vibrate) navigator.vibrate(15);
    }
    setSwipeX(0);
    setIsSwiping(false);
  }, [onSwipeReply, swipeX]);

  // Mouse drag for desktop
  const mouseStartRef = useRef(null);
  const handleMouseDown = useCallback((e) => {
    if (!onSwipeReply) return;
    mouseStartRef.current = { x: e.clientX, y: e.clientY };
  }, [onSwipeReply]);

  const handleMouseMove = useCallback((e) => {
    if (!onSwipeReply || !mouseStartRef.current) return;
    const deltaX = e.clientX - mouseStartRef.current.x;
    if (deltaX > 5) {
      setIsSwiping(true);
      const clamped = Math.min(deltaX, 100);
      const eased = clamped * (1 - clamped / 300);
      setSwipeX(eased);
    }
  }, [onSwipeReply]);

  const handleMouseUp = useCallback(() => {
    if (!onSwipeReply) return;
    if (swipeX >= SWIPE_THRESHOLD) {
      onSwipeReply();
    }
    mouseStartRef.current = null;
    setSwipeX(0);
    setIsSwiping(false);
  }, [onSwipeReply, swipeX]);

  const emojiDisplay = useMemo(() => {
    if (!emojiOnly) return null;
    const emojis = splitEmojis(content);
    return (
      <div className="message__emoji-display">
        {emojis.map((emoji, index) => {
          const url = getNotoEmojiUrl(emoji);
          return (
            <picture key={index} className="emoji-picture">
              <source srcSet={url.webp} type="image/webp" />
              <img
                src={url.gif}
                alt={emoji}
                width={48}
                height={48}
                onError={(e) => {
                  e.target.parentElement.style.display = 'none';
                  const fallback = document.createElement('span');
                  fallback.textContent = emoji;
                  fallback.style.fontSize = '32px';
                  e.target.parentElement.parentElement.appendChild(fallback);
                }}
              />
            </picture>
          );
        })}
      </div>
    );
  }, [content, emojiOnly]);

  const renderToken = (token, index) => {
    switch (token.type) {
      case 'paragraph':
        return <p key={index} dangerouslySetInnerHTML={{ __html: renderInlineMarkdown(token.text) }} />;
      case 'heading': {
        const Tag = `h${token.depth}`;
        return <Tag key={index} dangerouslySetInnerHTML={{ __html: renderInlineMarkdown(token.text) }} />;
      }
      case 'code':
        return <CodeBlock key={index} code={token.text} language={token.lang || ''} />;
      case 'list': {
        const ListTag = token.ordered ? 'ol' : 'ul';
        return (
          <ListTag key={index}>
            {token.items.map((item, i) => (
              <li key={i} dangerouslySetInnerHTML={{ __html: renderInlineMarkdown(item.text) }} />
            ))}
          </ListTag>
        );
      }
      case 'blockquote':
        return (
          <blockquote key={index}>
            {token.tokens && token.tokens.map((t, i) => renderToken(t, i))}
          </blockquote>
        );
      case 'hr':
        return <hr key={index} />;
      case 'space':
        return null;
      case 'table':
        return (
          <table key={index}>
            <thead>
              <tr>
                {token.header.map((cell, i) => (
                  <th key={i} dangerouslySetInnerHTML={{ __html: renderInlineMarkdown(cell.text) }} />
                ))}
              </tr>
            </thead>
            <tbody>
              {token.rows.map((row, i) => (
                <tr key={i}>
                  {row.map((cell, j) => (
                    <td key={j} dangerouslySetInnerHTML={{ __html: renderInlineMarkdown(cell.text) }} />
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        );
      default:
        return <p key={index} dangerouslySetInnerHTML={{ __html: renderInlineMarkdown(token.raw || '') }} />;
    }
  };

  const contentDisplay = useMemo(() => {
    if (emojiOnly) return null;
    if (role === 'assistant') {
      const tokens = parseMarkdownTokens(content);
      return tokens.map((token, index) => renderToken(token, index));
    }
    return <div style={{ whiteSpace: 'pre-wrap' }}>{content}</div>;
  }, [content, emojiOnly, role]);

  const agentFontStyle = agent ? { fontVariationSettings: agent.fontVariation } : {};

  return (
    <div
      className={`message message--${role} ${agent ? `message--agent-${agent.id}` : ''}`}
      style={{ animationDelay: `${animationDelay}ms` }}
    >
      {replyTo && (
        <div className="message__reply-preview">
          <div className="message__reply-bar" style={replyTo.agentId ? { borderColor: (agent || {}).color } : {}} />
          <div className="message__reply-content">
            {replyTo.agentId && <span className="message__reply-name">{replyTo.agentId}</span>}
            <span className="message__reply-text">{replyTo.content?.substring(0, 80)}…</span>
          </div>
        </div>
      )}
      {role === 'assistant' && agent && (
        <div className="message__agent-row">
          <AgentAvatar agent={agent} isTyping={isTyping} size={28} />
          <span className="message__agent-name" style={{ color: agent.color }}>{agent.name}</span>
          <span className="message__agent-role">{agent.role}</span>
        </div>
      )}
      <div
        ref={bubbleRef}
        className={`message__bubble message__bubble--${role} ${isSwiping ? 'message__bubble--swiping' : ''}`}
        style={{
          transform: swipeX > 0 ? `translateX(${swipeX}px)` : undefined,
          transition: isSwiping ? 'none' : 'transform 300ms cubic-bezier(0.2, 0, 0, 1)',
          ...agentFontStyle,
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        {swipeX > 20 && (
          <div className={`message__swipe-indicator ${swipeX >= SWIPE_THRESHOLD ? 'message__swipe-indicator--active' : ''}`}>
            <span className="material-symbols-rounded">reply</span>
          </div>
        )}
        {agent && <div className="message__agent-stripe" style={{ backgroundColor: agent.color }} />}
        <div className="message__content-wrapper">
          {emojiOnly ? emojiDisplay : contentDisplay}
        </div>
      </div>
      <span className="message__time">{formattedTime}</span>
    </div>
  );
}
