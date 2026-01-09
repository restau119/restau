
import React, { useState } from 'react';
import { Lock, ShieldAlert } from 'lucide-react';

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
    if (password === STAFF_PASSWORD) onAuthenticated();
    else { alert("Unauthorized."); setPassword(''); }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-6">
      <div className="w-full max-w-lg bg-[#0d0d0d] rounded-[3.5rem] border border-white/10 p-12 text-center animate-fade-in">
        <ShieldAlert className="w-10 h-10 text-[#D4AF37] mx-auto mb-10" />
        <h2 className="text-3xl md:text-4xl serif italic font-bold gold-text-gradient mb-6 leading-tight">Restricted Sanctuary</h2>
        <p className="text-neutral-400 mb-12 italic">Access restricted for {viewName}</p>
        <form onSubmit={handleSubmit} className="space-y-6">
          <input type="password" placeholder="Access Code" value={password} onChange={e => setPassword(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-5 text-white text-center outline-none focus:border-[#D4AF37]" />
          <div className="grid grid-cols-2 gap-4">
            <button type="button" onClick={onBack} className="py-5 bg-white/5 text-neutral-400 font-black uppercase tracking-widest rounded-full text-[10px]">Back</button>
            <button type="submit" className="py-5 gold-gradient text-black font-black uppercase tracking-widest rounded-full text-[10px]">Authenticate</button>
          </div>
        </form>
      </div>
    </div>
  );
};
