import { createContext, useState, useEffect, useContext } from 'react';

const ChatContext = createContext();

export const useChatContext = () => useContext(ChatContext);

export const ChatProvider = ({ children }) => {
  const [messages, setMessages] = useState([]);
  const [model, setModel] = useState('gpt-4');
  const [chats, setChats] = useState(() => {
    const newChat = { id: crypto.randomUUID(), title: 'New Chat', messages: [], createdAt: Date.now() };
    const saved = localStorage.getItem('nexus_chats');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        const filtered = parsed.filter(c => c.messages.length > 0 || c.title !== 'New Chat');
        return [newChat, ...filtered];
      } catch {
        return [newChat];
      }
    }
    return [newChat];
  });
  const [activeChatId, setActiveChatId] = useState(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [lastDebugInfo, setLastDebugInfo] = useState(null);
  const [lastTool, setLastTool] = useState(null);

  // Settings
  const [temperature, setTemperature] = useState(0.7);
  const [maxTokens, setMaxTokens] = useState(2048);
  const [systemPrompt, setSystemPrompt] = useState('You are a helpful AI assistant.');

  // Initialize activeChatId if needed
  useEffect(() => {
    if (!activeChatId && chats.length > 0) {
      setActiveChatId(chats[0].id);
    }
  }, [chats, activeChatId]);

  // Sync messages with active chat
  useEffect(() => {
    const activeChat = chats.find(c => c.id === activeChatId);
    if (activeChat) {
      setMessages(activeChat.messages);
    }
  }, [activeChatId]);

  // Persist chats to localStorage
  useEffect(() => {
    localStorage.setItem('nexus_chats', JSON.stringify(chats));
  }, [chats]);

  // Update chat messages when messages change
  const updateChatMessages = (newMessages) => {
    setMessages(newMessages);
    setChats(prev => prev.map(chat =>
      chat.id === activeChatId
        ? { ...chat, messages: newMessages }
        : chat
    ));
  };

  const createNewChat = () => {
    const newChat = {
      id: crypto.randomUUID(),
      title: 'New Chat',
      messages: [],
      createdAt: Date.now()
    };
    setChats(prev => [newChat, ...prev]);
    setActiveChatId(newChat.id);
    setMessages([]);
  };

  const deleteChat = (chatId) => {
    setChats(prev => {
      const updated = prev.filter(c => c.id !== chatId);
      if (chatId === activeChatId) {
        if (updated.length > 0) {
          setActiveChatId(updated[0].id);
          setMessages(updated[0].messages);
        } else {
          const newChat = {
            id: crypto.randomUUID(),
            title: 'New Chat',
            messages: [],
            createdAt: Date.now()
          };
          setActiveChatId(newChat.id);
          setMessages([]);
          return [newChat];
        }
      }
      return updated;
    });
  };

  const renameChat = (chatId, newTitle) => {
    setChats(prev => prev.map(chat =>
      chat.id === chatId ? { ...chat, title: newTitle } : chat
    ));
  };

  return (
    <ChatContext.Provider value={{
      messages, setMessages: updateChatMessages,
      model, setModel,
      chats, setChats,
      activeChatId, setActiveChatId,
      isStreaming, setIsStreaming,
      sidebarOpen, setSidebarOpen,
      settingsOpen, setSettingsOpen,
      lastDebugInfo, setLastDebugInfo,
      lastTool, setLastTool,
      temperature, setTemperature,
      maxTokens, setMaxTokens,
      systemPrompt, setSystemPrompt,
      createNewChat, deleteChat, renameChat
    }}>
      {children}
    </ChatContext.Provider>
  );
};

