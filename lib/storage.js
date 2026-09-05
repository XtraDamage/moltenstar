import { getPB, isAuthenticated, getUser } from './pb';

export function getSettings() {
  if (typeof window === 'undefined') return { theme: 'auto', colorScheme: 'baseline', pbUrl: '' };
  try {
    const stored = localStorage.getItem('moltenstar_settings');
    return stored ? JSON.parse(stored) : { theme: 'auto', colorScheme: 'baseline', pbUrl: '' };
  } catch {
    return { theme: 'auto', colorScheme: 'baseline', pbUrl: '' };
  }
}

export function saveSettings(settings) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem('moltenstar_settings', JSON.stringify(settings));
  } catch {}
}

export function getAllChatsLocally() {
  if (typeof window === 'undefined') return [];
  try {
    const stored = localStorage.getItem('moltenstar_chats');
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

export async function syncChatsFromCloud() {
  if (isAuthenticated()) {
    try {
      const pb = getPB();
      const records = await pb.collection('chats').getFullList({
        sort: '-updated',
      });
      const cloudChats = records.map(r => ({
        id: r.chat_id,
        title: r.title,
        messages: r.messages
      }));
      if (typeof window !== 'undefined') {
         localStorage.setItem('moltenstar_chats', JSON.stringify(cloudChats));
      }
      return cloudChats;
    } catch (e) {
      console.error(e);
      return getAllChatsLocally();
    }
  }
  return getAllChatsLocally();
}

export async function saveChat(chat) {
  try {
    const chats = getAllChatsLocally();
    const index = chats.findIndex(c => c.id === chat.id);
    if (index >= 0) {
      chats[index] = chat;
    } else {
      chats.push(chat);
    }
    if (typeof window !== 'undefined') {
      localStorage.setItem('moltenstar_chats', JSON.stringify(chats));
    }
  } catch {}

  if (isAuthenticated()) {
    try {
      const pb = getPB();
      const user = getUser();
      
      const records = await pb.collection('chats').getList(1, 1, {
        filter: `chat_id = "${chat.id}"`
      });

      if (records.items.length > 0) {
        await pb.collection('chats').update(records.items[0].id, {
          title: chat.title,
          messages: chat.messages
        });
      } else {
        await pb.collection('chats').create({
          chat_id: chat.id,
          title: chat.title,
          messages: chat.messages,
          user: user.id
        });
      }
    } catch (e) {
      console.error("Cloud save failed", e);
    }
  }
}

export async function deleteChat(id) {
  try {
    const chats = getAllChatsLocally();
    const filtered = chats.filter(c => c.id !== id);
    if (typeof window !== 'undefined') {
      localStorage.setItem('moltenstar_chats', JSON.stringify(filtered));
    }
  } catch {}

  if (isAuthenticated()) {
    try {
      const pb = getPB();
      const records = await pb.collection('chats').getList(1, 1, {
        filter: `chat_id = "${id}"`
      });
      if (records.items.length > 0) {
        await pb.collection('chats').delete(records.items[0].id);
      }
    } catch (e) {
      console.error("Cloud delete failed", e);
    }
  }
}
