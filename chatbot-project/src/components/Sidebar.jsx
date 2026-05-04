import { useState } from 'react';
import { useChatContext } from '../context/ChatContext';
import { ModelSelector } from './ModelSelector';
import {
  Plus, X, MessageSquare, Pencil, Trash2, Settings, Coffee
} from 'lucide-react';

export function Sidebar() {
  const {
    chats, activeChatId, setActiveChatId, setMessages,
    createNewChat, deleteChat, renameChat,
    sidebarOpen, setSidebarOpen, setSettingsOpen
  } = useChatContext();
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState('');

  const handleSelectChat = (chat) => {
    setActiveChatId(chat.id);
    setMessages(chat.messages);
  };

  const handleStartRename = (chat, e) => {
    e.stopPropagation();
    setEditingId(chat.id);
    setEditTitle(chat.title);
  };

  const handleFinishRename = (chatId) => {
    if (editTitle.trim()) renameChat(chatId, editTitle.trim());
    setEditingId(null);
  };

  const handleDelete = (chatId, e) => {
    e.stopPropagation();
    deleteChat(chatId);
  };

  const formatDate = (ts) => {
    const diff = Date.now() - ts;
    if (diff < 86400000) return 'Today';
    if (diff < 172800000) return 'Yesterday';
    return new Date(ts).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const grouped = {};
  chats.forEach(chat => {
    const label = formatDate(chat.createdAt);
    if (!grouped[label]) grouped[label] = [];
    grouped[label].push(chat);
  });

  return (
    <>
      <div className={`sidebar ${sidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`} id="sidebar">
        <div className="sidebar-header">
          <h1 className="sidebar-logo">
            <Coffee size={22} className="logo-icon" />
            <span className="logo-text">AROMA Console</span>
          </h1>
          <button className="sidebar-toggle-inner" onClick={() => setSidebarOpen(false)} title="Close sidebar">
            <X size={18} />
          </button>
        </div>

        <button className="new-chat-btn" onClick={createNewChat} id="new-chat-btn">
          <Plus size={18} />
          <span>New Chat</span>
        </button>

        <div className="sidebar-chats">
          {Object.entries(grouped).map(([dateLabel, dateChats]) => (
            <div key={dateLabel} className="chat-group">
              <div className="chat-group-label">{dateLabel}</div>
              {dateChats.map(chat => (
                <div key={chat.id} className={`chat-item ${chat.id === activeChatId ? 'chat-item-active' : ''}`} onClick={() => handleSelectChat(chat)}>
                  {editingId === chat.id ? (
                    <input
                      className="chat-rename-input"
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      onBlur={() => handleFinishRename(chat.id)}
                      onKeyDown={(e) => { if (e.key === 'Enter') handleFinishRename(chat.id); if (e.key === 'Escape') setEditingId(null); }}
                      autoFocus
                      onClick={(e) => e.stopPropagation()}
                    />
                  ) : (
                    <>
                      <MessageSquare size={15} className="chat-item-icon" />
                      <span className="chat-item-title">{chat.title}</span>
                      <div className="chat-item-actions">
                        <button className="chat-action-btn" onClick={(e) => handleStartRename(chat, e)} title="Rename">
                          <Pencil size={13} />
                        </button>
                        <button className="chat-action-btn chat-action-delete" onClick={(e) => handleDelete(chat.id, e)} title="Delete">
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>

        <ModelSelector />

        <div className="sidebar-footer">
          <button className="sidebar-footer-btn" onClick={() => setSettingsOpen(true)} id="open-settings-btn">
            <Settings size={16} />
            <span>Settings</span>
          </button>
        </div>
      </div>


    </>
  );
}
