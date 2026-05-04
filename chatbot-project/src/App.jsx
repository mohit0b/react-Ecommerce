import { ChatProvider } from './context/ChatContext';
import { Sidebar } from './components/Sidebar';
import { ChatWindow } from './components/ChatWindow';
import { SettingsPanel } from './components/SettingsPanel';
import { DebugPanel } from './components/DebugPanel';

function App() {
  return (
    <ChatProvider>
      <div className="app-layout">
        <Sidebar />
        <ChatWindow />
        <DebugPanel />
        <SettingsPanel />
      </div>
    </ChatProvider>
  );
}

export default App;
