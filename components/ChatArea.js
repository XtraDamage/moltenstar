'use client';
import { useState, useEffect, useRef } from 'react';
import MessageBubble from './MessageBubble';
import RoundControls from './RoundControls';
import { DEFAULT_AGENTS, GENERIC_AGENT } from '../lib/agents';
import AgentAvatar from './AgentAvatar'; // Need this for typing indicator if we use it directly

export default function ChatArea({
  messages,
  isLoading,
  messagesEndRef,
  typingAgents,
  round,
  roundComplete,
  onContinueRound,
  onStopRound,
  onSwipeReply,
  agents
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
    } else if (!hasMessages && !logoVisible) {
      setLogoVisible(true);
      setLogoExiting(false);
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
            if (msg.isHidden) return null;
            if (msg.role === 'assistant' && !msg.content) return null;
            const availableAgents = agents && agents.length > 0 ? agents : DEFAULT_AGENTS;
            const agent = msg.agentId === 'generic' ? GENERIC_AGENT : (msg.agentId ? availableAgents.find(a => a.id === msg.agentId) : null);
            const isAgentTyping = msg.role === 'assistant' && msg.agentId && typingAgents?.includes(msg.id);
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
                onSwipeReply={msg.role === 'assistant' && agent && !agent.isGeneric ? () => onSwipeReply(msg) : null}
                animationDelay={idx * 30}
              />
            );
          })}
          {isLoading && typingAgents && typingAgents.length > 0 && (
            <>
              {typingAgents.map(messageId => {
                const msg = messages.find(m => m.id === messageId);
                if (!msg || msg.content) return null;
                const availableAgents = agents && agents.length > 0 ? agents : DEFAULT_AGENTS;
                const agent = msg.agentId === 'generic' ? GENERIC_AGENT : availableAgents.find(a => a.id === msg.agentId);
                
                return (
                  <div key={`typing-${messageId}`} className="message message--assistant message--agent-typing">
                    {agent && !agent.isGeneric && (
                      <div className="message__agent-row">
                        <AgentAvatar agent={agent} isTyping={true} size={28} />
                        <span className="message__agent-name" style={{ color: agent.color }}>{agent.name}</span>
                        <span className="message__agent-role">{agent.role}</span>
                      </div>
                    )}
                    <div className={`message__bubble message__bubble--assistant ${agent && !agent.isGeneric ? `message--agent-${agent.id}` : ''}`}>
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
