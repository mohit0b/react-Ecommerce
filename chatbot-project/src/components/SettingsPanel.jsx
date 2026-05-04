import { useChatContext } from '../context/ChatContext';
import {
  X, Thermometer, Hash, MessageSquareText, Wrench,
  Calculator, CalendarDays, CloudSun, Laugh, KeyRound, Trash2
} from 'lucide-react';

export function SettingsPanel() {
  const {
    settingsOpen, setSettingsOpen,
    temperature, setTemperature,
    maxTokens, setMaxTokens,
    systemPrompt, setSystemPrompt
  } = useChatContext();

  if (!settingsOpen) return null;

  return (
    <div className="settings-overlay" onClick={() => setSettingsOpen(false)}>
      <div className="settings-panel" onClick={(e) => e.stopPropagation()} id="settings-panel">
        <div className="settings-header">
          <h2>Settings</h2>
          <button className="settings-close" onClick={() => setSettingsOpen(false)}>
            <X size={18} />
          </button>
        </div>

        <div className="settings-body">
          <div className="settings-group">
            <label className="settings-label">
              <span className="settings-label-text"><Thermometer size={15} /> Temperature</span>
              <span className="settings-value">{temperature}</span>
            </label>
            <p className="settings-desc">Lower = more focused, Higher = more creative</p>
            <input type="range" min="0" max="1" step="0.1" value={temperature}
              onChange={(e) => setTemperature(parseFloat(e.target.value))}
              className="settings-slider" id="temperature-slider" />
            <div className="settings-slider-labels">
              <span>Precise</span><span>Balanced</span><span>Creative</span>
            </div>
          </div>

          <div className="settings-group">
            <label className="settings-label">
              <span className="settings-label-text"><Hash size={15} /> Max Tokens</span>
              <span className="settings-value">{maxTokens}</span>
            </label>
            <p className="settings-desc">Maximum length of the AI response</p>
            <input type="range" min="256" max="4096" step="256" value={maxTokens}
              onChange={(e) => setMaxTokens(parseInt(e.target.value))}
              className="settings-slider" id="max-tokens-slider" />
            <div className="settings-slider-labels">
              <span>256</span><span>2048</span><span>4096</span>
            </div>
          </div>

          <div className="settings-group">
            <label className="settings-label">
              <span className="settings-label-text"><MessageSquareText size={15} /> System Prompt</span>
            </label>
            <p className="settings-desc">Instructions that guide the AI's behavior</p>
            <textarea className="settings-textarea" value={systemPrompt}
              onChange={(e) => setSystemPrompt(e.target.value)} rows={4}
              placeholder="You are a helpful AI assistant..." id="system-prompt" />
          </div>

          <div className="settings-group">
            <label className="settings-label">
              <span className="settings-label-text"><Wrench size={15} /> Tools</span>
            </label>
            <p className="settings-desc">Available built-in tools that activate automatically</p>
            <div className="settings-tools-list">
              <div className="settings-tool-item"><Calculator size={14} /> Calculator — "calculate 25 × 4"</div>
              <div className="settings-tool-item"><CalendarDays size={14} /> Date/Time — "what's the date"</div>
              <div className="settings-tool-item"><CloudSun size={14} /> Weather — "what's the weather"</div>
              <div className="settings-tool-item"><Laugh size={14} /> Jokes — "tell me a joke"</div>
              <div className="settings-tool-item"><KeyRound size={14} /> UUID — "generate a uuid"</div>
            </div>
          </div>

          <div className="settings-group">
            <label className="settings-label">
              <span className="settings-label-text"><Trash2 size={15} /> Data</span>
            </label>
            <button className="settings-danger-btn" id="clear-data-btn"
              onClick={() => {
                if (window.confirm('Clear all chat history? This cannot be undone.')) {
                  localStorage.removeItem('nexus_chats');
                  window.location.reload();
                }
              }}>
              <Trash2 size={14} /> Clear All Chat History
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
