
import React, { useState } from 'react';
import { Trash2, Edit2, X, PlusCircle, ChefHat, Tag, DollarSign, Clock, FileText, Image as ImageIcon, Lock, ShieldCheck, Calendar, Settings as SettingsIcon, Layers, Smartphone, Sparkles, Coffee } from 'lucide-react';
import { MenuItem, Chef, EstateSettings, Modifier, WorkingDay, SpecialOffer } from '../types.ts';
import { CURRENCY } from '../constants.tsx';

interface AdminViewProps {
  menu: MenuItem[];
  setMenu: React.Dispatch<React.SetStateAction<MenuItem[]>>;
  chefs: Chef[];
  setChefs: React.Dispatch<React.SetStateAction<Chef[]>>;
  settings: EstateSettings;
  setSettings: React.Dispatch<React.SetStateAction<EstateSettings>>;
  modifiers: Modifier[];
  setModifiers: React.Dispatch<React.SetStateAction<Modifier[]>>;
}

type AdminTab = 'menu' | 'chefs' | 'estate' | 'modifiers';

export const AdminView: React.FC<AdminViewProps> = ({ menu, setMenu, chefs, setChefs, settings, setSettings, modifiers, setModifiers }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [activeTab, setActiveTab] = useState<AdminTab>('menu');
  
  const [isAddingItem, setIsAddingItem] = useState(false);
  const [editingItemId, setEditingItemId] = useState<string | null>(null);

  const ADMIN_PASSWORD = "admin";

  const initialMenuForm: MenuItem = {
    id: '', name: '', description: '', ingredients: [], price: 0, category: 'Main Dishes', image: '', availableModifiers: [], estimatedTime: 15, allowedOptions: ['eat-in', 'reservation', 'pickup', 'takeaway', 'delivery']
  };

  const [menuFormData, setMenuFormData] = useState<MenuItem>(initialMenuForm);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) setIsAuthenticated(true);
    else { alert("Unauthorized Access."); setPassword(''); }
  };

  const handleUpdateSettings = (key: keyof EstateSettings, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-6">
        <div className="w-full max-w-md bg-[#0d0d0d] rounded-[3rem] border border-white/10 p-12 shadow-2xl animate-fade-in text-center">
          <Lock className="w-8 h-8 text-[#D4AF37] mx-auto mb-8" />
          <h2 className="text-3xl serif italic font-bold gold-text-gradient mb-10">Estate Authority</h2>
          <form onSubmit={handleLogin} className="space-y-6">
            <input type="password" placeholder="Access Code" value={password} onChange={e => setPassword(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white text-center outline-none focus:border-[#D4AF37]" />
            <button type="submit" className="w-full py-5 gold-gradient text-black font-black uppercase tracking-[0.4em] rounded-full">Authenticate</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#e5e5e5] pt-28 pb-40 px-6 md:px-10">
      <div className="max-w-7xl mx-auto animate-fade-in">
        <div className="flex flex-col md:flex-row items-center justify-between mb-12 gap-6">
          <h1 className="text-4xl serif font-bold gold-text-gradient uppercase italic flex items-center gap-4"><ShieldCheck className="w-8 h-8" /> Command Hub</h1>
          <div className="flex bg-white/5 p-1 rounded-full border border-white/10">
             {['menu', 'chefs', 'modifiers', 'estate'].map(tab => (
               <button key={tab} onClick={() => setActiveTab(tab as AdminTab)} className={`px-5 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest ${activeTab === tab ? 'bg-[#D4AF37] text-black' : 'text-neutral-500'}`}>
                 {tab}
               </button>
             ))}
          </div>
        </div>

        {activeTab === 'menu' && (
          <div className="bg-[#0d0d0d] rounded-[3rem] border border-white/10 p-10">
            <h2 className="text-2xl serif italic font-bold mb-6 text-white">Culinary Registry</h2>
            <div className="opacity-50 italic">Managing {menu.length} assets...</div>
            <button onClick={() => setIsAddingItem(true)} className="mt-10 px-8 py-4 gold-gradient text-black font-black uppercase tracking-widest rounded-full">Commission New Piece</button>
          </div>
        )}
      </div>
    </div>
  );
};
