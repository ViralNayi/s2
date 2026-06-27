import React, { createContext, useContext, useState, useEffect } from 'react';
import { t as translate } from '../utils/translations';
import type { Language } from '../utils/translations';

export type ScreenType =
  | 'landing'
  | 'login'
  | 'register'
  | 'shopkeeper'
  | 'partner'
  | 'customer'
  | 'admin'
  | 'tracking'
  | 'whatsapp';

export type RoleType = 'shopkeeper' | 'partner' | 'customer' | 'admin';

export interface Order {
  id: string;
  pickup: string;
  destination: string;
  receiverName: string;
  receiverPhone: string;
  category: string;
  size: string;
  instructions: string;
  status: 'pending' | 'matched' | 'picked_up' | 'in_transit' | 'near_destination' | 'delivered';
  partnerName: string;
  partnerPhone: string;
  eta: string;
  reward: number;
  distance: number;
  pickupOTP: string;
  deliveryOTP: string;
  createdAt: string;
}

interface AppContextProps {
  currentScreen: ScreenType;
  setScreen: (screen: ScreenType) => void;
  userRole: RoleType;
  setUserRole: (role: RoleType) => void;
  orders: Order[];
  createOrder: (orderData: Omit<Order, 'id' | 'status' | 'partnerName' | 'partnerPhone' | 'eta' | 'pickupOTP' | 'deliveryOTP' | 'createdAt'>) => void;
  acceptOrder: (orderId: string, partnerName: string, partnerPhone: string) => void;
  verifyPickupOTP: (orderId: string, otp: string) => boolean;
  verifyDeliveryOTP: (orderId: string, otp: string) => boolean;
  selectedOrderId: string;
  setSelectedOrderId: (id: string) => void;
  earnings: {
    total: number;
    withdrawable: number;
    rating: number;
    distance: number;
  };
  addEarnings: (amount: number, dist: number) => void;
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string | undefined | null) => string;
}

const AppContext = createContext<AppContextProps | undefined>(undefined);

