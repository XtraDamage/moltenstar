'use client';
import { useRef, useEffect } from 'react';

export default function Sidebar({ isOpen, onClose, chats, activeChatId, onNewChat, onSelectChat, onDeleteChat }) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    }
    return date.toLocaleDateString();
  };

  const sortedChats = [...chats].sort((a, b) => b.createdAt - a.createdAt);

  return (
    <>
      <div className={`sidebar-scrim ${isOpen ? 'sidebar-scrim--visible' : ''}`} onClick={onClose} />
      <nav className={`sidebar-drawer ${isOpen ? 'sidebar-drawer--open' : ''}`}>
        <div className="sidebar-header">
          <span className="sidebar-header__title">Chats</span>
          <button className="icon-button sidebar-header__close" onClick={onClose}>
            <span className="material-symbols-rounded">close</span>
          </button>
        </div>
        <button className="sidebar-new-chat" onClick={() => { onNewChat(); onClose(); }}>
          <span className="material-symbols-rounded">add</span>
          New chat
        </button>
        <div className="sidebar-chat-list">
          {sortedChats.map(chat => (
            <div key={chat.id} className={`sidebar-chat-item ${chat.id === activeChatId ? 'sidebar-chat-item--active' : ''}`} onClick={() => { onSelectChat(chat.id); onClose(); }}>
              <span className="material-symbols-rounded sidebar-chat-item__icon">chat</span>
              <div className="sidebar-chat-item__info">
                <div className="sidebar-chat-item__title">{chat.title}</div>
                <div className="sidebar-chat-item__date">{formatDate(chat.createdAt)}</div>
              </div>
              <button className="icon-button sidebar-chat-item__delete" onClick={(e) => { e.stopPropagation(); onDeleteChat(chat.id); }} aria-label="Delete">
                <span className="material-symbols-rounded" style={{fontSize: 20}}>delete</span>
              </button>
            </div>
          ))}
        </div>
      </nav>
    </>
  );
}
