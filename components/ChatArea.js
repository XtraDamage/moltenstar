'use client';
import { useState, useEffect, useRef } from 'react';
import MessageBubble from './MessageBubble';
import RoundControls from './RoundControls';
import { AGENTS } from '../lib/agents';

export default function ChatArea({
  messages,
  isLoading,
  messagesEndRef,
  typingAgents,
  round,
  roundComplete,
  onContinueRound,
  onStopRound,
  onSwipeReply
}) {
  const [logoVisible, setLogoVisible] = useState(true);
  const [logoExiting, setLogoExiting] = useState(false);
  const hasMessages = messages.length > 0;

  useEffect(() => {
    if (hasMessages && logoVisible) {
      setLogoExiting(true);
      const timer = setTimeout(() => {
        setLogoVisible(false);
        setLogoExiting(false);
      }, 600);
      return () => clearTimeout(timer);
    }
  }, [hasMessages, logoVisible]);

  return (
    <div className="chat-area">
      {!hasMessages && !isLoading && logoVisible ? (
        <div className={`chat-area__welcome ${logoExiting ? 'chat-area__welcome--exiting' : ''}`}>
          <img
            src="/logo.svg"
            alt="MoltenStar"
            className="chat-area__welcome-icon logo-img"
            draggable={false}
          />
        </div>
      ) : (
        <div className="chat-area__messages">
          {messages.map((msg, idx) => {
            if (msg.role === 'assistant' && !msg.content) return null;
            const agent = msg.agentId ? AGENTS[msg.agentId] : null;
            const isAgentTyping = msg.role === 'assistant' && msg.agentId && typingAgents?.includes(msg.agentId);
            const replyToMsg = msg.replyToMessageId
              ? messages.find(m => m.id === msg.replyToMessageId)
              : null;

            return (
              <MessageBubble
                key={msg.id}
                role={msg.role}
                content={msg.content}
                timestamp={msg.timestamp}
                agent={agent}
                isTyping={isAgentTyping}
                replyTo={replyToMsg}
                onSwipeReply={msg.role === 'assistant' && agent ? () => onSwipeReply(msg) : null}
                animationDelay={idx * 30}
              />
            );
          })}
          {isLoading && typingAgents && typingAgents.length > 0 && (
            <>
              {typingAgents.map(agentId => {
                const hasContent = messages.some(m => m.agentId === agentId && m.content);
                if (hasContent) return null;
                const agent = AGENTS[agentId];
                return (
                  <div key={`typing-${agentId}`} className="message message--assistant message--agent-typing">
                    <div className="message__agent-row">
                      <div
                        className="agent-avatar agent-avatar--typing"
                        style={{
                          '--agent-color': agent.color,
                          '--agent-on-color': agent.colorOnContainer,
                          '--agent-container': agent.containerColor,
                          width: 28,
                          height: 28,
                          fontSize: 12,
                        }}
                      >
                        <span className="agent-avatar__letter">{agent.avatarEmoji}</span>
                        <div className="agent-avatar__typing-ring" />
                      </div>
                      <span className="message__agent-name" style={{ color: agent.color }}>{agent.name}</span>
                    </div>
                    <div className="message__bubble message__bubble--assistant">
                      <div className="typing-indicator">
                        <div className="typing-indicator__dot" />
                        <div className="typing-indicator__dot" />
                        <div className="typing-indicator__dot" />
                      </div>
                    </div>
                  </div>
                );
              })}
            </>
          )}
          {roundComplete && round > 0 && (
            <RoundControls
              round={round}
              onContinue={onContinueRound}
              onStop={onStopRound}
              disabled={isLoading}
            />
          )}
          <div ref={messagesEndRef} />
        </div>
      )}
    </div>
  );
}