const INITIAL_ORDERS: Order[] = [
  {
    id: 'SH-2931',
    pickup: 'Sagar Dairy, Sonagir, Madhya Pradesh',
    destination: 'Gyan Mandir, Vidisha, Madhya Pradesh',
    receiverName: 'Aarav Sharma',
    receiverPhone: '+91 98765 43210',
    category: 'Medicines',
    size: 'Small (under 1 kg)',
    instructions: 'Keep in shade. Hand over to Aarav only.',
    status: 'in_transit',
    partnerName: 'Vikram Singh',
    partnerPhone: '+91 88899 00112',
    eta: '25 mins',
    reward: 180,
    distance: 24,
    pickupOTP: '1122',
    deliveryOTP: '5566',
    createdAt: '2026-06-14T12:00:00Z',
  },
  {
    id: 'SH-8842',
    pickup: 'Chawla Kirana Store, Kurawar, MP',
    destination: 'Malviya Nagar, Bhopal, MP',
    receiverName: 'Pooja Verma',
    receiverPhone: '+91 77766 55443',
    category: 'Groceries',
    size: 'Medium (1 - 5 kg)',
    instructions: 'Call upon arrival at gate.',
    status: 'pending',
    partnerName: '',
    partnerPhone: '',
    eta: 'Not Assigned',
    reward: 350,
    distance: 45,
    pickupOTP: '3456',
    deliveryOTP: '7890',
    createdAt: '2026-06-14T14:30:00Z',
  },
  {
    id: 'SH-9902',
    pickup: 'Shree Balaji Traders, Kolar Road, Bhopal',
    destination: 'Mandideep Industrial Area, MP',
    receiverName: 'Rajesh Patel',
    receiverPhone: '+91 94250 12345',
    category: 'Electronics Spare Parts',
    size: 'Heavy (5 - 15 kg)',
    instructions: 'Fragile parts. Drive carefully.',
    status: 'matched',
    partnerName: 'Rohan Verma',
    partnerPhone: '+91 99988 77766',
    eta: '45 mins',
    reward: 280,
    distance: 18,
    pickupOTP: '2026',
    deliveryOTP: '9988',
    createdAt: '2026-06-14T15:15:00Z',
  },
  {
    id: 'SH-1024',
    pickup: 'Agrawal Sweets, Sehore, MP',
    destination: 'Indrapuri Sector C, Bhopal, MP',
    receiverName: 'Neha Gupta',
    receiverPhone: '+91 91112 22334',
    category: 'Food Items',
    size: 'Small (under 1 kg)',
    instructions: 'Deliver hot if possible.',
    status: 'delivered',
    partnerName: 'Vikram Singh',
    partnerPhone: '+91 88899 00112',
    eta: 'Delivered',
    reward: 220,
    distance: 38,
    pickupOTP: '4455',
    deliveryOTP: '8899',
    createdAt: '2026-06-14T10:00:00Z',
  },
];

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentScreen, setScreen] = useState<ScreenType>('landing');
  const [userRole, setUserRole] = useState<RoleType>('shopkeeper');
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('setuhub-lang');
    return (saved as Language) || 'hi';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('setuhub-lang', lang);
  };

  const t = (key: string | undefined | null) => {
    return translate(key, language);
  };
  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('setuhub-orders');
    return saved ? JSON.parse(saved) : INITIAL_ORDERS;
  });
  const [selectedOrderId, setSelectedOrderId] = useState<string>('SH-2931');
  const [earnings, setEarnings] = useState(() => {
    const saved = localStorage.getItem('setuhub-earnings');
    return saved ? JSON.parse(saved) : {
      total: 12450,
      withdrawable: 4850,
      rating: 4.85,
      distance: 342,
    };
  });

  useEffect(() => {
    localStorage.setItem('setuhub-orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('setuhub-earnings', JSON.stringify(earnings));
  }, [earnings]);

  const createOrder = (orderData: Omit<Order, 'id' | 'status' | 'partnerName' | 'partnerPhone' | 'eta' | 'pickupOTP' | 'deliveryOTP' | 'createdAt'>) => {
    const generateOTP = () => Math.floor(1000 + Math.random() * 9000).toString();
    const newOrder: Order = {
      ...orderData,
      id: `SH-${Math.floor(1000 + Math.random() * 9000)}`,
      status: 'pending',
      partnerName: '',
      partnerPhone: '',
      eta: 'Awaiting Match',
      pickupOTP: generateOTP(),
      deliveryOTP: generateOTP(),
      createdAt: new Date().toISOString(),
    };
    setOrders((prev) => [newOrder, ...prev]);
    setSelectedOrderId(newOrder.id);
  };

  const acceptOrder = (orderId: string, partnerName: string, partnerPhone: string) => {
    setOrders((prev) =>
      prev.map((o) => {
        if (o.id === orderId) {
          return {
            ...o,
            status: 'matched',
            partnerName,
            partnerPhone,
            eta: `${Math.floor(o.distance * 1.5)} mins`,
          };
        }
        return o;
      })
    );
  };

  const verifyPickupOTP = (orderId: string, otp: string): boolean => {
    let verified = false;
    setOrders((prev) =>
      prev.map((o) => {
        if (o.id === orderId && o.pickupOTP === otp) {
          verified = true;
          return {
            ...o,
            status: 'picked_up',
          };
        }
        return o;
      })
    );

    // If verified, auto-advance transit status simulation
    if (verified) {
      setTimeout(() => {
        setOrders((prev) =>
          prev.map((o) => {
            if (o.id === orderId) {
              return { ...o, status: 'in_transit' };
            }
            return o;
          })
        );
      }, 5000);
    }
    return verified;
  };

  const verifyDeliveryOTP = (orderId: string, otp: string): boolean => {
    let verified = false;
    let rewardAmount = 0;
    let distAmount = 0;

    setOrders((prev) =>
      prev.map((o) => {
        if (o.id === orderId && o.deliveryOTP === otp) {
          verified = true;
          rewardAmount = o.reward;
          distAmount = o.distance;
          return {
            ...o,
            status: 'delivered',
            eta: 'Delivered',
          };
        }
        return o;
      })
    );

    if (verified && rewardAmount > 0) {
      addEarnings(rewardAmount, distAmount);
    }
    return verified;
  };

  const addEarnings = (amount: number, dist: number) => {
    setEarnings((prev: any) => ({
      ...prev,
      total: prev.total + amount,
      withdrawable: prev.withdrawable + amount,
      distance: prev.distance + dist,
    }));
  };

  return (
    <AppContext.Provider
      value={{
        currentScreen,
        setScreen,
        userRole,
        setUserRole,
        orders,
        createOrder,
        acceptOrder,
        verifyPickupOTP,
        verifyDeliveryOTP,
        selectedOrderId,
        setSelectedOrderId,
        earnings,
        addEarnings,
        language,
        setLanguage,
        t,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
