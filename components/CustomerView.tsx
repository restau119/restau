
import React, { useState, useMemo, useEffect } from 'react';
import { X, Check, Utensils, Clock, Gift, User, Star, Calendar, Users, Package, Home, ChevronRight, ChevronLeft, Minus, Plus, MessageSquare, Info, MapPin, CreditCard, Banknote, ShieldAlert, Heart, Truck, PhoneCall, Headphones, Sparkles } from 'lucide-react';
import { MenuItem, OrderItem, Modifier, Chef, DiningOption, EventType, PaymentMethod, EstateSettings } from '../types';
import { CURRENCY, GIFTS, EVENT_TYPES } from '../constants';

interface CustomerViewProps {
  tableNumber: string;
  onPlaceOrder: (items: OrderItem[], customerName: string, chefName: string, gift: string, diningOption: DiningOption, guestCount?: number, reservationDate?: string, reservationTime?: string, eventType?: EventType, specialInstructions?: string, paymentMethod?: PaymentMethod, depositAmount?: number, isPaid?: boolean, deliveryAddress?: string) => void;
  menu: MenuItem[];
  chefs: Chef[];
  settings: EstateSettings;
}

type OrderStep = 'MODE_SELECTION' | 'SCHEDULING' | 'STARTERS' | 'MAINS' | 'DRINKS' | 'SIDES' | 'CONFIRMATION' | 'PAYMENT';

