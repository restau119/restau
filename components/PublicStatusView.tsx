
import React, { useState, useEffect } from 'react';
import { Utensils, Bell, Hotel, Clock, Timer } from 'lucide-react';
import { Order } from '../types';

const StatusTimer = ({ createdAt, maxEstimatedTime }: { createdAt: number, maxEstimatedTime: number }) => {
  const [data, setData] = useState({ elapsed: '00:00', remainingMins: 0 });

  useEffect(() => {
    const update = () => {
      const diff = Date.now() - createdAt;
      const minsElapsed = Math.floor(diff / 60000);
      const secsElapsed = Math.floor((diff % 60000) / 1000);
      
      const target = createdAt + (maxEstimatedTime * 60 * 1000);
      const remaining = Math.max(0, target - Date.now());
      const minsRemaining = Math.ceil(remaining / 60000);
      
      setData({
        elapsed: `${minsElapsed}:${secsElapsed.toString().padStart(2, '0')}`,
        remainingMins: minsRemaining
      });
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [createdAt, maxEstimatedTime]);

  return (
    <div className="flex flex-col items-end gap-1">
       <div className="flex items-center gap-2 text-[#D4AF37]">
          <Timer className="w-3 h-3" />
          <span className="text-[10px] font-black tracking-widest uppercase">
            {data.remainingMins === 0 ? 'Plating Service' : `~${data.remainingMins} MINS UNTIL SERVICE`}
          </span>
       </div>
       <div className="flex items-center gap-2 opacity-30">
          <Clock className="w-2.5 h-2.5" />
          <span className="text-[8px] font-black tracking-[0.2em] uppercase">Time Elapsed: {data.elapsed}</span>
       </div>
    </div>
  );
};

interface PublicStatusViewProps {
  orders: Order[];
}

export const PublicStatusView: React.FC<PublicStatusViewProps> = ({ orders }) => {
  const preparing = orders.filter(o => o.status === 'preparing');
  const ready = orders.filter(o => o.status === 'ready');

  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col pt-20 h-screen overflow-hidden">
      <div className="p-12 border-b border-white/5 flex justify-between items-end bg-[#080808]">
        <div>
          <div className="flex items-center gap-4 text-[#D4AF37] mb-2">
            <Hotel className="w-6 h-6" />
            <span className="text-[10px] font-black uppercase tracking-[0.8em]">The Royal Estate • Grand Lobby</span>
          </div>
          <h1 className="text-6xl font-black italic serif tracking-tighter leading-none uppercase">Service Live Feed</h1>
        </div>
        <div className="text-right">
          <div className="text-4xl font-light text-neutral-600 font-mono tracking-tighter">
            {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </div>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        <div className="flex-1 p-16 bg-[#070707] overflow-y-auto">
          <div className="flex items-baseline justify-between mb-16 border-b border-white/5 pb-8">
            <h2 className="text-2xl font-black uppercase tracking-[0.4em] text-neutral-500 italic">Chef's Gallery Selection</h2>
            <div className="flex gap-2">
               {[1,2,3].map(i => <div key={i} className={`w-1.5 h-1.5 rounded-full bg-[#D4AF37] animate-pulse`} style={{ animationDelay: `${i * 0.2}s` }}></div>)}
            </div>
          </div>
          
          <div className="grid grid-cols-1 gap-y-16">
            {preparing.map(order => (
              <div key={order.id} className="animate-fade-in border-l-2 border-[#D4AF37]/20 pl-10 group">
                <div className="flex justify-between items-start mb-4">
                   <div className="flex items-center gap-6">
                      <span className="text-[10px] font-black text-[#D4AF37] uppercase tracking-widest border border-[#D4AF37]/20 px-3 py-1 rounded-full">Suite {order.tableNumber}</span>
                   </div>
                   {(order.diningOption === 'eat-in' || order.diningOption === 'takeaway') && (
                     <StatusTimer createdAt={order.createdAt} maxEstimatedTime={order.maxEstimatedTime} />
                   )}
                </div>
                <span className="text-5xl font-black serif italic tracking-tighter text-neutral-200 group-hover:gold-text-gradient transition-all duration-700 block mb-4">
                  {order.customerName}
                </span>
                <div className="flex items-center gap-6 text-[9px] uppercase tracking-[0.4em] text-neutral-600 italic font-bold">
                   <span>Lead Chef {order.chefName}</span>
                   <span className="w-1 h-1 bg-neutral-800 rounded-full"></span>
                   <span>{order.diningOption} Service</span>
                </div>
              </div>
            ))}
            {preparing.length === 0 && (
              <div className="py-20 text-center opacity-10 italic serif text-2xl flex flex-col items-center gap-4">
                 <Utensils className="w-12 h-12" />
                 <span>Quiet in the Gallery...</span>
              </div>
            )}
          </div>
        </div>

        <div className="flex-1 p-16 bg-white/[0.01] border-l border-white/5 overflow-y-auto">
          <div className="flex items-baseline justify-between mb-16 border-b border-[#D4AF37]/20 pb-8">
            <h2 className="text-2xl font-black uppercase tracking-[0.4em] text-[#D4AF37] italic">Service Ready</h2>
            <Bell className="w-6 h-6 text-[#D4AF37] animate-bounce" />
          </div>

          <div className="flex flex-col gap-10">
            {ready.map(order => (
              <div key={order.id} className="flex items-center justify-between p-12 bg-[#D4AF37] rounded-[3rem] shadow-[0_40px_80px_rgba(212,175,55,0.1)] transition-all hover:scale-[1.02] cursor-pointer group">
                <div className="flex flex-col">
                    <span className="text-black font-black uppercase tracking-[0.4em] text-[10px] opacity-60 mb-2">Estate Suite {order.tableNumber}</span>
                    <span className="text-6xl font-black serif italic tracking-tighter text-black leading-none group-hover:tracking-normal transition-all duration-500">
                      {order.customerName}
                    </span>
                </div>
                <div className="text-right flex flex-col items-end gap-3">
                    <div className="p-4 bg-black/10 rounded-full">
                       <Bell className="w-6 h-6 text-black" />
                    </div>
                    <span className="text-black font-black uppercase tracking-[0.2em] text-[11px] italic">Awaiting Guest</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <div className="bg-[#050505] py-8 border-t border-white/5 overflow-hidden">
        <div className="flex gap-40 animate-marquee items-center whitespace-nowrap">
            {[1,2].map(i => (
                <div key={i} className="flex gap-40 items-center">
                    <span className="text-[#D4AF37] font-black text-[11px] uppercase tracking-[0.6em] italic">Royal Concierge: Experience Heritage African Gastronomy in our Estate Gallery</span>
                    <span className="text-neutral-500 font-bold text-[11px] uppercase tracking-[0.5em]">Live Service Monitoring Powered by AfroFeast Technology Suite</span>
                    <span className="text-[#D4AF37] font-black text-[11px] uppercase tracking-[0.6em] italic">Bespoke Catering and Private Chef Services available upon request • Dial Ext. 001</span>
                </div>
            ))}
        </div>
      </div>

      <style>{`
        @keyframes marquee { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
        .animate-marquee { animation: marquee 60s linear infinite; }
        .animate-fade-in { animation: fade-in 1s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .no-scrollbar::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  );
};
