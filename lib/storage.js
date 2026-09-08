import { DEFAULT_AGENTS } from './agents';

const defaultSettings = {
  theme: 'auto',
  colorScheme: 'molten',
  multiAgentEnabled: true,
  agents: DEFAULT_AGENTS
};

export function getAllChats() {
  if (typeof window === 'undefined') return [];
  try {
    const stored = localStorage.getItem('moltenstar_chats');
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

export function getChat(id) {
  const chats = getAllChats();
  return chats.find(c => c.id === id);
}

export function saveChat(chat) {
  if (typeof window === 'undefined') return;
  try {
    const chats = getAllChats();
    const index = chats.findIndex(c => c.id === chat.id);
    if (index >= 0) {
      chats[index] = chat;
    } else {
      chats.push(chat);
    }
    localStorage.setItem('moltenstar_chats', JSON.stringify(chats));
  } catch {}
}

export function deleteChat(id) {
  if (typeof window === 'undefined') return;
  try {
    const chats = getAllChats();
    const filtered = chats.filter(c => c.id !== id);
    localStorage.setItem('moltenstar_chats', JSON.stringify(filtered));
  } catch {}
}

export function getSettings() {
  if (typeof window === 'undefined') return { theme: 'auto', colorScheme: 'molten', multiAgentEnabled: true, agents: DEFAULT_AGENTS };
  try {
    const stored = localStorage.getItem('moltenstar_settings');
    const parsed = stored ? JSON.parse(stored) : {};
    return {
      theme: parsed.theme || defaultSettings.theme,
      colorScheme: parsed.colorScheme || defaultSettings.colorScheme,
      multiAgentEnabled: parsed.multiAgentEnabled !== undefined ? parsed.multiAgentEnabled : defaultSettings.multiAgentEnabled,
      agents: parsed.agents || defaultSettings.agents
    };
  } catch {
    return defaultSettings;
  }
}

export function saveSettings(settings) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem('moltenstar_settings', JSON.stringify(settings));
  } catch {}
}