export const CustomerView: React.FC<CustomerViewProps> = ({ tableNumber, onPlaceOrder, menu, chefs, settings }) => {
  const [step, setStep] = useState<OrderStep>('MODE_SELECTION');
  const [cart, setCart] = useState<OrderItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [activeModifiers, setActiveModifiers] = useState<Modifier[]>([]);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  
  const [diningOption, setDiningOption] = useState<DiningOption | null>(null);
  const [customerName, setCustomerName] = useState("");
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [selectedChef, setSelectedChef] = useState<Chef>(chefs[0] || { id: '', name: 'Chef', specialty: '', avatar: '' });
  const [guestCount, setGuestCount] = useState(1);
  const [reservationDate, setReservationDate] = useState("");
  const [reservationTime, setReservationTime] = useState("");
  const [eventType, setEventType] = useState<EventType>('standard');
  const [specialInstructions, setSpecialInstructions] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('none');
  const [unlockedGift, setUnlockedGift] = useState("");
  const [showGiftModal, setShowGiftModal] = useState(false);
  const [showAdviceModal, setShowAdviceModal] = useState(false);

  const steps: OrderStep[] = ['STARTERS', 'MAINS', 'DRINKS', 'SIDES'];
  const stepLabels: Record<OrderStep, string> = {
    'MODE_SELECTION': 'Experience',
    'SCHEDULING': 'Logistics',
    'STARTERS': 'Beginnings',
    'MAINS': 'Signatures',
    'DRINKS': 'Elixirs',
    'SIDES': 'Accompaniments',
    'CONFIRMATION': 'Review',
    'PAYMENT': 'Checkout'
  };

  const currentDayName = useMemo(() => {
    return new Intl.DateTimeFormat('en-US', { weekday: 'long' }).format(new Date());
  }, []);

  const dailyOffers = useMemo(() => {
    return settings.specialOffers.filter(o => o.day === currentDayName && o.isActive);
  }, [settings.specialOffers, currentDayName]);

  const isMenuStep = steps.includes(step);
  const cartTotal = useMemo(() => cart.reduce((acc, item) => acc + item.totalPrice, 0), [cart]);
  const depositAmount = diningOption === 'reservation' ? cartTotal * 0.5 : 0;

  const currentCategory = useMemo(() => {
    if (step === 'STARTERS') return 'Starters';
    if (step === 'MAINS') return 'Main Dishes';
    if (step === 'DRINKS') return 'Drinks';
    if (step === 'SIDES') return 'Sides';
    return '';
  }, [step]);

  const filteredMenu = useMemo(() => {
    return menu.filter(item => 
      diningOption && 
      item.allowedOptions.includes(diningOption) && 
      item.category === currentCategory
    );
  }, [diningOption, currentCategory, menu]);

  const handleSelectItem = (item: MenuItem) => {
    setSelectedItem(item);
    setActiveModifiers([]);
  };

  const confirmItemSelection = () => {
    if (!selectedItem) return;
    const newItem: OrderItem = {
      id: Math.random().toString(36).substr(2, 9),
      menuItemId: selectedItem.id,
      name: selectedItem.name,
      basePrice: selectedItem.price,
      modifiers: [...activeModifiers],
      totalPrice: selectedItem.price + activeModifiers.reduce((acc, m) => acc + m.price, 0),
      estimatedTime: selectedItem.estimatedTime
    };
    setCart([...cart, newItem]);
    setSelectedItem(null);
  };

  const removeFromCart = (itemId: string) => {
    setCart(prev => prev.filter(i => i.id !== itemId));
  };

  const nextStep = () => {
    if (step === 'STARTERS') setStep('MAINS');
    else if (step === 'MAINS') setStep('DRINKS');
    else if (step === 'DRINKS') setStep('SIDES');
    else if (step === 'SIDES') setStep('CONFIRMATION');
    else if (step === 'CONFIRMATION') setStep('PAYMENT');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const prevStep = () => {
    if (step === 'PAYMENT') setStep('CONFIRMATION');
    else if (step === 'CONFIRMATION') setStep('SIDES');
    else if (step === 'SIDES') setStep('DRINKS');
    else if (step === 'DRINKS') setStep('MAINS');
    else if (step === 'MAINS') setStep('STARTERS');
    else if (step === 'STARTERS') setStep(diningOption === 'reservation' || diningOption === 'pickup' || diningOption === 'delivery' ? 'SCHEDULING' : 'MODE_SELECTION');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePlaceOrderFinal = () => {
    setIsProcessingPayment(true);
    setTimeout(() => {
      const gift = GIFTS[Math.floor(Math.random() * GIFTS.length)];
      setUnlockedGift(gift);
      const isPaid = paymentMethod === 'mobile_money' && (diningOption === 'reservation' || diningOption === 'pickup' || diningOption === 'delivery');
      onPlaceOrder(cart, customerName, selectedChef.name, gift, diningOption!, guestCount, reservationDate, reservationTime, eventType, specialInstructions, paymentMethod, depositAmount, isPaid, deliveryAddress);
      setIsProcessingPayment(false);
      setShowGiftModal(true);
    }, 2500);
  };

  const AdviceButton = () => (
    <button 
      onClick={() => setShowAdviceModal(true)}
      className="fixed bottom-24 right-6 z-[80] w-14 h-14 bg-[#D4AF37] text-black rounded-full shadow-[0_10px_30px_rgba(212,175,55,0.4)] flex items-center justify-center animate-bounce hover:scale-110 active:scale-95 transition-all"
    >
      <Headphones className="w-6 h-6" />
    </button>
  );

  if (step === 'MODE_SELECTION') {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-start overflow-y-auto pb-10">
        <AdviceButton />
        <div className="w-full h-[60vh] md:h-[65vh] relative overflow-hidden">
          <img src="https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1920&q=90" className="w-full h-full object-cover opacity-70 scale-105 animate-pulse" style={{ animationDuration: '10s' }} />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/30 to-transparent"></div>
          <div className="absolute bottom-0 left-0 w-full p-8 md:p-12 text-center">
            <h1 className="text-6xl md:text-8xl font-black italic tracking-tighter gold-text-gradient mb-4 drop-shadow-2xl">AfroFeast</h1>
            <p className="text-[10px] md:text-[12px] uppercase tracking-[0.6em] md:tracking-[1em] text-neutral-400 font-bold mb-8">Culinary Mastery • Royal Heritage</p>
            <div className="inline-flex items-center gap-4 px-6 py-2 bg-white/5 backdrop-blur-2xl rounded-full border border-white/10 text-[10px] md:text-[11px] font-black uppercase tracking-widest text-[#D4AF37]">
              <MapPin className="w-4 h-4" /> Guest Suite {tableNumber}
            </div>
          </div>
        </div>

        {dailyOffers.length > 0 && (
          <div className="w-full max-w-5xl px-6 -mt-8 mb-8 z-10 animate-fade-in">
             <div className="bg-[#D4AF37]/10 border border-[#D4AF37]/30 rounded-[2rem] p-6 flex flex-col gap-2 overflow-hidden relative">
                <div className="flex items-center gap-2 mb-2">
                   <Sparkles className="w-4 h-4 text-[#D4AF37]" />
                   <span className="text-[9px] font-black uppercase tracking-widest text-[#D4AF37]">Estate Highlights Today</span>
                </div>
                {dailyOffers.map(offer => (
                   <div key={offer.id} className="animate-fade-in">
                      <h4 className="text-xl serif italic font-bold text-white">{offer.title}</h4>
                      <p className="text-xs text-neutral-400 italic mt-1">{offer.description}</p>
                   </div>
                ))}
             </div>
          </div>
        )}

        <div className="max-w-5xl w-full px-6 -mt-10 md:-mt-16 pb-24 z-10 grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 animate-fade-in">
          {[
            { id: 'eat-in', title: 'Dine In-Suite', desc: 'Personal service at your table', icon: <Utensils className="w-7 h-7" /> },
            { id: 'delivery', title: 'Royal Delivery', desc: 'Grand delivery to your residence', icon: <Truck className="w-7 h-7" /> },
            { id: 'reservation', title: 'Bespoke Event', desc: 'Plan a future grand banquet', icon: <Calendar className="w-7 h-7" /> },
            { id: 'pickup', title: 'Executive Pickup', desc: 'Gourmet collection scheduled', icon: <Package className="w-7 h-7" /> },
            { id: 'takeaway', title: 'Instant Take-away', desc: 'Prepared for transport now', icon: <Home className="w-7 h-7" /> },
          ].map((opt) => (
            <button key={opt.id} onClick={() => { setDiningOption(opt.id as DiningOption); setStep(opt.id === 'reservation' || opt.id === 'pickup' || opt.id === 'delivery' ? 'SCHEDULING' : 'STARTERS'); }} className="group p-8 md:p-10 bg-[#0d0d0d] border border-white/10 rounded-[2.5rem] md:rounded-[3rem] flex items-center gap-6 md:gap-8 text-left transition-all hover:bg-[#D4AF37]/5 hover:border-[#D4AF37]/40 shadow-2xl">
              <div className="p-5 md:p-6 bg-neutral-900 rounded-2xl md:rounded-3xl border border-white/5 text-[#D4AF37] group-hover:scale-110 transition-transform shrink-0">{opt.icon}</div>
              <div>
                <h3 className="text-xl md:text-2xl serif font-bold text-white mb-1 md:mb-2">{opt.title}</h3>
                <p className="text-xs md:text-sm text-neutral-500 italic font-light leading-relaxed">{opt.desc}</p>
              </div>
            </button>
          ))}
        </div>

        {showAdviceModal && (
          <div className="fixed inset-0 z-[200] flex items-end md:items-center justify-center p-0 md:p-6 bg-black/90 backdrop-blur-xl animate-fade-in">
            <div className="w-full max-lg bg-[#0d0d0d] rounded-t-[3rem] md:rounded-[3rem] border-t md:border border-white/10 p-10 md:p-12 shadow-2xl relative">
              <button onClick={() => setShowAdviceModal(false)} className="absolute top-8 right-8 text-neutral-500 hover:text-white"><X className="w-6 h-6" /></button>
              <div className="w-16 h-1 bg-white/10 rounded-full mx-auto mb-10 md:hidden"></div>
              <Headphones className="w-12 h-12 text-[#D4AF37] mb-6" />
              <h2 className="text-4xl serif italic font-bold text-white mb-4">Royal Concierge</h2>
              <p className="text-neutral-500 text-sm italic mb-10 leading-relaxed">Seek wisdom from our Head Sommelier or Maître d' for the perfect pairings and heritage selections.</p>
              
              <div className="space-y-4 mb-10">
                <a href={`tel:${settings.contactNumber}`} className="flex items-center justify-between p-6 bg-white/5 rounded-3xl border border-white/10 hover:border-[#D4AF37] transition-all group">
                  <div className="flex items-center gap-4">
                    <PhoneCall className="w-5 h-5 text-[#D4AF37]" />
                    <div>
                      <p className="text-[10px] uppercase tracking-widest text-[#D4AF37] font-black">Direct Line</p>
                      <p className="text-xl font-bold text-white">{settings.contactNumber}</p>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-neutral-700 group-hover:text-white transition-all" />
                </a>
              </div>
              <button onClick={() => setShowAdviceModal(false)} className="w-full py-5 bg-white text-black font-black uppercase tracking-[0.4em] text-[10px] rounded-full">Return to Menu</button>
            </div>
          </div>
        )}
      </div>
    );
  }

  if (step === 'SCHEDULING') {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-start p-6 md:p-8 pt-24 md:pt-32">
        <AdviceButton />
        <div className="max-w-3xl w-full animate-fade-in">
          <button onClick={() => setStep('MODE_SELECTION')} className="mb-6 md:mb-8 flex items-center gap-2 text-neutral-500 hover:text-white uppercase text-[10px] font-black tracking-widest"><ChevronLeft className="w-4 h-4" /> Back</button>
          <h2 className="text-4xl md:text-5xl serif italic font-bold mb-8 gold-text-gradient">{diningOption === 'delivery' ? 'Delivery Details' : 'Secure your session'}</h2>
          
          <div className="bg-[#0d0d0d] border border-white/10 rounded-[3rem] p-8 md:p-10 space-y-8 md:space-y-10">
            {diningOption === 'delivery' && (
              <div className="space-y-4">
                <label className="text-[10px] uppercase tracking-[0.4em] text-[#D4AF37] font-black">Residence Address</label>
                <textarea 
                  placeholder="Street, Estate Gate, Building No..." 
                  value={deliveryAddress} 
                  onChange={(e) => setDeliveryAddress(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white outline-none focus:border-[#D4AF37] min-h-[100px] italic"
                />
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
              <div className="space-y-4">
                <label className="text-[10px] uppercase tracking-[0.4em] text-[#D4AF37] font-black">{diningOption === 'delivery' ? 'Requested Date' : 'Date Selection'}</label>
                <input type="date" className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white outline-none focus:border-[#D4AF37]" value={reservationDate} onChange={(e) => setReservationDate(e.target.value)} />
              </div>
              <div className="space-y-4">
                <label className="text-[10px] uppercase tracking-[0.4em] text-[#D4AF37] font-black">{diningOption === 'delivery' ? 'Requested Time' : 'Arrival Time'}</label>
                <input type="time" className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white outline-none focus:border-[#D4AF37]" value={reservationTime} onChange={(e) => setReservationTime(e.target.value)} />
              </div>
            </div>

            <button 
              onClick={() => setStep('STARTERS')} 
              disabled={!reservationDate || !reservationTime || (diningOption === 'delivery' && !deliveryAddress)} 
              className="w-full py-6 md:py-7 gold-gradient text-black font-black uppercase tracking-[0.4em] rounded-full shadow-2xl transition-all hover:scale-[1.02] disabled:opacity-30 text-[11px]"
            >
              Curate Your Menu <ChevronRight className="w-5 h-5 ml-2 inline-block" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (isMenuStep) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-[#e5e5e5] pt-20 md:pt-24 pb-40">
        <AdviceButton />
        <div className="max-w-5xl mx-auto px-6 md:px-10 mb-8 md:mb-12">
          <div className="flex justify-between items-center mb-6 md:mb-8">
            <button onClick={prevStep} className="p-3 bg-white/5 rounded-full hover:bg-white/10 transition-colors"><ChevronLeft className="w-5 h-5" /></button>
            <div className="text-center">
              <h2 className="text-2xl md:text-3xl serif font-bold italic gold-text-gradient">{stepLabels[step]}</h2>
              <p className="text-[8px] md:text-[9px] uppercase tracking-[0.5em] text-neutral-500 mt-1">Concierge Selection</p>
            </div>
            <div className="w-10"></div>
          </div>
          <div className="flex gap-2 h-1 bg-white/5 rounded-full overflow-hidden">
            {steps.map((s, idx) => (
              <div key={s} className={`flex-1 transition-all duration-1000 ${steps.indexOf(step) >= idx ? 'bg-[#D4AF37]' : 'bg-transparent'}`}></div>
            ))}
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-6 md:px-10 grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
          {filteredMenu.map((item) => {
            const itemCount = cart.filter(i => i.menuItemId === item.id).length;
            return (
              <div key={item.id} onClick={() => handleSelectItem(item)} className="group bg-[#0d0d0d] border border-white/10 rounded-[2.5rem] md:rounded-[3rem] p-6 md:p-8 flex items-center gap-6 md:gap-8 cursor-pointer transition-all hover:border-[#D4AF37]/30 hover:bg-[#121212] animate-fade-in shadow-xl active:scale-[0.98]">
                <div className="w-28 h-28 md:w-36 md:h-36 flex-shrink-0 relative">
                  <img src={item.image} className="w-full h-full object-cover rounded-full shadow-2xl transition-transform duration-700 group-hover:scale-110" />
                  {itemCount > 0 && <div className="absolute -top-1 -right-1 bg-[#D4AF37] text-black text-[10px] md:text-[11px] font-black w-6 h-6 md:w-7 md:h-7 flex items-center justify-center rounded-full border-2 border-black animate-bounce">{itemCount}</div>}
                </div>
                <div className="flex-1">
                  <h3 className="text-lg md:text-2xl serif font-bold leading-tight mb-1 md:mb-2">{item.name}</h3>
                  <p className="text-neutral-500 text-[10px] md:text-sm italic font-light line-clamp-2 leading-relaxed mb-3 md:mb-4">{item.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm md:text-lg font-light text-[#D4AF37]">{item.price.toLocaleString()} {CURRENCY}</span>
                    <div className="flex items-center gap-2 text-[8px] md:text-[9px] uppercase tracking-widest font-black text-neutral-600">
                      <Clock className="w-3 h-3" /> {item.estimatedTime}M
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="fixed bottom-0 left-0 right-0 p-6 md:p-8 bg-black/60 backdrop-blur-3xl border-t border-white/5 z-50">
          <div className="max-w-5xl mx-auto flex items-center justify-between">
            <div className="hidden sm:block">
              <span className="text-[10px] uppercase tracking-widest text-neutral-500 block mb-1">Current Estate Check</span>
              <span className="text-3xl font-light text-[#D4AF37]">{cartTotal.toLocaleString()} {CURRENCY}</span>
            </div>
            <button onClick={nextStep} className="w-full md:w-auto px-10 md:px-12 py-5 md:py-6 gold-gradient text-black font-black uppercase tracking-[0.3em] rounded-full shadow-2xl transition-all hover:scale-[1.05] active:scale-95 flex items-center justify-center gap-4 text-[10px] md:text-[11px]">
              {step === 'SIDES' ? 'Finalize Selections' : `Next: ${stepLabels[steps[steps.indexOf(step) + 1]]}`} <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {selectedItem && (
          <div className="fixed inset-0 z-[120] flex items-center justify-center p-0 md:p-6 bg-black/98 backdrop-blur-xl">
            <div className="w-full max-w-5xl bg-[#0d0d0d] md:rounded-[4rem] border-t md:border border-white/10 flex flex-col md:flex-row overflow-hidden animate-fade-in shadow-2xl h-full md:h-auto">
              <div className="md:w-1/2 h-48 md:h-auto relative">
                <img src={selectedItem.image} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0d0d0d] to-transparent"></div>
                <button onClick={() => setSelectedItem(null)} className="absolute top-6 right-6 text-white bg-black/50 p-2 rounded-full md:hidden"><X className="w-6 h-6" /></button>
              </div>
              <div className="md:w-1/2 p-8 md:p-12 overflow-y-auto flex-1">
                <button onClick={() => setSelectedItem(null)} className="absolute top-8 right-8 text-neutral-500 hover:text-white hidden md:block"><X className="w-8 h-8" /></button>
                <h4 className="text-[9px] md:text-[10px] uppercase tracking-[0.4em] text-[#D4AF37] mb-3 font-black">AfroFeast Collection</h4>
                <h2 className="text-3xl md:text-5xl serif font-bold mb-6 italic">{selectedItem.name}</h2>
                <div className="mb-6 md:mb-8 p-5 md:p-6 bg-white/[0.03] rounded-3xl border border-white/5">
                   <h5 className="flex items-center gap-2 text-[9px] md:text-[10px] font-black uppercase tracking-widest text-[#D4AF37] mb-4"><Info className="w-3 h-3" /> Heritage Ingredients</h5>
                   <ul className="grid grid-cols-2 gap-x-4 gap-y-2">
                     {selectedItem.ingredients.map((ing, i) => (
                       <li key={i} className="text-[10px] md:text-[11px] text-neutral-400 font-light flex items-center gap-2 italic">
                         <div className="w-1 h-1 rounded-full bg-[#D4AF37]/40"></div> {ing}
                       </li>
                     ))}
                   </ul>
                </div>
                <div className="space-y-3 mb-10 md:mb-12">
                  <h5 className="text-[9px] md:text-[10px] uppercase tracking-widest font-black text-neutral-500 border-b border-white/5 pb-2">Personalize Palate</h5>
                  {selectedItem.availableModifiers.map(mod => {
                    const active = activeModifiers.some(m => m.id === mod.id);
                    return (
                      <button key={mod.id} onClick={() => setActiveModifiers(prev => active ? prev.filter(m => m.id !== mod.id) : [...prev, mod])} className={`w-full flex justify-between items-center p-4 md:p-5 rounded-2xl border transition-all ${active ? 'bg-[#D4AF37]/10 border-[#D4AF37] text-[#D4AF37]' : 'bg-white/5 border-white/10 text-neutral-400'}`}>
                        <div className="flex items-center gap-3">
                          <div className={`w-4 h-4 md:w-5 md:h-5 rounded-full border flex items-center justify-center ${active ? 'bg-[#D4AF37] border-black' : 'border-neutral-700'}`}>{active && <Check className="w-3 h-3 text-black" />}</div>
                          <span className="text-xs md:text-sm font-bold">{mod.name}</span>
                        </div>
                        <span className="text-[10px] md:text-xs font-light">{mod.type === 'extra' ? `+ ${mod.price}` : 'Gratis'}</span>
                      </button>
                    );
                  })}
                </div>
                <div className="flex items-center justify-between mt-auto">
                   <span className="text-2xl md:text-3xl font-light text-[#D4AF37]">{(selectedItem.price + activeModifiers.reduce((acc, m) => acc + m.price, 0)).toLocaleString()} {CURRENCY}</span>
                   <button onClick={confirmItemSelection} className="px-8 md:px-10 py-4 md:py-5 bg-[#D4AF37] text-black font-black uppercase tracking-[0.2em] rounded-full hover:scale-105 active:scale-95 transition-all text-[10px] md:text-[12px]">Add to Cart</button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  if (step === 'CONFIRMATION') {
    return (
      <div className="min-h-screen bg-[#0a0a0a] pt-24 pb-40 px-6 md:px-10">
        <AdviceButton />
        <div className="max-w-5xl mx-auto animate-fade-in">
          <div className="flex items-center justify-between mb-12 md:mb-16">
            <button onClick={prevStep} className="p-3 bg-white/5 rounded-full hover:bg-white/10 transition-colors"><ChevronLeft className="w-6 h-6" /></button>
            <div className="text-center">
              <h2 className="text-3xl md:text-5xl serif font-bold italic gold-text-gradient">Review Details</h2>
              <p className="text-[8px] md:text-[10px] uppercase tracking-[0.4em] md:tracking-[0.5em] text-neutral-500 mt-2">Bespoke Concierge Register</p>
            </div>
            <div className="w-6"></div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-12 mb-16">
            <div className="lg:col-span-2 space-y-8 md:space-y-10">
               <div className="bg-[#0d0d0d] border border-white/10 rounded-[2.5rem] md:rounded-[3rem] p-8 md:p-10 space-y-6 md:space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                    <div className="space-y-4">
                      <label className="text-[9px] md:text-[10px] uppercase tracking-[0.5em] text-[#D4AF37] font-black flex items-center gap-2"><User className="w-3 h-3" /> Guest Identity</label>
                      <input type="text" placeholder="Your Name" value={customerName} onChange={(e) => setCustomerName(e.target.value)} className="w-full bg-white/[0.03] border border-white/10 rounded-[1.5rem] md:rounded-[2rem] px-6 md:px-8 py-5 md:py-6 text-lg md:text-xl serif italic text-white focus:border-[#D4AF37] outline-none" />
                    </div>
                    <div className="space-y-4">
                      <label className="text-[9px] md:text-[10px] uppercase tracking-[0.5em] text-[#D4AF37] font-black flex items-center gap-2">
                        {diningOption === 'delivery' ? <Truck className="w-3 h-3" /> : <MapPin className="w-3 h-3" />}
                        {diningOption === 'delivery' ? 'Delivery Mode' : 'Table Designation'}
                      </label>
                      <div className="w-full bg-[#D4AF37]/10 border border-[#D4AF37]/40 rounded-[1.5rem] md:rounded-[2rem] px-6 md:px-8 py-5 md:py-6 text-lg md:text-xl serif italic text-[#D4AF37] font-bold">
                        {diningOption === 'delivery' ? 'Royal Residence Delivery' : `Suite ${tableNumber}`}
                      </div>
                    </div>
                  </div>
                  {diningOption === 'delivery' && (
                    <div className="space-y-4">
                      <label className="text-[9px] md:text-[10px] uppercase tracking-[0.5em] text-[#D4AF37] font-black flex items-center gap-2"><MapPin className="w-3 h-3" /> Residence Address</label>
                      <div className="w-full bg-white/[0.03] border border-white/10 rounded-[1.5rem] md:rounded-[2rem] px-6 md:px-8 py-5 md:py-6 text-sm italic text-white/60">{deliveryAddress || "Address required"}</div>
                    </div>
                  )}
                  <div className="space-y-4">
                    <label className="text-[9px] md:text-[10px] uppercase tracking-[0.5em] text-[#D4AF37] font-black flex items-center gap-2"><MessageSquare className="w-3 h-3" /> Concierge Notes</label>
                    <textarea placeholder="e.g. No Peanuts, spicy preference..." value={specialInstructions} onChange={(e) => setSpecialInstructions(e.target.value)} rows={3} className="w-full bg-white/[0.03] border border-white/10 rounded-[1.5rem] md:rounded-[2rem] px-6 md:px-8 py-5 md:py-6 text-sm italic text-white focus:border-[#D4AF37] outline-none resize-none" />
                  </div>
               </div>

               <div className="bg-[#0d0d0d] border border-white/10 rounded-[2.5rem] md:rounded-[3rem] p-8 md:p-10 space-y-6 md:space-y-8">
                  <div className="flex justify-between items-center border-b border-white/5 pb-6">
                    <h3 className="text-xl md:text-2xl serif font-bold italic text-white">Bespoke Selections</h3>
                    <button onClick={() => setStep('STARTERS')} className="text-[8px] md:text-[10px] font-black uppercase tracking-widest px-4 py-2 bg-white/5 rounded-full hover:bg-[#D4AF37] hover:text-black transition-all">+ Add Items</button>
                  </div>
                  <div className="space-y-6 md:space-y-8 max-h-[400px] overflow-y-auto no-scrollbar">
                    {cart.map(item => (
                      <div key={item.id} className="flex justify-between items-start animate-fade-in group">
                         <div className="flex-1">
                            <h4 className="text-xl md:text-2xl serif font-bold text-white group-hover:text-[#D4AF37] transition-colors">{item.name}</h4>
                            <div className="flex flex-wrap gap-2 mt-2 md:mt-3">
                               {item.modifiers.map(m => <span key={m.id} className="text-[8px] md:text-[9px] px-3 py-1 bg-white/5 border border-white/10 rounded-full text-neutral-500 font-black uppercase">{m.name}</span>)}
                            </div>
                            <button onClick={() => removeFromCart(item.id)} className="text-[8px] md:text-[9px] text-red-500/50 hover:text-red-500 uppercase font-black mt-4 block">Remove Selection</button>
                         </div>
                         <span className="text-lg md:text-xl font-light text-[#D4AF37] shrink-0 ml-4">{item.totalPrice.toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
               </div>
            </div>

            <div className="space-y-8 md:space-y-10">
               <div className="bg-[#0d0d0d] border border-white/10 rounded-[2.5rem] md:rounded-[3rem] p-8 space-y-6">
                  <label className="text-[9px] md:text-[10px] uppercase tracking-[0.5em] text-[#D4AF37] font-black">Lead Estate Chef</label>
                  <div className="space-y-3">
                    {chefs.map(chef => (
                      <button key={chef.id} onClick={() => setSelectedChef(chef)} className={`w-full p-4 rounded-3xl border transition-all flex items-center gap-4 ${selectedChef.id === chef.id ? 'bg-[#D4AF37]/10 border-[#D4AF37]' : 'bg-white/5 border-white/10 opacity-40 hover:opacity-100'}`}>
                        <img src={chef.avatar} className="w-10 h-10 md:w-12 md:h-12 rounded-full object-cover" />
                        <div className="text-left"><p className="text-xs font-black text-white">{chef.name}</p><p className="text-[8px] md:text-[9px] text-[#D4AF37] uppercase tracking-widest">{chef.specialty}</p></div>
                      </button>
                    ))}
                  </div>
               </div>
               <div className="bg-[#0d0d0d] border border-white/10 rounded-[2.5rem] md:rounded-[3rem] p-8 md:p-10 space-y-8 sticky top-24">
                  <div className="space-y-4">
                     <div className="flex justify-between items-baseline italic border-b border-white/5 pb-6">
                        <span className="text-neutral-500 text-sm">Grand Total</span>
                        <span className="text-3xl md:text-4xl font-black gold-text-gradient">{cartTotal.toLocaleString()} {CURRENCY}</span>
                     </div>
                  </div>
                  <button onClick={nextStep} disabled={cart.length === 0 || !customerName.trim()} className="w-full py-6 md:py-8 gold-gradient text-black font-black uppercase tracking-[0.4em] rounded-full shadow-2xl transition-all hover:scale-[1.05] active:scale-95 disabled:opacity-10 flex items-center justify-center gap-4 text-[10px] md:text-[11px]">Proceed to Payment <ChevronRight className="w-5 h-5" /></button>
               </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (step === 'PAYMENT') {
    const isReservation = diningOption === 'reservation';
    const isPickup = diningOption === 'pickup';
    const isDelivery = diningOption === 'delivery';
    const isImmediate = diningOption === 'eat-in' || diningOption === 'takeaway';

    return (
      <div className="min-h-screen bg-[#0a0a0a] pt-24 md:pt-32 pb-40 px-6 md:px-10 flex flex-col items-center">
        <AdviceButton />
        <div className="max-w-2xl w-full animate-fade-in text-center">
          <button onClick={prevStep} className="mb-8 md:mb-12 flex items-center gap-2 text-neutral-500 hover:text-white uppercase text-[10px] font-black tracking-widest mx-auto"><ChevronLeft className="w-4 h-4" /> Back to Review</button>
          
          <div className="bg-[#D4AF37]/10 p-4 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-8 border border-[#D4AF37]/20 shadow-[0_0_50px_rgba(212,175,55,0.1)]">
            <CreditCard className="w-10 h-10 text-[#D4AF37]" />
          </div>
          
          <h2 className="text-4xl md:text-5xl serif italic font-bold italic gold-text-gradient mb-4">Secure Checkout</h2>
          <p className="text-neutral-500 text-[10px] md:text-sm italic font-light mb-10 md:mb-12 uppercase tracking-widest">Select Method for Suite {isDelivery ? "Residence" : tableNumber}</p>

          <div className="bg-[#0d0d0d] border border-white/10 rounded-[2.5rem] md:rounded-[3rem] p-8 md:p-12 space-y-10 md:space-y-12 text-left shadow-2xl">
            <div className="flex justify-between items-baseline border-b border-white/10 pb-8">
              <span className="text-neutral-400 font-light">Amount Due Today</span>
              <span className="text-4xl md:text-5xl font-black gold-text-gradient">{(isReservation ? depositAmount : cartTotal).toLocaleString()} {CURRENCY}</span>
            </div>

            {(isReservation || isDelivery) && (
              <div className="flex items-start gap-4 p-5 md:p-6 bg-orange-500/10 border border-orange-500/20 rounded-[2rem]">
                <ShieldAlert className="w-6 h-6 text-[#D4AF37] shrink-0" />
                <div className="text-[10px] md:text-xs text-neutral-400 italic">
                  <span className="text-[#D4AF37] font-black uppercase block mb-1">Estate Settlement Policy</span>
                  {isReservation ? `A 50% deposit of ${depositAmount.toLocaleString()} is required.` : 'All deliveries require upfront Mobile Money payment for residence safety.'}
                </div>
              </div>
            )}

            <div className="space-y-4">
              <label className="text-[9px] md:text-[10px] uppercase tracking-[0.5em] text-[#D4AF37] font-black block mb-4">Select Payment Method</label>
              
              <button 
                onClick={() => setPaymentMethod('mobile_money')}
                className={`w-full flex items-center justify-between p-6 md:p-8 rounded-[1.5rem] md:rounded-[2rem] border transition-all ${paymentMethod === 'mobile_money' ? 'bg-[#D4AF37]/10 border-[#D4AF37] text-[#D4AF37]' : 'bg-white/5 border-white/10 text-neutral-400 hover:bg-white/10'}`}
              >
                <div className="flex items-center gap-4 md:gap-6">
                  <div className="p-3 md:p-4 bg-neutral-900 rounded-2xl shrink-0"><CreditCard className="w-5 h-5 md:w-6 md:h-6" /></div>
                  <div className="text-left">
                    <h4 className="text-lg md:text-xl font-bold">Mobile Money</h4>
                    <p className="text-[8px] md:text-[10px] uppercase tracking-widest opacity-60">Orange / MTN / Moov Pay</p>
                  </div>
                </div>
                {paymentMethod === 'mobile_money' && <Check className="w-5 h-5 md:w-6 md:h-6" />}
              </button>

              {isImmediate && !isDelivery && (
                <button 
                  onClick={() => setPaymentMethod('banknotes')}
                  className={`w-full flex items-center justify-between p-6 md:p-8 rounded-[1.5rem] md:rounded-[2rem] border transition-all ${paymentMethod === 'banknotes' ? 'bg-[#D4AF37]/10 border-[#D4AF37] text-[#D4AF37]' : 'bg-white/5 border-white/10 text-neutral-400 hover:bg-white/10'}`}
                >
                  <div className="flex items-center gap-4 md:gap-6">
                    <div className="p-3 md:p-4 bg-neutral-900 rounded-2xl shrink-0"><Banknote className="w-5 h-5 md:w-6 md:h-6" /></div>
                    <div className="text-left">
                      <h4 className="text-lg md:text-xl font-bold">Banknotes</h4>
                      <p className="text-[8px] md:text-[10px] uppercase tracking-widest opacity-60">Cash Payment at Table</p>
                    </div>
                  </div>
                  {paymentMethod === 'banknotes' && <Check className="w-5 h-5 md:w-6 md:h-6" />}
                </button>
              )}
            </div>

            <button 
              onClick={handlePlaceOrderFinal}
              disabled={paymentMethod === 'none' || isProcessingPayment}
              className="w-full py-6 md:py-8 gold-gradient text-black font-black uppercase tracking-[0.4em] rounded-full shadow-2xl transition-all hover:scale-[1.05] active:scale-95 disabled:opacity-20 flex items-center justify-center gap-4 text-[10px] md:text-[11px]"
            >
              {isProcessingPayment ? <div className="w-6 h-6 border-4 border-black/20 border-t-black rounded-full animate-spin"></div> : <>Finalize Royal Order</>}
            </button>
          </div>
        </div>

        {showGiftModal && (
          <div className="fixed inset-0 z-[300] flex items-center justify-center p-6 md:p-8 bg-black/98 backdrop-blur-3xl">
            <div className="max-w-xl w-full bg-[#0d0d0d] rounded-[3rem] md:rounded-[4rem] p-10 md:p-16 text-center border border-[#D4AF37]/20 shadow-2xl animate-fade-in relative">
              <div className="w-24 h-24 md:w-32 md:h-32 bg-[#D4AF37]/10 rounded-full flex items-center justify-center mx-auto mb-8 md:mb-10 border border-[#D4AF37]/30">
                <Gift className="w-10 h-10 md:w-12 md:h-12 text-[#D4AF37] animate-bounce" />
              </div>
              <h2 className="text-3xl md:text-4xl serif italic font-bold mb-6 text-white uppercase tracking-tighter">Imperial Confirmation</h2>
              <p className="text-neutral-500 text-sm md:text-lg font-light mb-10 md:mb-12 italic leading-relaxed">Your journey through AfroFeast heritage has begun. We are pleased to offer you:</p>
              <div className="p-6 md:p-8 bg-[#D4AF37]/10 rounded-[2.5rem] md:rounded-[3rem] border border-[#D4AF37]/40 mb-10 md:mb-12 shadow-[0_0_50px_rgba(212,175,55,0.1)]">
                <span className="text-xl md:text-2xl font-bold italic gold-text-gradient tracking-tight">{unlockedGift}</span>
              </div>
              <button 
                onClick={() => { setShowGiftModal(false); setStep('MODE_SELECTION'); setDiningOption(null); setCart([]); setSpecialInstructions(""); setPaymentMethod('none'); setDeliveryAddress(""); }} 
                className="w-full py-5 md:py-6 bg-[#D4AF37] text-black font-black uppercase tracking-[0.4em] text-[10px] md:text-[11px] rounded-full shadow-2xl transition-all hover:brightness-110"
              >
                Return to Entrance
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  return null;
};
