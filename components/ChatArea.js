'use client';
import { useState, useEffect } from 'react';
import MessageBubble from './MessageBubble';

const TIPS = [
  "What are the best practices for React?",
  "Help me debug this error",
  "Write a polite email to my boss",
  "Explain black holes simply",
  "Give me a recipe for pasta"
];

export default function ChatArea({ messages, isLoading, messagesEndRef }) {
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    const shuffled = [...TIPS].sort(() => 0.5 - Math.random());
    setSuggestions(shuffled.slice(0, 3));
  }, []);

  return (
    <div className="chat-area">
      {messages.length === 0 && !isLoading ? (
        <div className="chat-area__welcome animate-fade-in-up">
          <img src="/logo.svg" alt="MoltenStar" className="chat-area__welcome-icon logo-img animate-bounce-in" draggable={false} />
          <h2 className="chat-area__welcome-title">MoltenStar</h2>
          <div className="chat-area__suggestions">
            {suggestions.map((tip, idx) => (
              <div key={idx} className="chat-area__suggestion-chip">"{tip}"</div>
            ))}
          </div>
        </div>
      ) : (
        <div className="chat-area__messages">
          {messages.map(msg => {
            if (msg.role === 'assistant' && !msg.content) return null;
            return <MessageBubble key={msg.id} role={msg.role} content={msg.content} timestamp={msg.timestamp} />;
          })}
          {isLoading && (!messages.length || messages[messages.length - 1].role !== 'assistant' || !messages[messages.length - 1].content) && (
            <div className="message message--assistant">
              <div className="message__bubble message__bubble--assistant">
                <div className="typing-indicator">
                  <div className="typing-indicator__dot" />
                  <div className="typing-indicator__dot" />
                  <div className="typing-indicator__dot" />
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      )}
    </div>
  );
}
