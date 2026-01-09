
import React, { useState } from 'react';
import { Lock, ChevronLeft, ShieldAlert } from 'lucide-react';

interface StaffAccessGateProps {
  onAuthenticated: () => void;
  onBack: () => void;
  viewName: string;
}

export const StaffAccessGate: React.FC<StaffAccessGateProps> = ({ onAuthenticated, onBack, viewName }) => {
  const [password, setPassword] = useState('');
  const STAFF_PASSWORD = "admin";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === STAFF_PASSWORD) {
      onAuthenticated();
    } else {
      alert("Unauthorized Access Attempt Detected. This sanctuary remains closed.");
      setPassword('');
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-6 z-[200]">
      <div className="w-full max-w-lg bg-[#0d0d0d] rounded-[3.5rem] border border-white/10 p-12 md:p-16 shadow-2xl animate-fade-in text-center relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1.5 gold-gradient opacity-40"></div>
        
        <div className="w-24 h-24 bg-[#D4AF37]/10 rounded-full flex items-center justify-center mx-auto mb-10 border border-[#D4AF37]/30 shadow-[0_0_50px_rgba(212,175,55,0.1)]">
          <ShieldAlert className="w-10 h-10 text-[#D4AF37]" />
        </div>

        <h2 className="text-3xl md:text-4xl serif italic font-bold gold-text-gradient mb-6 leading-tight">Restricted Sanctuary</h2>
        
        <div className="space-y-6 mb-12">
          <p className="text-neutral-400 text-sm md:text-base font-light italic leading-relaxed">
            Esteemed Guest, you have reached a portal reserved exclusively for our Culinary Masters and Service Maîtres.
          </p>
          <p className="text-neutral-500 text-[10px] md:text-xs uppercase tracking-[0.3em] font-bold">
            Access restricted for {viewName}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <input 
            type="password" 
            placeholder="Staff Access Code" 
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-5 text-white text-center outline-none focus:border-[#D4AF37] transition-all text-lg tracking-widest"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button 
              type="button" 
              onClick={onBack}
              className="w-full py-5 bg-white/5 text-neutral-400 font-black uppercase tracking-[0.4em] rounded-full hover:bg-white/10 transition-colors text-[10px]"
            >
              Return to Menu
            </button>
            <button 
              type="submit" 
              className="w-full py-5 gold-gradient text-black font-black uppercase tracking-[0.4em] rounded-full shadow-2xl hover:scale-[1.02] active:scale-95 transition-transform text-[10px]"
            >
              Authenticate
            </button>
          </div>
        </form>

        <p className="mt-12 text-[9px] text-neutral-600 uppercase tracking-widest font-black flex items-center justify-center gap-2">
          <Lock className="w-3 h-3" /> Secure Estate Protocol Active
        </p>
      </div>
    </div>
  );
};
