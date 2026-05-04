import { useState, useRef, useEffect } from 'react';
import { Bot, X, Send, Sparkles, User, MessageSquare } from 'lucide-react';
import { simulateAIRecommendation } from '../utils/ai';
import { useAppContext } from '../context/AppContext';
import { Link } from 'react-router-dom';

export const AIChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { state } = useAppContext();
  const [messages, setMessages] = useState([
    { 
      role: 'ai', 
      text: state.user ? `Hi ${state.user.name.split(' ')[0]}! I'm your AI shopping assistant. What are you looking for today?` : 'Hi! I am your AI shopping assistant. What are you looking for today?', 
      products: null 
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping, isOpen]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userQuery = input.trim();
    setMessages(prev => [...prev, { role: 'user', text: userQuery }]);
    setInput('');
    setIsTyping(true);

    try {
      const aiResponse = await simulateAIRecommendation(userQuery, { cart: state.cart, recent: state.recentlyViewed });
      setMessages(prev => [...prev, { 
        role: 'ai', 
        text: aiResponse.response,
        products: aiResponse.products 
      }]);
    } catch (e) {
      setMessages(prev => [...prev, { role: 'ai', text: "Sorry, I'm having trouble thinking right now." }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <>
      {/* Floating Action Button */}
      <button 
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-r from-accent to-purple-600 rounded-full flex items-center justify-center text-white shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 z-40 ${isOpen ? 'opacity-0 pointer-events-none scale-0' : 'opacity-100 scale-100'}`}
      >
        <Sparkles className="w-6 h-6 absolute animate-pulse opacity-50 -top-1 -right-1" />
        <Bot className="w-7 h-7" />
      </button>

      {/* Chat Window */}
      <div className={`fixed bottom-6 right-6 w-[380px] h-[550px] bg-white rounded-2xl shadow-2xl border border-gray-100 flex flex-col z-50 transition-all duration-300 origin-bottom-right ${isOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-50 pointer-events-none'}`}>
        {/* Header */}
        <div className="bg-gradient-to-r from-gray-900 to-gray-800 text-white p-4 rounded-t-2xl flex justify-between items-center shrink-0 shadow-md">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 p-2 rounded-full backdrop-blur-sm">
              <Bot className="w-5 h-5 text-blue-200" />
            </div>
            <div>
              <h3 className="font-bold text-sm tracking-wide flex items-center gap-1">NeuroCart <Sparkles className="w-3 h-3 text-yellow-300"/></h3>
              <p className="text-xs text-gray-300">AI Shopping Assistant</p>
            </div>
          </div>
          <button onClick={() => setIsOpen(false)} className="text-gray-300 hover:text-white p-1 hover:bg-white/10 rounded-full transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/50">
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'} animate-in slide-in-from-bottom-2 fade-in duration-300`}>
              <div className={`max-w-[85%] rounded-2xl p-3 shadow-sm ${msg.role === 'user' ? 'bg-primary text-white rounded-br-sm' : 'bg-white border border-gray-100 text-gray-800 rounded-bl-sm'}`}>
                <p className="text-sm leading-relaxed">{msg.text}</p>
              </div>
              
              {/* Product Recommendations */}
              {msg.products && msg.products.length > 0 && (
                <div className="mt-3 w-[90%] space-y-2">
                  {msg.products.map(p => (
                    <Link key={p.id} to={`/product/${p.id}`} onClick={() => setIsOpen(false)} className="flex items-center gap-3 bg-white p-2 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all group">
                      <img src={p.image} className="w-12 h-12 rounded-lg object-cover" alt={p.name}/>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs font-bold text-gray-900 truncate group-hover:text-accent">{p.name}</h4>
                        <p className="text-xs font-medium text-accent">₹{p.price}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
          
          {isTyping && (
            <div className="flex items-center gap-2 max-w-[80%] bg-white border border-gray-100 rounded-2xl rounded-bl-sm p-4 w-fit shadow-sm">
              <div className="flex gap-1">
                <span className="w-2 h-2 bg-accent/60 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                <span className="w-2 h-2 bg-accent/60 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                <span className="w-2 h-2 bg-accent/60 rounded-full animate-bounce"></span>
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Input Area */}
        <div className="p-3 bg-white border-t border-gray-100 rounded-b-2xl shrink-0">
          <div className="relative flex items-center">
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask for recommendations..."
              className="w-full bg-gray-100 border-none text-sm rounded-full py-3 pl-4 pr-12 focus:outline-none focus:ring-2 focus:ring-accent/50 transition-shadow"
            />
            <button 
              onClick={handleSend}
              disabled={!input.trim() || isTyping}
              className="absolute right-1.5 p-2 bg-primary text-white rounded-full hover:bg-accent disabled:opacity-50 disabled:hover:bg-primary transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
