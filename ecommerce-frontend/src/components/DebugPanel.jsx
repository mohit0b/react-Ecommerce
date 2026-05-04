import { useState } from 'react';
import { Terminal, Activity, Eye, X, ChevronUp, ChevronDown, Database, Zap } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

export const DebugPanel = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const { state } = useAppContext();

  if (!isOpen && !isMinimized) {
    return (
      <button 
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 left-6 bg-gray-900 text-green-400 font-mono text-xs px-3 py-2 rounded-md shadow-lg z-50 hover:bg-black transition-colors flex items-center gap-2"
      >
        <Terminal className="w-4 h-4" /> Debug
      </button>
    );
  }

  if (isMinimized) {
    return (
      <button 
        onClick={() => { setIsMinimized(false); setIsOpen(true); }}
        className="fixed bottom-0 left-6 bg-gray-900 text-green-400 font-mono text-xs px-4 py-2 rounded-t-md shadow-lg z-50 hover:bg-black transition-colors flex items-center gap-2 border border-gray-800 border-b-0"
      >
        <Activity className="w-3 h-3 text-red-500 animate-pulse" /> System Logs <ChevronUp className="w-3 h-3" />
      </button>
    );
  }

  return (
    <div className="fixed bottom-0 left-6 w-[400px] h-[300px] bg-gray-900 border border-gray-800 rounded-t-lg shadow-2xl z-50 flex flex-col font-mono text-xs text-gray-300">
      <div className="bg-black p-2 border-b border-gray-800 rounded-t-lg flex justify-between items-center shrink-0">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-green-500" />
          <span className="font-bold text-white tracking-wider">NEUROCART OBSERVABILITY</span>
        </div>
        <div className="flex gap-2">
          <button onClick={() => { setIsMinimized(true); setIsOpen(false); }} className="hover:text-white"><ChevronDown className="w-4 h-4" /></button>
          <button onClick={() => { setIsOpen(false); setIsMinimized(false); }} className="hover:text-white"><X className="w-4 h-4" /></button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-4 custom-scrollbar bg-gray-950">
        <div>
          <div className="text-blue-400 font-bold mb-1 flex items-center gap-1"><Zap className="w-3 h-3"/> Active Context</div>
          <div className="pl-4 border-l border-gray-800">
            <div>Cart Items: <span className="text-yellow-400">{state.cart.length}</span></div>
            <div>Search Query: <span className="text-green-400">"{state.searchQuery || 'none'}"</span></div>
            <div>Recently Viewed: <span className="text-purple-400">{state.recentlyViewed.length} items</span></div>
          </div>
        </div>

        <div>
          <div className="text-orange-400 font-bold mb-1 flex items-center gap-1"><Database className="w-3 h-3"/> Recent User Actions</div>
          <div className="pl-4 border-l border-gray-800 space-y-1">
            {state.userActions.slice(-5).map((action, idx) => (
              <div key={idx} className="flex gap-2">
                <span className="text-gray-500">[{new Date(action.time).toLocaleTimeString()}]</span>
                <span className="text-white">{action.type}:</span>
                <span className="text-green-300 truncate">{action.item || action.query}</span>
              </div>
            ))}
            {state.userActions.length === 0 && <div className="text-gray-600 italic">No actions recorded yet.</div>}
          </div>
        </div>
      </div>
    </div>
  );
};
