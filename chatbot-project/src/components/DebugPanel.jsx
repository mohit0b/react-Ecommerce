import { useChatContext } from '../context/ChatContext';
import { Activity, Terminal } from 'lucide-react';

export function DebugPanel() {
  const { lastDebugInfo } = useChatContext();

  return (
    <div className="debug-sidebar">
      <div className="debug-sidebar-header">
        <Terminal size={18} className="debug-icon" />
        <h3>Observability</h3>
      </div>
      
      <div className="debug-sidebar-content">
        <div className="debug-card">
          <div className="debug-card-title">
            <Activity size={14} /> Request Info
          </div>
          
          {lastDebugInfo ? (
            <div className="debug-grid">
              <div className="debug-row">
                <span className="debug-label">Model</span>
                <span className="debug-value highlight">{lastDebugInfo.model}</span>
              </div>
              <div className="debug-row">
                <span className="debug-label">Type</span>
                <span className="debug-value">{lastDebugInfo.type === 'tool' ? 'Tool' : 'AI Request'}</span>
              </div>
              {lastDebugInfo.toolUsed && (
                <div className="debug-row">
                  <span className="debug-label">Tool Used</span>
                  <span className="debug-value tool-color">{lastDebugInfo.toolUsed}</span>
                </div>
              )}
              <div className="debug-row">
                <span className="debug-label">Latency</span>
                <span className="debug-value">{lastDebugInfo.latency ? `${(lastDebugInfo.latency / 1000).toFixed(2)}s` : 'Instant'}</span>
              </div>
              <div className="debug-row">
                <span className="debug-label">Status</span>
                <span className="debug-value success-color">{lastDebugInfo.status}</span>
              </div>
            </div>
          ) : (
            <div className="debug-empty">
              Waiting for requests...
            </div>
          )}
        </div>

        <div className="debug-info-text">
          <p>AROMA AI Platform Gateway</p>
          <p>Simulating TrueFoundry LLM Routing</p>
        </div>
      </div>
    </div>
  );
}
