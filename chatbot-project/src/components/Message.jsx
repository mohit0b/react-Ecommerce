import { useState, useEffect, useRef } from 'react';
import { Bot, User, Copy, Check, Wrench } from 'lucide-react';

export function Message({ message, sender, model, toolUsed, isStreaming, timestamp, latency }) {
  const [displayText, setDisplayText] = useState('');
  const [isComplete, setIsComplete] = useState(!isStreaming);
  const [copied, setCopied] = useState(false);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (isStreaming && sender === 'ai') {
      setDisplayText('');
      setIsComplete(false);
      let i = 0;
      intervalRef.current = setInterval(() => {
        if (i >= message.length) {
          clearInterval(intervalRef.current);
          setDisplayText(message);
          setIsComplete(true);
          return;
        }
        i++;
        setDisplayText(message.substring(0, i));
      }, 12);
      return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
    } else {
      setDisplayText(message);
      setIsComplete(true);
    }
  }, [message, isStreaming, sender]);

  const modelLabels = {
    'gpt-4': 'GPT-4', 'gemini': 'Gemini', 'claude': 'Claude',
    'llama': 'LLaMA 3', 'mistral': 'Mistral'
  };

  const formatTime = (ts) => {
    if (!ts) return '';
    return new Date(ts).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const renderText = (text) => {
    if (!text) return null;
    return text.split('\n').map((line, i) => {
      if (line.startsWith('```')) return null;
      let formatted = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
      formatted = formatted.replace(/`([^`]+)`/g, '<code class="msg-inline-code">$1</code>');
      if (formatted.startsWith('• ') || formatted.startsWith('- ')) {
        formatted = `<span class="msg-bullet">${formatted}</span>`;
      }
      return <span key={i} dangerouslySetInnerHTML={{ __html: formatted }} />;
    }).filter(Boolean).reduce((acc, el, i) => {
      if (i > 0) acc.push(<br key={`br-${i}`} />);
      acc.push(el);
      return acc;
    }, []);
  };

  const isCodeBlock = displayText.includes('```');
  let codeContent = '', preCodeText = '', postCodeText = '';
  if (isCodeBlock) {
    const parts = displayText.split('```');
    preCodeText = parts[0];
    const codeSection = parts[1] || '';
    const codeLines = codeSection.split('\n');
    if (codeLines[0] && /^[a-zA-Z]+$/.test(codeLines[0].trim())) codeLines.shift();
    codeContent = codeLines.join('\n').trim();
    postCodeText = parts.slice(2).join('');
  }

  return (
    <div className={`message ${sender === 'user' ? 'message-user' : 'message-ai'}`}>
      {sender === 'ai' && (
        <div className="message-avatar ai-avatar">
          <Bot size={18} />
        </div>
      )}

      <div className={`message-content ${sender === 'user' ? 'user-content' : 'ai-content'}`}>
        {sender === 'ai' && (
          <div className="message-header">
            <span className="message-model-name">{modelLabels[model] || 'AROMA'}</span>
            {toolUsed && (
              <span className="message-tool-badge">
                <Wrench size={11} /> {toolUsed}
              </span>
            )}
          </div>
        )}

        <div className="message-text">
          {toolUsed && (
            <div className="tool-activated-banner">
              <Wrench size={14} /> Tool Activated: {toolUsed}
            </div>
          )}
          {isCodeBlock ? (
            <>
              {preCodeText && <div className="message-pre-code">{renderText(preCodeText)}</div>}
              <div className="message-code-block">
                <div className="code-block-header">
                  <span className="code-lang">Code</span>
                  <button className="code-copy-btn" onClick={() => handleCopy(codeContent)} title="Copy code">
                    {copied ? <Check size={13} /> : <Copy size={13} />}
                    <span>{copied ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
                <pre><code>{codeContent}</code></pre>
              </div>
              {postCodeText && <div className="message-post-code">{renderText(postCodeText)}</div>}
            </>
          ) : (
            renderText(displayText)
          )}
          {!isComplete && !displayText && (
            <div className="skeleton-loader">
              <div className="skeleton-line"></div>
              <div className="skeleton-line"></div>
              <div className="skeleton-line short"></div>
            </div>
          )}
          {!isComplete && displayText && <span className="streaming-cursor" />}
        </div>

        <div className="message-footer">
          {sender === 'ai' && (
            <span className="message-observability">
              {toolUsed ? (
                <>Tool: {toolUsed} • {latency ? 'Instant' : 'Instant'}</>
              ) : (
                <>{modelLabels[model] || model} • {latency ? `${(latency / 1000).toFixed(2)}s` : '0.8s'} • AI</>
              )}
            </span>
          )}
          <span className="message-time"> • {formatTime(timestamp)}</span>

          {sender === 'ai' && isComplete && (
            <button className="message-copy-btn" onClick={() => handleCopy(message)} title="Copy message">
              {copied ? <Check size={13} /> : <Copy size={13} />}
            </button>
          )}
        </div>
      </div>

      {sender === 'user' && (
        <div className="message-avatar user-avatar">
          <User size={18} />
        </div>
      )}
    </div>
  );
}
