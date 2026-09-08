'use client';

export default function AgentAvatar({ agent, isTyping = false, size = 32 }) {
  return (
    <div
      className={`agent-avatar ${isTyping ? 'agent-avatar--typing' : ''}`}
      style={{
        '--agent-color': agent.color,
        '--agent-on-color': agent.colorOnContainer,
        '--agent-container': agent.containerColor,
        width: size,
        height: size,
        fontSize: size * 0.45,
      }}
      title={`${agent.name} — ${agent.role}`}
    >
      <span className="agent-avatar__letter">{agent.avatarEmoji}</span>
      {isTyping && (
        <div className="agent-avatar__typing-ring" />
      )}
    </div>
  );
}
