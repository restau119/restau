
import React, { useState, useEffect } from 'react';
import { Clock, CheckCircle2, Play, Utensils, Star, Gift, Users, Calendar, Package, Home, Timer, AlertTriangle, CreditCard, Banknote, Truck, MapPin, ChefHat } from 'lucide-react';
import { Order, OrderStatus } from '../types';
import { CURRENCY } from '../constants';

const CountdownDisplay = ({ createdAt, maxEstimatedTime }: { createdAt: number, maxEstimatedTime: number }) => {
  const [timeLeft, setTimeLeft] = useState<number>(0);

  useEffect(() => {
    const calculateTime = () => {
      const targetTime = createdAt + (maxEstimatedTime * 60 * 1000);
      const remaining = Math.max(0, targetTime - Date.now());
      setTimeLeft(remaining);
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, [createdAt, maxEstimatedTime]);

  const minutes = Math.floor(timeLeft / 60000);
  const seconds = Math.floor((timeLeft % 60000) / 1000);
  const isUrgent = minutes < 5;

  return (
    <div className={`flex flex-col items-end gap-1 p-3 rounded-2xl border ${timeLeft === 0 ? 'bg-red-500/20 border-red-500 animate-pulse' : isUrgent ? 'bg-orange-500/10 border-orange-500/40' : 'bg-[#D4AF37]/10 border-[#D4AF37]/40'}`}>
       <div className="flex items-center gap-2">
         <Timer className={`w-3 h-3 ${timeLeft === 0 ? 'text-red-500' : 'text-[#D4AF37]'}`} />
         <span className={`text-[9px] font-black uppercase tracking-widest ${timeLeft === 0 ? 'text-red-500' : 'text-neutral-500'}`}>Remaining</span>
       </div>
       <span className={`text-2xl font-black font-mono tracking-tighter leading-none ${timeLeft === 0 ? 'text-red-500' : isUrgent ? 'text-orange-500' : 'text-[#D4AF37]'}`}>
         {timeLeft === 0 ? 'LATE' : `${minutes}:${seconds.toString().padStart(2, '0')}`}
       </span>
    </div>
  );
};

interface KitchenViewProps {
  orders: Order[];
  updateStatus: (orderId: string, status: OrderStatus) => void;
}

export const KitchenView: React.FC<KitchenViewProps> = ({ orders, updateStatus }) => {
  const activeOrders = orders.filter(o => o.status === 'pending' || o.status === 'preparing');

  const getDiningIcon = (opt: string) => {
    switch (opt) {
      case 'eat-in': return <Utensils className="w-4 h-4" />;
      case 'reservation': return <Calendar className="w-4 h-4" />;
      case 'pickup': return <Package className="w-4 h-4" />;
      case 'takeaway': return <Home className="w-4 h-4" />;
      case 'delivery': return <Truck className="w-4 h-4" />;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-[#e5e5e5] p-6 md:p-10 pt-24">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between mb-16 gap-8">
        <div>
          <h1 className="text-4xl serif font-bold gold-text-gradient flex items-center gap-4 uppercase italic tracking-tighter">Chef Command Hub</h1>
          <p className="text-neutral-500 font-light tracking-[0.3em] uppercase text-[9px] mt-2 italic">Precision Monitoring • Live Service Pulse</p>
        </div>
        <div className="flex gap-4">
          <div className="px-6 py-2 bg-white/5 rounded-full border border-white/10 text-xs font-bold uppercase tracking-widest text-neutral-500">
            Active Covers: <span className="text-white ml-2">{activeOrders.length}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 md:gap-10 max-w-7xl mx-auto">
        {activeOrders.map((order) => {
          const timeElapsedMins = Math.floor((Date.now() - order.createdAt) / 60000);
          const timeElapsedSecs = Math.floor(((Date.now() - order.createdAt) % 60000) / 1000);
          const isImmediate = order.diningOption === 'eat-in' || order.diningOption === 'takeaway';
          
          let elapsedColor = 'text-neutral-500';
          if (timeElapsedMins >= 15 && timeElapsedMins < 25) elapsedColor = 'text-orange-500';
          else if (timeElapsedMins >= 25) elapsedColor = 'text-red-500';

          return (
            <div key={order.id} className={`flex flex-col rounded-[2.5rem] overflow-hidden border transition-all ${order.status === 'preparing' ? 'bg-[#121212] border-[#D4AF37]/40 shadow-2xl' : 'bg-[#0d0d0d] border-white/5 shadow-lg'}`}>
              <div className={`p-8 flex justify-between items-start ${order.status === 'preparing' ? 'bg-[#D4AF37] text-black' : 'bg-white/5'}`}>
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2 mb-3">
                    <span className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest flex items-center gap-1.5 ${order.status === 'preparing' ? 'bg-black/10' : 'bg-[#D4AF37]/10 text-[#D4AF37]'}`}>
                      {getDiningIcon(order.diningOption)} {order.diningOption}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest flex items-center gap-1.5 ${order.isPaid ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'}`}>
                      {order.isPaid ? 'Paid' : 'Unpaid'}
                    </span>
                  </div>
                  <span className="text-3xl font-black italic serif tracking-tighter block mb-1">{order.customerName}</span>
                  <div className="flex items-center gap-4 mt-2">
                     <span className="text-[11px] font-black uppercase tracking-[0.2em] opacity-80 border border-white/20 px-3 py-1 rounded-lg">
                        {order.diningOption === 'delivery' ? 'ESTATE DELIVERY' : `Suite ${order.tableNumber}`}
                     </span>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-3">
                   {isImmediate && <CountdownDisplay createdAt={order.createdAt} maxEstimatedTime={order.maxEstimatedTime} />}
                   <div className="text-right">
                      <span className="text-[9px] font-black uppercase tracking-widest opacity-40 block">Time Elapsed</span>
                      <span className={`text-lg font-mono font-bold ${order.status === 'preparing' ? 'text-black' : elapsedColor}`}>
                        {timeElapsedMins}:{timeElapsedSecs.toString().padStart(2, '0')}
                      </span>
                   </div>
                </div>
              </div>

              <div className="flex-1 p-8 space-y-4">
                {order.diningOption === 'delivery' && (
                  <div className="p-4 bg-white/5 border border-white/10 rounded-2xl flex items-start gap-3 mb-2">
                    <MapPin className="w-5 h-5 text-[#D4AF37] shrink-0" />
                    <div>
                      <p className="text-[9px] font-black text-[#D4AF37] uppercase tracking-widest mb-1">Residence Address</p>
                      <p className="text-[11px] text-neutral-300 italic font-medium leading-tight">{order.deliveryAddress}</p>
                    </div>
                  </div>
                )}

                <div className="flex flex-wrap gap-2 mb-2">
                  <div className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-neutral-500 border border-white/5 px-3 py-1.5 rounded-full">
                    {order.paymentMethod === 'mobile_money' ? <CreditCard className="w-3 h-3" /> : <Banknote className="w-3 h-3" />}
                    {order.paymentMethod.replace('_', ' ')}
                  </div>
                  {order.depositAmount && order.depositAmount > 0 && (
                    <div className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-[#D4AF37] border border-[#D4AF37]/20 px-3 py-1.5 rounded-full">
                      50% Deposit Paid
                    </div>
                  )}
                </div>

                {order.specialInstructions && (
                  <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-2xl flex items-start gap-3 mb-4 animate-pulse">
                    <AlertTriangle className="w-5 h-5 text-red-500 shrink-0" />
                    <div className="text-left">
                      <p className="text-[9px] font-black text-red-500 uppercase tracking-widest mb-1">Special Instruction</p>
                      <p className="text-[11px] text-red-200 italic font-bold leading-tight">{order.specialInstructions}</p>
                    </div>
                  </div>
                )}

                <div className="space-y-3">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="pb-3 border-b border-white/5 last:border-0">
                      <div className="flex justify-between items-center mb-1">
                        <h4 className="font-bold text-lg serif italic tracking-tight">{item.name}</h4>
                        <span className="text-[9px] font-black text-neutral-600">{item.estimatedTime}M</span>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {item.modifiers.map(m => (
                          <span key={m.id} className={`text-[8px] font-black uppercase px-2 py-0.5 rounded-full border ${m.type === 'remove' ? 'border-red-500/40 text-red-400 bg-red-500/5' : 'border-[#D4AF37]/40 text-[#D4AF37]/80 bg-[#D4AF37]/5'}`}>
                            {m.type === 'remove' ? 'NO ' : '+ '}{m.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-6 pt-0">
                <button onClick={() => updateStatus(order.id, order.status === 'pending' ? 'preparing' : 'ready')} className={`w-full py-5 rounded-full font-black text-[10px] uppercase tracking-[0.4em] transition-all flex items-center justify-center gap-4 ${order.status === 'pending' ? 'bg-white text-black hover:bg-[#D4AF37]' : 'bg-[#D4AF37] text-black shadow-lg hover:scale-[1.01]'}`}>
                  {order.status === 'pending' ? <><Play className="w-4 h-4 fill-current" /> Initialize Prep</> : <><CheckCircle2 className="w-4 h-4" /> Ready for Logistics</>}
                </button>
              </div>
            </div>
          );
        })}
        {activeOrders.length === 0 && (
          <div className="col-span-full py-20 flex flex-col items-center gap-6 opacity-20">
             <ChefHat className="w-20 h-20" />
             <p className="text-2xl serif italic">Gallery Kitchen Standing By...</p>
          </div>
        )}
      </div>
    </div>
  );
};
