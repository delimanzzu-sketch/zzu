import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Weight, 
  FileCheck, 
  MessageSquareCode, 
  Settings, 
  Menu, 
  X,
  ChevronRight,
  Shield,
  Zap
} from 'lucide-react';
import WeightSimulator from './components/WeightSimulator';
import SpecReviewer from './components/SpecReviewer';
import ChatBot from './components/ChatBot';
import { cn } from './lib/utils';
import { motion, AnimatePresence } from 'motion/react';

type Tab = 'weight' | 'review' | 'chat';

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>('weight');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const menuItems = [
    { id: 'weight', icon: Weight, label: 'Weight & CG Simulator', desc: 'Real-time physics calculation' },
    { id: 'review', icon: FileCheck, label: 'MIL-SPEC Reviewer', desc: 'Compliance & risk analysis' },
    { id: 'chat', icon: MessageSquareCode, label: 'Smart-LAND Assistant', desc: 'RAG-based spec Q&A' },
  ];

  return (
    <div className="flex h-screen overflow-hidden bg-hanwha-grey">
      {/* Sidebar */}
      <motion.aside 
        initial={false}
        animate={{ width: sidebarOpen ? 280 : 0, opacity: sidebarOpen ? 1 : 0 }}
        className="bg-hanwha-dark border-r border-gray-800 flex flex-col shrink-0 overflow-hidden"
      >
        <div className="p-6">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-hanwha-orange rounded flex items-center justify-center shadow-lg shadow-orange-900/40">
              <Shield className="text-white w-6 h-6" />
            </div>
            <div>
              <h1 className="text-white font-display font-bold text-lg tracking-tight leading-none uppercase">Hanwha</h1>
              <p className="text-hanwha-orange/80 text-[10px] font-mono tracking-widest mt-1 uppercase">Aerospace Designer</p>
            </div>
          </div>

          <nav className="space-y-1.5">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id as Tab)}
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-3 rounded transition-all group",
                  activeTab === item.id 
                    ? "bg-hanwha-orange text-white shadow-lg shadow-orange-600/20" 
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                )}
              >
                <item.icon className={cn("w-5 h-5", activeTab === item.id ? "text-white" : "text-gray-500 group-hover:text-hanwha-orange")} />
                <div className="text-left">
                  <p className="font-semibold text-sm leading-tight">{item.label}</p>
                  <p className={cn("text-[10px] mt-0.5", activeTab === item.id ? "text-white/60" : "text-gray-600")}>
                    {item.desc}
                  </p>
                </div>
                {activeTab === item.id && <ChevronRight className="ml-auto w-4 h-4 text-white/50" />}
              </button>
            ))}
          </nav>
        </div>

        <div className="mt-auto p-6 border-t border-gray-800">
          <button className="flex items-center gap-3 text-gray-500 hover:text-white w-full px-4 py-2 transition-colors">
            <Settings className="w-4 h-4" />
            <span className="text-sm font-medium uppercase tracking-tighter">Settings</span>
          </button>
        </div>
      </motion.aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 relative h-full">
        {/* Header */}
        <header className="h-16 border-b border-hanwha-border bg-white/90 backdrop-blur-md flex items-center justify-between px-6 z-10">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 hover:bg-gray-100 rounded text-gray-500 transition-colors"
            >
              {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            <div className="h-4 w-[1px] bg-hanwha-border mx-2" />
            <h2 className="font-bold text-hanwha-dark uppercase tracking-tight">
              {menuItems.find(i => i.id === activeTab)?.label}
            </h2>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="bg-orange-50 text-hanwha-orange px-3 py-1 rounded-sm text-[10px] font-bold border border-orange-100 flex items-center gap-1.5 shadow-sm uppercase tracking-wider">
              <Zap className="w-3 h-3 fill-hanwha-orange text-hanwha-orange" />
              Connected to CI System
            </div>
            <div className="w-8 h-8 bg-hanwha-orange/10 border border-hanwha-orange/20 rounded flex items-center justify-center text-hanwha-orange font-bold text-xs shadow-sm">
              HA
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto bg-hanwha-grey">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="h-full"
            >
              {activeTab === 'weight' && <WeightSimulator />}
              {activeTab === 'review' && <SpecReviewer />}
              {activeTab === 'chat' && <ChatBot />}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
