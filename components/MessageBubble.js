'use client';
import { useMemo } from 'react';
import { isEmojiOnly, splitEmojis, getNotoEmojiUrl } from '../lib/emoji';
import { parseMarkdownTokens, renderInlineMarkdown } from '../lib/markdown';
import CodeBlock from './CodeBlock';

export default function MessageBubble({ role, content, timestamp }) {
  const formattedTime = new Date(timestamp).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
  const emojiOnly = isEmojiOnly(content);

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

  return (
    <div className={`message message--${role}`}>
      <div className={`message__bubble message__bubble--${role}`}>
        {emojiOnly ? emojiDisplay : contentDisplay}
      </div>
      <span className="message__time">{formattedTime}</span>
    </div>
  );
}
