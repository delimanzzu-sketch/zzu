import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, Send, Bot, User, Loader2, Info } from 'lucide-react';
import { ChatMessage } from '../types';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';

export default function ChatBot() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Hello, I am Smart-LAND Designer AI. How can I help you with your defense system design today? You can ask about MIL-SPEC conditions, weight requirements, or historical technical issues.',
      timestamp: Date.now()
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input, history: messages }),
      });
      const data = await response.json();
      
      const assistantMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.text,
        timestamp: Date.now()
      };
      setMessages(prev => [...prev, assistantMsg]);
    } catch (error) {
      console.error('Chat error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto h-[calc(100vh-12rem)] flex flex-col bg-white border border-hanwha-border rounded shadow-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-4">
      {/* Header */}
      <div className="bg-hanwha-dark p-4 flex items-center justify-between border-b border-gray-800">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-hanwha-orange/10 text-hanwha-orange rounded border border-hanwha-orange/20">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-white font-bold text-xs uppercase tracking-widest">Aero-Intelligence Core</h3>
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.6)]" />
              <span className="text-[9px] text-gray-500 font-mono uppercase tracking-tighter">MIL-SPEC Knowledge Engine Online</span>
            </div>
          </div>
        </div>
        <button className="text-gray-600 hover:text-hanwha-orange transition-colors">
          <Info className="w-4 h-4" />
        </button>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 bg-hanwha-grey/30">
        <AnimatePresence initial={false}>
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, x: msg.role === 'user' ? 20 : -20 }}
              animate={{ opacity: 1, x: 0 }}
              className={cn(
                "flex gap-4 max-w-[90%]",
                msg.role === 'user' ? "ml-auto flex-row-reverse" : ""
              )}
            >
              <div className={cn(
                "w-7 h-7 rounded flex items-center justify-center shrink-0 shadow-sm border",
                msg.role === 'user' ? "bg-hanwha-dark border-gray-700 text-hanwha-orange" : "bg-white border-hanwha-border text-hanwha-dark"
              )}>
                {msg.role === 'user' ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
              </div>
              <div className={cn(
                "p-4 rounded shadow-sm text-xs leading-relaxed border",
                msg.role === 'user' 
                  ? "bg-hanwha-dark text-white border-gray-700 rounded-tr-none" 
                  : "bg-white border-hanwha-border text-gray-800 rounded-tl-none"
              )}>
                {msg.content}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        {loading && (
          <div className="flex gap-4 max-w-[85%] animate-pulse">
            <div className="w-7 h-7 rounded bg-white border border-hanwha-border flex items-center justify-center">
              <Bot className="w-3.5 h-3.5 text-hanwha-orange" />
            </div>
            <div className="p-4 rounded bg-white border border-hanwha-border text-gray-400 flex items-center gap-2 italic text-[10px] uppercase tracking-widest">
              <Loader2 className="w-3 h-3 animate-spin" />
              Synthesizing Defense Standard Data...
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="p-4 bg-white border-t border-hanwha-border">
        <div className="relative">
          <input
            type="text"
            className="w-full pl-4 pr-12 py-4 bg-hanwha-grey border border-hanwha-border rounded focus:ring-1 focus:ring-hanwha-orange focus:bg-white transition-all text-xs font-mono"
            placeholder="Command input (e.g., 'Compare MIL-STD-810H Method 514 vs 516')"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || loading}
            className="absolute right-2 top-2 p-2.5 bg-hanwha-orange text-white rounded shadow-lg hover:bg-orange-600 disabled:opacity-50 transition-all"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
        <p className="mt-2 text-[9px] text-gray-400 text-center uppercase tracking-tighter">
          Proprietary Intelligence Core • Verify against official Technical Orders
        </p>
      </div>
    </div>
  );
}
