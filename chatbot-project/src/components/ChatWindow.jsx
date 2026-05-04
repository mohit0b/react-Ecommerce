import { useRef, useEffect } from 'react';
import { useChatContext } from '../context/ChatContext';
import { Message } from './Message';
import { InputBox } from './InputBox';
import { Coffee, Code, Calculator, CalendarDays, Laugh, Menu } from 'lucide-react';

export function ChatWindow() {
  const { messages, model, sidebarOpen, setSidebarOpen, isStreaming } = useChatContext();
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const modelNames = {
    'gpt-4': 'GPT-4', 'gemini': 'Gemini', 'claude': 'Claude',
    'llama': 'LLaMA 3', 'mistral': 'Mistral'
  };

  return (
    <div className={`chat-window ${sidebarOpen ? '' : 'chat-window-full'}`}>
      <div className="chat-window-header">
        {!sidebarOpen && (
          <button className="sidebar-toggle-outer" onClick={() => setSidebarOpen(true)} title="Open sidebar" id="sidebar-toggle">
            <Menu size={20} />
          </button>
        )}
        <h2 className="chat-window-title">
          <span className="chat-window-model-dot" />
          {modelNames[model] || 'AI'} • {isStreaming ? 'Thinking...' : 'Ready'} • Tools Enabled
        </h2>
      </div>

      <div className="chat-messages-area">
        {messages.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon-wrap">
              <Coffee size={48} strokeWidth={1.5} />
            </div>
            <h2 className="empty-title">Multi-Model AI Platform</h2>
            <div className="empty-subtitle">
              <p>Route requests across models</p>
              <p>Execute tools automatically</p>
              <p>Monitor responses in real-time</p>
            </div>
            <div className="empty-suggestions">
              <div className="suggestion-card">
                <Code size={18} className="suggestion-icon" />
                <span>Write a function to sort an array</span>
              </div>
              <div className="suggestion-card">
                <Calculator size={18} className="suggestion-icon" />
                <span>Calculate 156 × 42 + 89</span>
              </div>
              <div className="suggestion-card">
                <CalendarDays size={18} className="suggestion-icon" />
                <span>What's today's date?</span>
              </div>
              <div className="suggestion-card">
                <Laugh size={18} className="suggestion-icon" />
                <span>Tell me a joke</span>
              </div>
            </div>
          </div>
        ) : (
          messages.map((msg) => (
            <Message
              key={msg.id}
              message={msg.text}
              sender={msg.sender}
              model={msg.model || model}
              toolUsed={msg.toolUsed}
              isStreaming={msg.isStreaming}
              timestamp={msg.timestamp}
              latency={msg.latency}
            />
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      <InputBox />
    </div>
  );
}
