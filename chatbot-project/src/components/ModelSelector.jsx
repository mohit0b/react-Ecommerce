import { useChatContext } from '../context/ChatContext';
import { Brain, Sparkles, Target, Shell, Wind, Check } from 'lucide-react';

const models = [
  { id: 'gpt-4', name: 'GPT-4', Icon: Brain, color: '#10a37f', desc: 'Analytical & detailed' },
  { id: 'gemini', name: 'Gemini', Icon: Sparkles, color: '#4285f4', desc: 'Creative & multimodal' },
  { id: 'claude', name: 'Claude', Icon: Target, color: '#d97706', desc: 'Thoughtful & nuanced' },
  { id: 'llama', name: 'LLaMA 3', Icon: Shell, color: '#7c3aed', desc: 'Open-source & direct' },
  { id: 'mistral', name: 'Mistral', Icon: Wind, color: '#0ea5e9', desc: 'Efficient & precise' },
];

export function ModelSelector() {
  const { model, setModel } = useChatContext();
  const activeModel = models.find(m => m.id === model) || models[0];

  return (
    <div className="model-selector" id="model-selector">
      <div className="model-selector-label">Model</div>
      <div className="model-selector-grid">
        {models.map(m => (
          <button
            key={m.id}
            className={`model-option ${model === m.id ? 'model-active' : ''}`}
            onClick={() => setModel(m.id)}
            style={{ '--model-color': m.color, borderColor: model === m.id ? m.color : 'transparent' }}
            title={m.desc}
          >
            <m.Icon size={14} className="model-icon-svg" />
            <span className="model-name">{m.name}</span>
            {model === m.id && <Check size={12} className="model-check" />}
          </button>
        ))}
      </div>
      <div className="model-active-display">
        <span className="model-active-dot" style={{ background: activeModel.color }} />
        <span>{activeModel.name}</span>
        <span className="model-active-desc">— {activeModel.desc}</span>
      </div>
    </div>
  );
}
