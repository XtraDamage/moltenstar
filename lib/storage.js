export function getAllChats() {
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
  try {
    const chats = getAllChats();
    const filtered = chats.filter(c => c.id !== id);
    localStorage.setItem('moltenstar_chats', JSON.stringify(filtered));
  } catch {}
}

export function getSettings() {
  try {
    const stored = localStorage.getItem('moltenstar_settings');
    return stored ? JSON.parse(stored) : { theme: 'auto', colorScheme: 'baseline' };
  } catch {
    return { theme: 'auto', colorScheme: 'baseline' };
  }
}

export function saveSettings(settings) {
  try {
    localStorage.setItem('moltenstar_settings', JSON.stringify(settings));
  } catch {}
}
