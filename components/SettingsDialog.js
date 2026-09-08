'use client';
import { useState, useEffect } from 'react';
import { MONET_SCHEMES } from '../lib/monet';
import { DEFAULT_AGENTS } from '../lib/agents';

export default function SettingsDialog({
  isOpen,
  onClose,
  theme,
  colorScheme,
  multiAgentEnabled,
  agents,
  onThemeChange,
  onColorSchemeChange,
  onMultiAgentChange,
  onAgentsChange
}) {
  const [activeTab, setActiveTab] = useState('appearance');

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const themeOptions = [
    { value: 'light', icon: 'light_mode', label: 'Light' },
    { value: 'dark', icon: 'dark_mode', label: 'Dark' },
    { value: 'auto', icon: 'auto_mode', label: 'Auto' }
  ];

  const handleAddAgent = () => {
    if (agents.length >= 5) return;
    const newAgent = {
      id: crypto.randomUUID(),
      name: 'New Agent',
      role: 'Assistant',
      color: 'var(--md-sys-color-primary)',
      colorOnContainer: 'var(--md-sys-color-on-primary)',
      containerColor: 'var(--md-sys-color-primary-container)',
      fontVariation: '"wdth" 100, "ROND" 0, "slnt" 0',
      avatarEmoji: '🤖',
      systemPrompt: 'You are a helpful AI assistant.'
    };
    onAgentsChange([...agents, newAgent]);
  };

  const handleUpdateAgent = (id, field, value) => {
    onAgentsChange(agents.map(a => a.id === id ? { ...a, [field]: value } : a));
  };

  const handleRemoveAgent = (id) => {
    onAgentsChange(agents.filter(a => a.id !== id));
  };

  const handleResetAgents = () => {
    onAgentsChange(DEFAULT_AGENTS);
  };

  return (
    <div className={`settings-overlay ${isOpen ? 'settings-overlay--visible' : ''}`}>
      <div className="settings-overlay__scrim" onClick={onClose} />
      <div className={`settings-surface ${isOpen ? 'settings-surface--visible' : ''}`}>
        <div className="settings-header">
          <button className="icon-button settings-header__back" onClick={onClose}>
            <span className="material-symbols-rounded">close</span>
          </button>
          <span className="settings-header__title">Settings</span>
        </div>
        <div className="settings-tabs">
          <button
            className={`settings-tab ${activeTab === 'appearance' ? 'settings-tab--active' : ''}`}
            onClick={() => setActiveTab('appearance')}
          >
            Appearance
          </button>
          <button
            className={`settings-tab ${activeTab === 'agents' ? 'settings-tab--active' : ''}`}
            onClick={() => setActiveTab('agents')}
          >
            Agents
          </button>
        </div>
        <div className="settings-body">
          {activeTab === 'appearance' && (
            <>
              <div className="settings-section">
                <div className="settings-section__title">Theme</div>
                <div className="settings-theme-toggle">
                  {themeOptions.map(opt => (
                    <button
                      key={opt.value}
                      className={`settings-theme-option ${theme === opt.value ? 'settings-theme-option--active' : ''}`}
                      onClick={() => {
                        onThemeChange(opt.value);
                        if (navigator.vibrate) navigator.vibrate(10);
                      }}
                    >
                      <span className="material-symbols-rounded">{opt.icon}</span>
                      <span>{opt.label}</span>
                    </button>
                  ))}
                </div>
              </div>
              <div className="settings-section">
                <div className="settings-section__title">Color</div>
                <div className="settings-color-grid">
                  {Object.entries(MONET_SCHEMES).map(([key, scheme]) => (
                    <button
                      key={key}
                      className={`settings-color-chip ${colorScheme === key ? 'settings-color-chip--active' : ''}`}
                      onClick={() => {
                        onColorSchemeChange(key);
                        if (navigator.vibrate) navigator.vibrate(10);
                      }}
                    >
                      <div className="settings-color-chip__swatch" style={{ backgroundColor: scheme.seed }}>
                        {colorScheme === key && <span className="material-symbols-rounded settings-color-chip__check">check</span>}
                      </div>
                      <span className="settings-color-chip__name">{scheme.displayName}</span>
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}

          {activeTab === 'agents' && (
            <>
              <div className="settings-section">
                <label className="settings-toggle">
                  <div className="settings-toggle__info">
                    <span className="settings-toggle__title">Multi-Agent Mode</span>
                    <span className="settings-toggle__desc">If disabled, only the first agent in the list will respond.</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={multiAgentEnabled}
                    onChange={(e) => onMultiAgentChange(e.target.checked)}
                    className="settings-toggle__input"
                  />
                  <div className="settings-toggle__switch"></div>
                </label>
              </div>

              <div className="settings-section">
                <div className="settings-section__header">
                  <div className="settings-section__title">Custom Agents ({agents.length}/5)</div>
                  <button className="text-button" onClick={handleResetAgents}>Reset to Default</button>
                </div>
                
                <div className="settings-agent-list">
                  {agents.map((agent) => (
                    <div key={agent.id} className="settings-agent-card">
                      <div className="settings-agent-card__header">
                        <div className="settings-agent-card__avatar">{agent.avatarEmoji}</div>
                        <input
                          className="settings-agent-card__name"
                          value={agent.name}
                          onChange={(e) => handleUpdateAgent(agent.id, 'name', e.target.value)}
                          placeholder="Agent Name"
                        />
                        <button className="icon-button settings-agent-card__remove" onClick={() => handleRemoveAgent(agent.id)}>
                          <span className="material-symbols-rounded">delete</span>
                        </button>
                      </div>
                      <input
                        className="settings-agent-card__input"
                        value={agent.role}
                        onChange={(e) => handleUpdateAgent(agent.id, 'role', e.target.value)}
                        placeholder="Role (e.g., Analyst)"
                      />
                      <input
                        className="settings-agent-card__input"
                        value={agent.avatarEmoji}
                        onChange={(e) => handleUpdateAgent(agent.id, 'avatarEmoji', e.target.value)}
                        placeholder="Emoji"
                        maxLength={2}
                      />
                      <textarea
                        className="settings-agent-card__textarea"
                        value={agent.systemPrompt}
                        onChange={(e) => handleUpdateAgent(agent.id, 'systemPrompt', e.target.value)}
                        placeholder="System Prompt"
                        rows={3}
                      />
                    </div>
                  ))}
                  {agents.length === 0 && (
                    <div className="settings-agent-card__empty">No agents configured. A generic assistant will be used.</div>
                  )}
                  {agents.length < 5 && (
                    <button className="settings-agent-card__add" onClick={handleAddAgent}>
                      <span className="material-symbols-rounded">add</span>
                      Add Agent
                    </button>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
