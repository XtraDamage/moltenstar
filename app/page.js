'use client';
import { useState, useEffect, useRef, useCallback } from 'react';
import TopBar from '../components/TopBar';
import Sidebar from '../components/Sidebar';
import ChatArea from '../components/ChatArea';
import InputBar from '../components/InputBar';
import SettingsDialog from '../components/SettingsDialog';
import { getAllChats, saveChat, deleteChat as deleteStoredChat, getSettings, saveSettings } from '../lib/storage';
import { applyColorScheme, getSystemThemePreference } from '../lib/monet';
import { DEFAULT_AGENTS, GENERIC_AGENT, buildMessagesForAgent } from '../lib/agents';

export default function Page() {
  const [chats, setChats] = useState([]);
  const [activeChatId, setActiveChatId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [settings, setSettings] = useState({ 
    theme: 'auto', 
    colorScheme: 'molten', 
    multiAgentEnabled: true, 
    agents: DEFAULT_AGENTS 
  });
  const [typingAgents, setTypingAgents] = useState([]);
  const [round, setRound] = useState(0);
  const [roundComplete, setRoundComplete] = useState(false);
  const [replyTarget, setReplyTarget] = useState(null);

  const messagesEndRef = useRef(null);
  const abortControllersRef = useRef({});
  const isRoundStopped = useRef(false);

  useEffect(() => {
    const loadedChats = getAllChats();
    setChats(loadedChats);
    if (loadedChats.length > 0) {
      setActiveChatId(loadedChats[0].id);
    }
    const loadedSettings = getSettings();
    setSettings(loadedSettings);
  }, []);

  useEffect(() => {
    saveSettings(settings);
    const mode = settings.theme === 'auto' ? getSystemThemePreference() : settings.theme;
    applyColorScheme(settings.colorScheme, mode);
  }, [settings]);

  useEffect(() => {
    if (settings.theme === 'auto') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleChange = () => {
        applyColorScheme(settings.colorScheme, getSystemThemePreference());
      };
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
  }, [settings.theme, settings.colorScheme]);

  const activeChat = chats.find(c => c.id === activeChatId) || null;
  const messages = activeChat?.messages || [];

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isLoading, typingAgents]);

  const createNewChat = () => {
    const id = crypto.randomUUID();
    const newChat = { id, title: 'New Chat', createdAt: Date.now(), messages: [] };
    setChats(prev => {
      const updated = [newChat, ...prev];
      saveChat(newChat);
      return updated;
    });
    setActiveChatId(id);
    setRound(0);
    setRoundComplete(false);
    setReplyTarget(null);
  };

  const selectChat = (id) => {
    setActiveChatId(id);
    setRound(0);
    setRoundComplete(false);
    setReplyTarget(null);
  };

  const deleteChatHandler = (id) => {
    setChats(prev => {
      const updated = prev.filter(c => c.id !== id);
      deleteStoredChat(id);
      if (activeChatId === id) {
        setActiveChatId(updated.length > 0 ? updated[0].id : null);
      }
      return updated;
    });
  };

  const abortAllStreams = useCallback(() => {
    Object.values(abortControllersRef.current).forEach(ctrl => ctrl.abort());
    abortControllersRef.current = {};
  }, []);

  const streamAgentResponse = useCallback(async (chatId, agentId, messagesForApi, assistantMessageId) => {
    const controller = new AbortController();
    abortControllersRef.current[agentId] = controller;
    let fullResponse = '';

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: messagesForApi, agentId }),
        signal: controller.signal
      });

      if (!response.ok) throw new Error('Network response was not ok');

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';
      let done = false;

      while (!done) {
        if (isRoundStopped.current) {
          controller.abort();
          break;
        }

        const { value, done: readerDone } = await reader.read();
        done = readerDone;
        if (value) {
          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split('\n');
          buffer = lines.pop() || '';

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const data = line.slice(6);
              if (data === '[DONE]') {
                done = true;
                break;
              }
              try {
                const parsed = JSON.parse(data);
                const deltaContent = parsed.choices[0]?.delta?.content || '';
                if (deltaContent) {
                  fullResponse += deltaContent;
                  setChats(prev => {
                    return prev.map(chat => {
                      if (chat.id === chatId) {
                        return {
                          ...chat,
                          messages: chat.messages.map(msg => {
                            if (msg.id === assistantMessageId) {
                              return { ...msg, content: msg.content + deltaContent };
                            }
                            return msg;
                          })
                        };
                      }
                      return chat;
                    });
                  });
                }
              } catch (e) {}
            }
          }
        }
      }
    } catch (error) {
      if (error.name !== 'AbortError') {
        setChats(prev => {
          return prev.map(chat => {
            if (chat.id === chatId) {
              return {
                ...chat,
                messages: chat.messages.map(msg => {
                  if (msg.id === assistantMessageId) {
                    return { ...msg, content: msg.content || 'Sorry, an error occurred.' };
                  }
                  return msg;
                })
              };
            }
            return chat;
          });
        });
      }
    } finally {
      delete abortControllersRef.current[agentId];
    }
    
    return fullResponse;
  }, []);

  const sendToAgents = useCallback(async (targetAgents, currentChatId, initialMessages, replyToMessageId = null) => {
    setIsLoading(true);
    setRoundComplete(false);
    isRoundStopped.current = false;

    const availableAgents = settings.agents.length > 0 ? settings.agents : DEFAULT_AGENTS;
    let localMessages = [...initialMessages];

    for (const agent of targetAgents) {
      if (isRoundStopped.current) break;

      const messageId = crypto.randomUUID();
      setTypingAgents([messageId]);

      const newMessage = {
        id: messageId,
        role: 'assistant',
        agentId: agent.id,
        content: '',
        timestamp: Date.now(),
        replyToMessageId: replyToMessageId,
      };
      
      localMessages.push(newMessage);

      // Update local state to inject empty message for the agent
      setChats(prev => {
        return prev.map(chat => {
          if (chat.id === currentChatId) {
            return { ...chat, messages: [...chat.messages, newMessage] };
          }
          return chat;
        });
      });

      // Small delay to ensure state update and UX pacing
      await new Promise(r => setTimeout(r, 300));

      const contextMessages = localMessages.filter(m => m.id !== messageId);
      const messagesForApi = buildMessagesForAgent(agent, availableAgents, contextMessages);
      
      const fullResponse = await streamAgentResponse(currentChatId, agent.id, messagesForApi, messageId);
      
      // Update our local array with the generated response so the next agent sees it
      newMessage.content = fullResponse;

      if (isRoundStopped.current) break;
    }

    setChats(prev => {
      const updatedChat = prev.find(c => c.id === currentChatId);
      if (updatedChat) saveChat(updatedChat);
      return prev;
    });

    if (!isRoundStopped.current && targetAgents.length > 1) {
      setRound(prev => prev + 1);
      setRoundComplete(true);
    }
    
    setIsLoading(false);
    setTypingAgents([]);
  }, [settings.agents, streamAgentResponse]);

  const handleSendMessage = async (text) => {
    let currentChatId = activeChatId;

    if (!currentChatId) {
      currentChatId = crypto.randomUUID();
      const newChat = { id: currentChatId, title: 'New Chat', createdAt: Date.now(), messages: [] };
      setChats(prev => {
        const updated = [newChat, ...prev];
        saveChat(newChat);
        return updated;
      });
      setActiveChatId(currentChatId);
    }

    const userMessageId = crypto.randomUUID();
    const userMessage = {
      id: userMessageId,
      role: 'user',
      content: text,
      timestamp: Date.now(),
      replyToAgentId: replyTarget?.agent?.id || null,
      replyToMessageId: replyTarget?.messageId || null,
    };

    let updatedMessages = [];
    setChats(prev => {
      return prev.map(chat => {
        if (chat.id === currentChatId) {
          const isFirstMessage = chat.messages.length === 0;
          updatedMessages = [...chat.messages, userMessage];
          const updatedChat = {
            ...chat,
            title: isFirstMessage ? text.substring(0, 50) : chat.title,
            messages: updatedMessages
          };
          saveChat(updatedChat);
          return updatedChat;
        }
        return chat;
      });
    });

    setReplyTarget(null);

    const availableAgents = settings.agents.length > 0 ? settings.agents : DEFAULT_AGENTS;
    
    let targetAgents = [];
    if (!settings.multiAgentEnabled) {
      targetAgents = [GENERIC_AGENT];
    } else if (replyTarget?.agent) {
      targetAgents = [replyTarget.agent];
    } else {
      targetAgents = availableAgents;
    }

    await sendToAgents(targetAgents, currentChatId, updatedMessages, replyTarget?.messageId || null);
  };

  const handleContinueRound = async () => {
    if (!activeChatId || isLoading) return;

    const continueMessage = {
      id: crypto.randomUUID(),
      content: '[Continue the discussion. Build on what others said. If you have new insights, share them. If you agree with the consensus, briefly confirm and add any final thoughts.]',
      role: 'user',
      isSystemRound: true,
      isHidden: true,
      timestamp: Date.now(),
    };

    let updatedMessages = [];
    setChats(prev => {
      return prev.map(chat => {
        if (chat.id === activeChatId) {
          updatedMessages = [...chat.messages, continueMessage];
          const updatedChat = { ...chat, messages: updatedMessages };
          saveChat(updatedChat);
          return updatedChat;
        }
        return chat;
      });
    });

    const availableAgents = settings.agents.length > 0 ? settings.agents : DEFAULT_AGENTS;
    const targetAgents = settings.multiAgentEnabled ? availableAgents : [GENERIC_AGENT];

    await sendToAgents(targetAgents, activeChatId, updatedMessages);
  };

  const handleStopRound = () => {
    isRoundStopped.current = true;
    abortAllStreams();
    setIsLoading(false);
    setRoundComplete(false);
    setTypingAgents([]);
  };

  const handleSwipeReply = (message) => {
    const availableAgents = settings.agents.length > 0 ? settings.agents : DEFAULT_AGENTS;
    const agent = message.agentId ? availableAgents.find(a => a.id === message.agentId) : null;
    setReplyTarget({
      messageId: message.id,
      content: message.content,
      agent,
    });
  };

  const handleCancelReply = () => {
    setReplyTarget(null);
  };

  return (
    <div className="app">
      <TopBar onMenuClick={() => setSidebarOpen(true)} onSettingsClick={() => setSettingsOpen(true)} />
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        chats={chats}
        activeChatId={activeChatId}
        onNewChat={createNewChat}
        onSelectChat={selectChat}
        onDeleteChat={deleteChatHandler}
      />
      <div className="app__body">
        <div className="app__main">
          <ChatArea
            messages={messages}
            isLoading={isLoading}
            messagesEndRef={messagesEndRef}
            typingAgents={typingAgents}
            round={round}
            roundComplete={roundComplete}
            onContinueRound={handleContinueRound}
            onStopRound={handleStopRound}
            onSwipeReply={handleSwipeReply}
            agents={settings.agents}
          />
          <InputBar
            onSend={handleSendMessage}
            isLoading={isLoading}
            replyTarget={replyTarget}
            onCancelReply={handleCancelReply}
          />
        </div>
      </div>
      <SettingsDialog
        isOpen={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        theme={settings.theme}
        colorScheme={settings.colorScheme}
        multiAgentEnabled={settings.multiAgentEnabled}
        agents={settings.agents}
        onThemeChange={(t) => setSettings(prev => ({ ...prev, theme: t }))}
        onColorSchemeChange={(s) => setSettings(prev => ({ ...prev, colorScheme: s }))}
        onMultiAgentChange={(m) => setSettings(prev => ({ ...prev, multiAgentEnabled: m }))}
        onAgentsChange={(a) => setSettings(prev => ({ ...prev, agents: a }))}
      />
    </div>
  );
}
