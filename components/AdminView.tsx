
import React, { useState } from 'react';
import { Plus, Trash2, Edit2, Save, X, PlusCircle, ChefHat, Tag, DollarSign, Clock, FileText, Image as ImageIcon, Lock, ShieldCheck, Calendar, Settings as SettingsIcon, Layers, Phone, Smartphone, Users, Sparkles, Coffee } from 'lucide-react';
import { MenuItem, DiningOption, Chef, EstateSettings, Modifier, WorkingDay, SpecialOffer } from '../types';
import { CURRENCY } from '../constants';

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
  const [newIngredient, setNewIngredient] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) setIsAuthenticated(true);
    else { alert("Unauthorized Access Attempt Detected."); setPassword(''); }
  };

  const handleSaveMenu = () => {
    if (!menuFormData.name || menuFormData.price <= 0) return alert("Valid name and price required.");
    if (editingItemId) setMenu(prev => prev.map(item => item.id === editingItemId ? { ...menuFormData } : item));
    else setMenu(prev => [...prev, { ...menuFormData, id: `dish_${Math.random().toString(36).substr(2, 5)}` }]);
    resetMenuForm();
  };

  const resetMenuForm = () => { setMenuFormData(initialMenuForm); setIsAddingItem(false); setEditingItemId(null); };

  const handleEditItem = (item: MenuItem) => { setMenuFormData(item); setEditingItemId(item.id); setIsAddingItem(true); };

  const handleUpdateSettings = (key: keyof EstateSettings, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleUpdateWorkingDay = (index: number, updates: Partial<WorkingDay>) => {
    const updatedDays = [...settings.workingDays];
    updatedDays[index] = { ...updatedDays[index], ...updates };
    handleUpdateSettings('workingDays', updatedDays);
  };

  const addSpecialOffer = () => {
    const newOffer: SpecialOffer = {
      id: Date.now().toString(),
      title: 'New Special',
      description: 'Offer details...',
      day: 'Monday',
      isActive: true
    };
    handleUpdateSettings('specialOffers', [...settings.specialOffers, newOffer]);
  };

  const updateSpecialOffer = (id: string, updates: Partial<SpecialOffer>) => {
    const updatedOffers = settings.specialOffers.map(o => o.id === id ? { ...o, ...updates } : o);
    handleUpdateSettings('specialOffers', updatedOffers);
  };

  const deleteSpecialOffer = (id: string) => {
    handleUpdateSettings('specialOffers', settings.specialOffers.filter(o => o.id !== id));
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-6">
        <div className="w-full max-w-md bg-[#0d0d0d] rounded-[3rem] border border-white/10 p-12 shadow-2xl animate-fade-in text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 gold-gradient opacity-50"></div>
          <div className="w-20 h-20 bg-[#D4AF37]/10 rounded-full flex items-center justify-center mx-auto mb-8 border border-[#D4AF37]/30">
            <Lock className="w-8 h-8 text-[#D4AF37]" />
          </div>
          <h2 className="text-3xl serif italic font-bold gold-text-gradient mb-4">Estate Authority</h2>
          <p className="text-neutral-500 text-sm mb-10 italic">Enter credentials to access the Imperial Hub.</p>
          <form onSubmit={handleLogin} className="space-y-6">
            <input type="password" placeholder="Secure Access Code" value={password} onChange={e => setPassword(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white text-center outline-none focus:border-[#D4AF37] transition-all" />
            <button type="submit" className="w-full py-5 gold-gradient text-black font-black uppercase tracking-[0.4em] rounded-full shadow-2xl hover:scale-[1.02] active:scale-95 transition-transform">Authenticate</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#e5e5e5] pt-28 pb-40 px-6 md:px-10">
      <div className="max-w-7xl mx-auto animate-fade-in">
        <div className="flex flex-col md:flex-row items-center justify-between mb-12 gap-6">
          <div>
            <h1 className="text-4xl serif font-bold gold-text-gradient uppercase italic tracking-tighter flex items-center gap-4 leading-none">
              <ShieldCheck className="w-8 h-8" /> Command Hub
            </h1>
            <p className="text-neutral-500 font-light tracking-[0.3em] uppercase text-[9px] mt-3 italic">Live Estate Logistics • Concierge Control</p>
          </div>
          <div className="flex bg-white/5 p-1 rounded-full border border-white/10 overflow-x-auto no-scrollbar">
             {[
               { id: 'menu', icon: <Tag />, label: 'Culinary' },
               { id: 'chefs', icon: <ChefHat />, label: 'Masters' },
               { id: 'modifiers', icon: <Layers />, label: 'Palate' },
               { id: 'estate', icon: <SettingsIcon />, label: 'Logistics' },
             ].map(tab => (
               <button key={tab.id} onClick={() => setActiveTab(tab.id as AdminTab)} className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${activeTab === tab.id ? 'bg-[#D4AF37] text-black' : 'text-neutral-500 hover:text-white'}`}>
                 {tab.label}
               </button>
             ))}
          </div>
        </div>

        {activeTab === 'menu' && (
          <div className="space-y-12">
            <div className="flex flex-col md:flex-row gap-6 md:items-center justify-between bg-[#0d0d0d] p-8 rounded-[2.5rem] border border-white/10">
               <div>
                  <h2 className="text-2xl serif italic font-bold">Culinary Registry</h2>
                  <p className="text-neutral-500 text-[9px] uppercase tracking-widest">Managing {menu.length} Grand Creations & Drinks</p>
               </div>
               <div className="flex gap-4">
                 <button onClick={() => { setIsAddingItem(true); setMenuFormData({ ...initialMenuForm, category: 'Drinks' }); }} className="px-6 py-4 bg-white/5 text-[#D4AF37] font-black uppercase tracking-[0.2em] rounded-full flex items-center gap-3 border border-[#D4AF37]/20 hover:bg-[#D4AF37]/10 transition-all text-[10px]">
                    <Coffee className="w-4 h-4" /> Add Drink
                 </button>
                 <button onClick={() => setIsAddingItem(true)} className="px-8 py-4 gold-gradient text-black font-black uppercase tracking-[0.2em] rounded-full flex items-center gap-3 transition-all hover:scale-105 active:scale-95 shadow-2xl text-[10px]">
                    <PlusCircle className="w-5 h-5" /> Commission Dish
                 </button>
               </div>
            </div>
            
            <div className="bg-[#0d0d0d] rounded-[3rem] border border-white/10 overflow-hidden shadow-2xl">
               <table className="w-full text-left">
                  <thead className="bg-white/5">
                    <tr>
                      <th className="p-8 text-[10px] uppercase tracking-[0.3em] text-neutral-500 font-black">Dish Details</th>
                      <th className="p-8 text-[10px] uppercase tracking-[0.3em] text-neutral-500 font-black">Category</th>
                      <th className="p-8 text-[10px] uppercase tracking-[0.3em] text-neutral-500 font-black">Price ({CURRENCY})</th>
                      <th className="p-8 text-[10px] uppercase tracking-[0.3em] text-neutral-500 font-black text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {menu.map(item => (
                      <tr key={item.id} className="hover:bg-white/[0.02] transition-colors group">
                        <td className="p-8 flex items-center gap-6">
                           <img src={item.image} className="w-16 h-16 rounded-full object-cover border-2 border-white/10" />
                           <div>
                              <p className="font-bold text-white serif italic text-lg">{item.name}</p>
                              <p className="text-[9px] text-neutral-500 uppercase tracking-widest">{item.estimatedTime} Min Service</p>
                           </div>
                        </td>
                        <td className="p-8">
                           <span className="px-3 py-1 bg-white/5 rounded-full text-[9px] font-black uppercase tracking-widest text-neutral-400">{item.category}</span>
                        </td>
                        <td className="p-8 font-mono text-[#D4AF37]">{item.price.toLocaleString()}</td>
                        <td className="p-8 text-right">
                           <div className="flex justify-end gap-3">
                              <button onClick={() => handleEditItem(item)} className="p-3 bg-white/5 rounded-xl hover:bg-[#D4AF37] hover:text-black transition-all"><Edit2 className="w-4 h-4" /></button>
                              <button onClick={() => setMenu(prev => prev.filter(i => i.id !== item.id))} className="p-3 bg-white/5 rounded-xl hover:bg-red-500 hover:text-white transition-all"><Trash2 className="w-4 h-4" /></button>
                           </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
               </table>
            </div>
          </div>
        )}

        {activeTab === 'chefs' && (
          <div className="space-y-12 animate-fade-in">
             <div className="bg-[#0d0d0d] p-8 rounded-[2.5rem] border border-white/10 flex justify-between items-center">
                <div>
                   <h2 className="text-2xl serif italic font-bold">Heritage Masters</h2>
                   <p className="text-neutral-500 text-[9px] uppercase tracking-widest">Managing Staff & Visual Avatars</p>
                </div>
                <button onClick={() => setChefs([...chefs, { id: Date.now().toString(), name: 'New Chef', specialty: 'Signature Specialist', avatar: '' }])} className="px-8 py-4 bg-white/5 text-neutral-400 font-black uppercase tracking-[0.2em] rounded-full flex items-center gap-3 hover:bg-[#D4AF37] hover:text-black transition-all">
                  Add Master Chef
                </button>
             </div>
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {chefs.map((chef, idx) => (
                   <div key={chef.id} className="bg-[#0d0d0d] p-8 rounded-[3rem] border border-white/10 relative group shadow-xl">
                      <div className="flex flex-col gap-6">
                         <div className="flex items-center gap-6">
                            <div className="relative">
                               <img src={chef.avatar || 'https://images.unsplash.com/photo-1583394238182-6f71f3ef0874?auto=format&fit=crop&w=150&q=80'} className="w-20 h-20 rounded-full object-cover border-2 border-[#D4AF37]/30" />
                               <div className="absolute -bottom-1 -right-1 p-1.5 bg-[#D4AF37] text-black rounded-full"><Edit2 className="w-3 h-3" /></div>
                            </div>
                            <div className="flex-1">
                               <input placeholder="Chef Name" value={chef.name} onChange={e => { const updated = [...chefs]; updated[idx].name = e.target.value; setChefs(updated); }} className="bg-transparent text-xl serif font-bold border-none outline-none w-full italic text-white" />
                               <input placeholder="Specialty" value={chef.specialty} onChange={e => { const updated = [...chefs]; updated[idx].specialty = e.target.value; setChefs(updated); }} className="bg-transparent text-[9px] uppercase tracking-widest text-neutral-500 border-none outline-none w-full" />
                            </div>
                         </div>
                         <div className="space-y-2">
                            <label className="text-[8px] uppercase tracking-widest text-neutral-600 font-black">Avatar Image URL</label>
                            <input value={chef.avatar} onChange={e => { const updated = [...chefs]; updated[idx].avatar = e.target.value; setChefs(updated); }} placeholder="https://..." className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-[10px] text-white outline-none focus:border-[#D4AF37]" />
                         </div>
                      </div>
                      <button onClick={() => setChefs(prev => prev.filter(c => c.id !== chef.id))} className="absolute top-6 right-6 p-2 text-neutral-700 hover:text-red-500 transition-colors"><Trash2 className="w-4 h-4" /></button>
                   </div>
                ))}
             </div>
          </div>
        )}

        {activeTab === 'estate' && (
          <div className="space-y-12 animate-fade-in">
             <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                <div className="space-y-12">
                   <div className="bg-[#0d0d0d] p-10 rounded-[3rem] border border-white/10 space-y-8 shadow-xl">
                      <h3 className="text-2xl serif italic font-bold flex items-center gap-4"><Smartphone className="text-[#D4AF37]" /> Financial Logistics</h3>
                      <div className="space-y-4">
                         <label className="text-[10px] uppercase tracking-widest text-neutral-500 font-black">Mobile Money Details</label>
                         <textarea value={settings.mobileMoneyDetails} onChange={e => handleUpdateSettings('mobileMoneyDetails', e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-2xl p-6 text-white text-sm italic outline-none h-32 resize-none" />
                      </div>
                      <div className="space-y-4">
                         <label className="text-[10px] uppercase tracking-widest text-neutral-500 font-black">Estate Contact Number</label>
                         <input value={settings.contactNumber} onChange={e => handleUpdateSettings('contactNumber', e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white font-mono outline-none" />
                      </div>
                   </div>
                </div>

                <div className="space-y-12">
                   <div className="bg-[#0d0d0d] p-10 rounded-[3rem] border border-white/10 space-y-8 shadow-xl">
                      <h3 className="text-2xl serif italic font-bold flex items-center gap-4"><Calendar className="text-[#D4AF37]" /> Heritage Hours</h3>
                      <div className="space-y-4 divide-y divide-white/5 max-h-[400px] overflow-y-auto pr-2 no-scrollbar">
                         {settings.workingDays.map((wd, i) => (
                            <div key={wd.day} className="flex items-center justify-between py-4 first:pt-0">
                               <div className="flex items-center gap-4">
                                  <button onClick={() => handleUpdateWorkingDay(i, { isOpen: !wd.isOpen })} className={`w-10 h-6 rounded-full transition-all relative ${wd.isOpen ? 'bg-[#D4AF37]' : 'bg-neutral-800'}`}>
                                     <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${wd.isOpen ? 'right-1' : 'left-1'}`} />
                                  </button>
                                  <span className={`text-sm font-bold serif ${wd.isOpen ? 'text-white' : 'text-neutral-700'}`}>{wd.day}</span>
                               </div>
                               <div className={`flex items-center gap-3 ${!wd.isOpen && 'opacity-20 pointer-events-none'}`}>
                                  <input type="time" value={wd.openTime} onChange={e => handleUpdateWorkingDay(i, { openTime: e.target.value })} className="bg-transparent border border-white/10 rounded-lg px-2 py-1 text-[10px] text-white outline-none" />
                                  <input type="time" value={wd.closeTime} onChange={e => handleUpdateWorkingDay(i, { closeTime: e.target.value })} className="bg-transparent border border-white/10 rounded-lg px-2 py-1 text-[10px] text-white outline-none" />
                               </div>
                            </div>
                         ))}
                      </div>
                   </div>
                </div>
             </div>

             <div className="bg-[#0d0d0d] p-10 rounded-[3rem] border border-white/10 space-y-10 shadow-xl">
                <div className="flex justify-between items-center">
                   <h3 className="text-2xl serif italic font-bold flex items-center gap-4"><Sparkles className="text-[#D4AF37]" /> Imperial Offers</h3>
                   <button onClick={addSpecialOffer} className="px-6 py-3 bg-[#D4AF37] text-black font-black uppercase tracking-widest rounded-full text-[10px] hover:scale-105 transition-all">Register Offer</button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                   {settings.specialOffers.map((offer) => (
                      <div key={offer.id} className="p-8 bg-white/5 border border-white/10 rounded-[2rem] space-y-6 relative group">
                         <div className="flex justify-between">
                            <select value={offer.day} onChange={e => updateSpecialOffer(offer.id, { day: e.target.value })} className="bg-[#D4AF37]/10 border border-[#D4AF37]/20 text-[#D4AF37] rounded-full px-4 py-1.5 text-[9px] font-black uppercase tracking-widest outline-none">
                               {settings.workingDays.map(d => <option key={d.day} value={d.day} className="bg-neutral-900">{d.day}</option>)}
                            </select>
                            <button onClick={() => deleteSpecialOffer(offer.id)} className="text-neutral-700 hover:text-red-500 transition-colors"><Trash2 className="w-4 h-4" /></button>
                         </div>
                         <div className="space-y-4">
                            <input value={offer.title} onChange={e => updateSpecialOffer(offer.id, { title: e.target.value })} placeholder="Offer Title" className="w-full bg-transparent text-xl serif font-bold italic border-none outline-none text-white" />
                            <textarea value={offer.description} onChange={e => updateSpecialOffer(offer.id, { description: e.target.value })} placeholder="Offer description..." className="w-full bg-transparent text-xs text-neutral-500 italic border-none outline-none h-16 resize-none" />
                         </div>
                         <div className="flex items-center gap-3">
                            <button onClick={() => updateSpecialOffer(offer.id, { isActive: !offer.isActive })} className={`w-10 h-5 rounded-full relative transition-all ${offer.isActive ? 'bg-green-500/50' : 'bg-neutral-800'}`}>
                               <div className={`absolute top-1 w-3 h-3 rounded-full bg-white transition-all ${offer.isActive ? 'right-1' : 'left-1'}`} />
                            </button>
                            <span className="text-[8px] font-black uppercase tracking-widest text-neutral-600">{offer.isActive ? 'Offer Live' : 'Archived'}</span>
                         </div>
                      </div>
                   ))}
                </div>
             </div>
          </div>
        )}

        {activeTab === 'modifiers' && (
          <div className="space-y-12 animate-fade-in">
             <div className="bg-[#0d0d0d] p-8 rounded-[2.5rem] border border-white/10 flex justify-between items-center">
                <div>
                   <h2 className="text-2xl serif italic font-bold">Palate Adjustments</h2>
                   <p className="text-neutral-500 text-[9px] uppercase tracking-widest">Managing Extras & Customizations</p>
                </div>
                <button onClick={() => setModifiers([...modifiers, { id: Date.now().toString(), name: 'New Modifier', price: 0, type: 'extra' }])} className="px-8 py-4 gold-gradient text-black font-black uppercase tracking-[0.2em] rounded-full shadow-2xl text-[10px]">
                  New Add-on
                </button>
             </div>
             <div className="bg-[#0d0d0d] rounded-[3rem] border border-white/10 overflow-hidden shadow-2xl">
                <table className="w-full text-left">
                   <thead className="bg-white/5">
                      <tr>
                         <th className="p-8 text-[10px] uppercase tracking-[0.3em] text-neutral-500 font-black">Modifier Name</th>
                         <th className="p-8 text-[10px] uppercase tracking-[0.3em] text-neutral-500 font-black">Type</th>
                         <th className="p-8 text-[10px] uppercase tracking-[0.3em] text-neutral-500 font-black">Price ({CURRENCY})</th>
                         <th className="p-8 text-[10px] uppercase tracking-[0.3em] text-neutral-500 font-black text-right">Actions</th>
                      </tr>
                   </thead>
                   <tbody className="divide-y divide-white/5">
                      {modifiers.map((mod, idx) => (
                         <tr key={mod.id} className="hover:bg-white/[0.02] group">
                            <td className="p-8">
                               <input value={mod.name} onChange={e => { const updated = [...modifiers]; updated[idx].name = e.target.value; setModifiers(updated); }} className="bg-transparent text-white font-bold italic outline-none w-full" />
                            </td>
                            <td className="p-8">
                               <select value={mod.type} onChange={e => { const updated = [...modifiers]; updated[idx].type = e.target.value as any; setModifiers(updated); }} className="bg-white/5 border border-white/10 rounded-full px-4 py-1.5 text-[9px] font-black uppercase tracking-widest text-neutral-400 outline-none">
                                  <option value="extra" className="bg-neutral-900">Add-on</option>
                                  <option value="remove" className="bg-neutral-900">Removal</option>
                               </select>
                            </td>
                            <td className="p-8">
                               <input type="number" value={mod.price} onChange={e => { const updated = [...modifiers]; updated[idx].price = Number(e.target.value); setModifiers(updated); }} className="bg-transparent text-[#D4AF37] font-mono outline-none w-24" />
                            </td>
                            <td className="p-8 text-right">
                               <button onClick={() => setModifiers(prev => prev.filter(m => m.id !== mod.id))} className="p-3 bg-white/5 rounded-xl text-neutral-600 hover:text-red-500 transition-all"><Trash2 className="w-4 h-4" /></button>
                            </td>
                         </tr>
                      ))}
                   </tbody>
                </table>
             </div>
          </div>
        )}

        {isAddingItem && (
          <div className="fixed inset-0 z-[200] bg-black/98 backdrop-blur-2xl p-4 md:p-10 overflow-y-auto flex items-center justify-center">
            <div className="w-full max-w-4xl bg-[#0d0d0d] rounded-[3rem] border border-white/10 p-8 md:p-12 shadow-2xl animate-fade-in relative">
              <button onClick={resetMenuForm} className="absolute top-8 right-8 text-neutral-500 hover:text-white transition-colors">
                <X className="w-8 h-8" />
              </button>
              
              <h2 className="text-4xl serif italic font-bold gold-text-gradient mb-10">
                {editingItemId ? 'Refine Culinary Asset' : 'Commission New Asset'}
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest text-neutral-500 font-black flex items-center gap-2"><Tag className="w-3 h-3" /> Identity</label>
                    <input type="text" value={menuFormData.name} onChange={e => setMenuFormData({ ...menuFormData, name: e.target.value })} placeholder="Item Name" className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white outline-none focus:border-[#D4AF37]" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase tracking-widest text-neutral-500 font-black flex items-center gap-2"><DollarSign className="w-3 h-3" /> Value ({CURRENCY})</label>
                      <input type="number" value={menuFormData.price} onChange={e => setMenuFormData({ ...menuFormData, price: Number(e.target.value) })} className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white outline-none focus:border-[#D4AF37]" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase tracking-widest text-neutral-500 font-black flex items-center gap-2"><Clock className="w-3 h-3" /> Prep Delay (Min)</label>
                      <input type="number" value={menuFormData.estimatedTime} onChange={e => setMenuFormData({ ...menuFormData, estimatedTime: Number(e.target.value) })} className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white outline-none focus:border-[#D4AF37]" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest text-neutral-500 font-black">Category</label>
                    <select value={menuFormData.category} onChange={e => setMenuFormData({ ...menuFormData, category: e.target.value as any })} className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white outline-none focus:border-[#D4AF37] appearance-none">
                      <option value="Starters" className="bg-neutral-900">Beginnings (Starters)</option>
                      <option value="Main Dishes" className="bg-neutral-900">Signatures (Mains)</option>
                      <option value="Drinks" className="bg-neutral-900">Elixirs (Drinks)</option>
                      <option value="Sides" className="bg-neutral-900">Accompaniments (Sides)</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest text-neutral-500 font-black flex items-center gap-2"><ImageIcon className="w-3 h-3" /> Asset Image URL</label>
                    <input type="text" value={menuFormData.image} onChange={e => setMenuFormData({ ...menuFormData, image: e.target.value })} placeholder="https://..." className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white outline-none focus:border-[#D4AF37]" />
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest text-neutral-500 font-black flex items-center gap-2"><FileText className="w-3 h-3" /> Concierge Narration</label>
                    <textarea value={menuFormData.description} onChange={e => setMenuFormData({ ...menuFormData, description: e.target.value })} placeholder="Description of the item..." className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white outline-none h-24 resize-none" />
                  </div>
                  <div className="space-y-4">
                    <label className="text-[10px] uppercase tracking-widest text-neutral-500 font-black">Heritage Elements</label>
                    <div className="flex gap-2">
                      <input type="text" value={newIngredient} onChange={e => setNewIngredient(e.target.value)} onKeyPress={e => e.key === 'Enter' && (setMenuFormData(p => ({ ...p, ingredients: [...p.ingredients, newIngredient] })), setNewIngredient(''))} placeholder="Add ingredient..." className="flex-1 bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white outline-none" />
                      <button onClick={() => { if(newIngredient.trim()){setMenuFormData(p => ({ ...p, ingredients: [...p.ingredients, newIngredient] })); setNewIngredient('');} }} className="p-4 bg-[#D4AF37] text-black rounded-2xl"><Plus /></button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-12 flex justify-end gap-6 pt-8 border-t border-white/5">
                <button onClick={resetMenuForm} className="px-10 py-5 bg-white/5 text-neutral-500 font-black uppercase tracking-[0.2em] rounded-full hover:bg-white/10">Discard</button>
                <button onClick={handleSaveMenu} className="px-12 py-5 gold-gradient text-black font-black uppercase tracking-[0.2em] rounded-full shadow-2xl hover:scale-105 active:scale-95 transition-all">Commit Save</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
