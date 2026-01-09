
import React, { useState, useCallback } from 'react';
import { AppView, Order, OrderItem, OrderStatus, DiningOption, EventType, PaymentMethod, MenuItem, Chef, EstateSettings, Modifier } from './types.ts';
import { ViewSwitcher } from './components/ViewSwitcher.tsx';
import { CustomerView } from './components/CustomerView.tsx';
import { KitchenView } from './components/KitchenView.tsx';
import { PublicStatusView } from './components/PublicStatusView.tsx';
import { AdminView } from './components/AdminView.tsx';
import { StaffAccessGate } from './components/StaffAccessGate.tsx';
import { MENU as INITIAL_MENU, CHEFS as INITIAL_CHEFS, ESTATE_CONTACT, MODIFIERS as INITIAL_MODIFIERS } from './constants.tsx';

const INITIAL_ORDERS: Order[] = [
  {
    id: 'ord_demo',
    tableNumber: '05',
    customerName: 'Madame Solange',
    chefName: 'Chef Fatou',
    status: 'preparing',
    createdAt: Date.now() - 300000,
    totalAmount: 25000,
    diningOption: 'eat-in',
    maxEstimatedTime: 25,
    specialInstructions: "No spicy peppers, please. Extremely allergic.",
    paymentMethod: 'banknotes',
    isPaid: false,
    items: [
      {
        id: 'oi_demo_1',
        menuItemId: '1',
        name: 'Heritage Jollof Rice',
        basePrice: 8500,
        modifiers: [],
        totalPrice: 8500,
        estimatedTime: 25
      }
    ]
  }
];

const INITIAL_SETTINGS: EstateSettings = {
  contactNumber: ESTATE_CONTACT,
  mobileMoneyDetails: "Orange Money: #144*... | MTN MoMo: *126#",
  tableCount: 12,
  workingDays: [
    { day: 'Monday', isOpen: true, openTime: '09:00', closeTime: '22:00' },
    { day: 'Tuesday', isOpen: true, openTime: '09:00', closeTime: '22:00' },
    { day: 'Wednesday', isOpen: true, openTime: '09:00', closeTime: '22:00' },
    { day: 'Thursday', isOpen: true, openTime: '09:00', closeTime: '22:00' },
    { day: 'Friday', isOpen: true, openTime: '09:00', closeTime: '23:30' },
    { day: 'Saturday', isOpen: true, openTime: '10:00', closeTime: '23:30' },
    { day: 'Sunday', isOpen: true, openTime: '10:00', closeTime: '21:00' },
  ],
  specialOffers: []
};

export default function App() {
  const [currentView, setCurrentView] = useState<AppView>('customer');
  const [isStaffAuthenticated, setIsStaffAuthenticated] = useState(false);
  const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS);
  const [menu, setMenu] = useState<MenuItem[]>(INITIAL_MENU);
  const [chefs, setChefs] = useState<Chef[]>(INITIAL_CHEFS);
  const [modifiers, setModifiers] = useState<Modifier[]>(INITIAL_MODIFIERS);
  const [settings, setSettings] = useState<EstateSettings>(INITIAL_SETTINGS);
  const [tableNumber] = useState("08");

  const placeOrder = useCallback((
    cartItems: OrderItem[], 
    customerName: string, 
    chefName: string, 
    gift: string, 
    diningOption: DiningOption,
    guestCount?: number,
    reservationDate?: string,
    reservationTime?: string,
    eventType?: EventType,
    specialInstructions?: string,
    paymentMethod: PaymentMethod = 'none',
    depositAmount?: number,
    isPaid: boolean = false,
    deliveryAddress?: string
  ) => {
    const maxEstimatedTime = Math.max(...cartItems.map(item => item.estimatedTime), 0);

    const newOrder: Order = {
      id: `ord_${Math.random().toString(36).substr(2, 9)}`,
      tableNumber: diningOption === 'delivery' ? 'DELIVERY' : tableNumber,
      customerName,
      chefName,
      status: 'pending',
      createdAt: Date.now(),
      items: [...cartItems],
      totalAmount: cartItems.reduce((acc, i) => acc + i.totalPrice, 0),
      gift,
      diningOption,
      guestCount,
      reservationDate,
      reservationTime,
      eventType,
      maxEstimatedTime,
      specialInstructions,
      paymentMethod,
      depositAmount,
      isPaid,
      deliveryAddress
    };

    setOrders(prev => [newOrder, ...prev]);
  }, [tableNumber]);

  const updateOrderStatus = useCallback((orderId: string, newStatus: OrderStatus) => {
    setOrders(prev => prev.map(order => 
      order.id === orderId ? { ...order, status: newStatus } : order
    ));
  }, []);

  return (
    <div className="bg-[#0a0a0a] min-h-screen">
      <ViewSwitcher currentView={currentView} setView={setCurrentView} />
      <main className="transition-opacity duration-300">
        {currentView === 'customer' && (
          <CustomerView tableNumber={tableNumber} onPlaceOrder={placeOrder} menu={menu} chefs={chefs} settings={settings} />
        )}
        
        {currentView === 'kitchen' && (
          isStaffAuthenticated ? (
            <KitchenView orders={orders} updateStatus={updateOrderStatus} />
          ) : (
            <StaffAccessGate 
              viewName="Chef KDS" 
              onAuthenticated={() => setIsStaffAuthenticated(true)} 
              onBack={() => setCurrentView('customer')}
            />
          )
        )}

        {/* Fixed missing onBack prop for public view StaffAccessGate */}
        {currentView === 'public' && (
          isStaffAuthenticated ? (
            <PublicStatusView orders={orders} />
          ) : (
            <StaffAccessGate 
              viewName="Lobby Status" 
              onAuthenticated={() => setIsStaffAuthenticated(true)} 
              onBack={() => setCurrentView('customer')}
            />
          )
        )}

        {/* Fixed missing onBack prop and completed implementation for admin view */}
        {currentView === 'admin' && (
          isStaffAuthenticated ? (
            <AdminView 
              menu={menu} 
              setMenu={setMenu} 
              chefs={chefs} 
              setChefs={setChefs} 
              settings={settings} 
              setSettings={setSettings}
              modifiers={modifiers}
              setModifiers={setModifiers}
            />
          ) : (
            <StaffAccessGate 
              viewName="Admin Hub" 
              onAuthenticated={() => setIsStaffAuthenticated(true)} 
              onBack={() => setCurrentView('customer')}
            />
          )
        )}
      </main>
    </div>
  );
}
