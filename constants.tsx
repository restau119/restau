
import { MenuItem, Modifier, Chef, EventType, DiningOption } from './types';

const ALL_MODES: DiningOption[] = ['eat-in', 'reservation', 'pickup', 'takeaway', 'delivery'];

export const MODIFIERS: Modifier[] = [
  { id: 'm1', name: 'Signature Alloco Garnish', price: 800, type: 'extra' },
  { id: 'm2', name: 'Premium Aged Wagyu Supplement', price: 12000, type: 'extra' },
  { id: 'm3', name: 'House-made Habanero Infusion', price: 500, type: 'extra' },
  { id: 'm4', name: 'Omit Garden Onions', price: 0, type: 'remove' },
  { id: 'm5', name: 'Omit Emulsion Sauce', price: 0, type: 'remove' },
  { id: 'm6', name: 'Truffle-infused Jollof', price: 2500, type: 'extra' },
];

export const CHEFS: Chef[] = [
  { id: 'c1', name: 'Chef Amara', specialty: 'Heritage Spices & Stews', avatar: 'https://images.unsplash.com/photo-1583394238182-6f71f3ef0874?auto=format&fit=crop&w=150&q=80' },
  { id: 'c2', name: 'Chef Kofi', specialty: 'Grill Master & Seafood', avatar: 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&w=150&q=80' },
  { id: 'c3', name: 'Chef Fatou', specialty: 'Modern African Fusion', avatar: 'https://images.unsplash.com/photo-1566554273541-37a9ca77b91f?auto=format&fit=crop&w=150&q=80' },
];

export const EVENT_TYPES: { id: EventType; label: string; icon: string }[] = [
  { id: 'standard', label: 'Casual Dining', icon: '🍽️' },
  { id: 'birthday', label: 'Birthday Celebration', icon: '🎂' },
  { id: 'anniversary', label: 'Anniversary', icon: '💍' },
  { id: 'business', label: 'Business Meeting', icon: '💼' },
  { id: 'family', label: 'Family Reunion', icon: '👨‍👩‍👧‍👦' },
  { id: 'romantic', label: 'Romantic Evening', icon: '🕯️' },
  { id: 'other', label: 'Special Event', icon: '✨' },
];

export const MENU: MenuItem[] = [
  {
    id: '1',
    name: 'Heritage Jollof Rice',
    description: 'Slow-cooked aromatic grain, smoked over cherry wood, served with corn-fed chicken and caramelized plantains.',
    ingredients: ['Long-grain parboiled rice', 'Heirloom plum tomatoes', 'Scotch bonnet peppers', 'Tatase (Bell peppers)', 'House-made chicken stock', 'Smoked paprika', 'Wild thyme'],
    price: 8500,
    category: 'Main Dishes',
    image: 'https://images.unsplash.com/photo-1627308595229-7830a5c91f9f?auto=format&fit=crop&w=800&q=80',
    availableModifiers: [MODIFIERS[0], MODIFIERS[2], MODIFIERS[3], MODIFIERS[5]],
    estimatedTime: 25,
    allowedOptions: ALL_MODES,
  },
  {
    id: '2',
    name: 'Poulet de la Haute Cour',
    description: 'The definitive "Director General" chicken, pan-seared with organic local vegetables and ripened plantain medallions.',
    ingredients: ['Corn-fed chicken thigh', 'Organic carrots', 'Haricot verts', 'Ripe plantain', 'Cold-pressed palm oil', 'Garlic confit', 'Ginger root'],
    price: 12500,
    category: 'Main Dishes',
    image: 'https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?auto=format&fit=crop&w=800&q=80',
    availableModifiers: [MODIFIERS[0], MODIFIERS[2], MODIFIERS[3], MODIFIERS[4]],
    estimatedTime: 30,
    allowedOptions: ALL_MODES,
  },
  {
    id: 'r1',
    name: 'Royal Whole Lamb Roast',
    description: 'A grand centerpiece roasted for 8 hours with 12 secret African spices. Serves 6-8 people.',
    ingredients: ['Whole spring lamb', 'Northern Yaji spice', 'Fermented locust beans', 'Acacia honey glaze', 'Rosemary infusion', 'Suya pepper blend'],
    price: 185000,
    category: 'Main Dishes',
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80',
    availableModifiers: [MODIFIERS[2], MODIFIERS[5]],
    estimatedTime: 480,
    allowedOptions: ['reservation'],
  },
  {
    id: '5',
    name: 'Suya Carpaccio',
    description: 'Fine-sliced beef tenderloin, flash-grilled and dusted with heirloom Yaji spice and micro-greens.',
    ingredients: ['Aged beef tenderloin', 'Ground peanut spice (Kuli-kuli)', 'Cold-pressed peanut oil', 'Red onion slivers', 'Fresh cilantro', 'Lime zest'],
    price: 6500,
    category: 'Starters',
    image: 'https://images.unsplash.com/photo-1604328698692-f76ea9498e76?auto=format&fit=crop&w=800&q=80',
    availableModifiers: [MODIFIERS[2], MODIFIERS[3]],
    estimatedTime: 12,
    allowedOptions: ALL_MODES,
  },
  {
    id: '7',
    name: 'The Grand Chapman',
    description: 'Our signature botanical punch, infused with Angostura bitters and cucumber ribbons.',
    ingredients: ['Sparkling orange zest', 'Lemon infusion', 'Cucumber ribbons', 'Angostura bitters', 'Blackcurrant reduction', 'Fresh mint'],
    price: 3500,
    category: 'Drinks',
    image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=800&q=80',
    availableModifiers: [],
    estimatedTime: 5,
    allowedOptions: ALL_MODES,
  },
  {
    id: '16',
    name: 'Hibiscus & Gold Fizz',
    description: 'Cold-pressed Zobo reduction with edible 24k gold flakes and sparkling spring water.',
    ingredients: ['Dried Hibiscus leaves (Zobo)', 'Clove spikes', 'Dehydrated pineapple', 'Edible 24k Gold leaf', 'Sparkling mineral water', 'Raw cane syrup'],
    price: 5500,
    category: 'Drinks',
    image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?auto=format&fit=crop&w=800&q=80',
    availableModifiers: [],
    estimatedTime: 5,
    allowedOptions: ['eat-in', 'reservation', 'pickup', 'delivery'],
  },
];

export const GIFTS = [
  "Complimentary House-made Petit Fours",
  "Voucher: 15% off your next Suite Dining",
  "Signature Glass of Reserve Palm Nectar",
  "Artisanal Coffee & Truffle Selection",
  "Private Kitchen Tour Invitation",
];

export const COLORS = {
  gold: '#D4AF37',
  goldLight: '#F1D27B',
  obsidian: '#0a0a0a',
  cream: '#FDFCF0',
};

export const CURRENCY = 'FCFA';
export const ESTATE_CONTACT = "+237 600 000 000";
