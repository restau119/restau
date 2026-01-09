
import React from 'react';
import { LayoutGrid, ChefHat, MonitorDot, ShieldCheck } from 'lucide-react';
import { AppView } from '../types';

interface ViewSwitcherProps {
  currentView: AppView;
  setView: (view: AppView) => void;
}

export const ViewSwitcher: React.FC<ViewSwitcherProps> = ({ currentView, setView }) => {
  const buttons: { id: AppView; label: string; icon: React.ReactNode }[] = [
    { id: 'customer', label: 'Concierge Menu', icon: <LayoutGrid className="w-4 h-4" /> },
    { id: 'kitchen', label: 'Chef KDS', icon: <ChefHat className="w-4 h-4" /> },
    { id: 'public', label: 'Lobby Status', icon: <MonitorDot className="w-4 h-4" /> },
    { id: 'admin', label: 'Admin Hub', icon: <ShieldCheck className="w-4 h-4" /> },
  ];

  return (
    <div className="fixed top-0 left-0 right-0 z-[100] flex justify-center p-3">
      <div className="flex bg-black/40 backdrop-blur-xl rounded-full p-1 border border-white/10 shadow-2xl">
        {buttons.map((btn) => (
          <button
            key={btn.id}
            onClick={() => setView(btn.id)}
            className={`flex items-center gap-2 px-6 py-2 rounded-full text-xs font-bold tracking-widest uppercase transition-all duration-500 ${
              currentView === btn.id
                ? 'bg-[#D4AF37] text-black shadow-lg scale-105'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            {btn.icon}
            <span className="hidden sm:inline">{btn.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};
