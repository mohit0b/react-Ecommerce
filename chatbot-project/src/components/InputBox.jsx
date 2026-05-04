import { useState, useRef, useEffect } from 'react';
import { useChatContext } from '../context/ChatContext';
import { routeRequest } from '../router/index';
import { SendHorizonal, Loader2 } from 'lucide-react';

export function InputBox() {
  const {
    messages, setMessages, model, isStreaming, setIsStreaming,
    chats, activeChatId, renameChat, temperature,
    setLastDebugInfo, setLastTool
  } = useChatContext();
  const [inputText, setInputText] = useState('');
  const textareaRef = useRef(null);

  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = Math.min(textarea.scrollHeight, 160) + 'px';
    }
  }, [inputText]);

  const sendMessage = async () => {
    const trimmed = inputText.trim();
    if (!trimmed || isStreaming) return;

    const userMessage = {
      id: crypto.randomUUID(),
      text: trimmed,
      sender: 'user',
      timestamp: Date.now()
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInputText('');
    setIsStreaming(true);

    const activeChat = chats.find(c => c.id === activeChatId);
    if (activeChat && activeChat.title === 'New Chat' && activeChat.messages.length === 0) {
      const title = trimmed.length > 35 ? trimmed.substring(0, 35) + '...' : trimmed;
      renameChat(activeChatId, title);
    }

    const result = await routeRequest(trimmed, model, temperature, 'You are a helpful AI assistant.');

    const aiMessage = {
      id: crypto.randomUUID(),
      text: result.result,
      sender: 'ai',
      model: result.model || model,
      toolUsed: result.type === 'tool' ? result.toolName : null,
      latency: result.latency,
      isStreaming: true,
      timestamp: result.time || Date.now()
    };

    setMessages([...newMessages, aiMessage]);
    
    // Update Observability Panel
    setLastDebugInfo({
      model: result.model || model,
      type: result.type,
      toolUsed: result.type === 'tool' ? result.toolName : null,
      latency: result.latency,
      status: 'Success'
    });
    
    if (result.type === 'tool') {
      setLastTool(result.toolName);
      setTimeout(() => setLastTool(null), 3000); // Clear after 3s
    }

    setIsStreaming(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="input-box-wrapper">
      <div className="input-box-container">
        <textarea
          ref={textareaRef}
          className="input-box-textarea"
          placeholder={isStreaming ? 'Waiting for response...' : 'Message AROMA...'}
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={isStreaming}
          rows={1}
          id="chat-input"
        />
        <button
          className={`input-box-send ${(!inputText.trim() || isStreaming) ? 'send-disabled' : ''}`}
          onClick={sendMessage}
          disabled={!inputText.trim() || isStreaming}
          id="send-button"
          title="Send message"
        >
          {isStreaming ? (
            <Loader2 size={18} className="send-spinner-icon" />
          ) : (
            <SendHorizonal size={18} />
          )}
        </button>
      </div>
      <p className="input-box-hint">
        AROMA can make mistakes. Check important info.
      </p>
    </div>
  );
}
