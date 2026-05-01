import { createContext, useContext, useReducer } from 'react';
import { INITIAL_PRODUCTS } from '../data/products';

const StoreContext = createContext(null);

const STORAGE_KEYS = {
  PRODUCTS: 'ratiraj_products',
  ORDERS: 'ratiraj_orders',
};

function loadFromStorage(key, fallback) {
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : fallback;
  } catch {
    return fallback;
  }
}

function saveToStorage(key, value) {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch {}
}

const initialState = {
  products: loadFromStorage(STORAGE_KEYS.PRODUCTS, INITIAL_PRODUCTS),
  orders: loadFromStorage(STORAGE_KEYS.ORDERS, []),
  isAdmin: false,
};

function reducer(state, action) {
  switch (action.type) {
    case 'ADD_PRODUCT': {
      const products = [...state.products, action.product];
      saveToStorage(STORAGE_KEYS.PRODUCTS, products);
      return { ...state, products };
    }
    case 'UPDATE_PRODUCT': {
      const products = state.products.map(p =>
        p.id === action.product.id ? action.product : p
      );
      saveToStorage(STORAGE_KEYS.PRODUCTS, products);
      return { ...state, products };
    }
    case 'DELETE_PRODUCT': {
      const products = state.products.filter(p => p.id !== action.id);
      saveToStorage(STORAGE_KEYS.PRODUCTS, products);
      return { ...state, products };
    }
    case 'ADD_ORDER': {
      const orders = [...state.orders, action.order];
      saveToStorage(STORAGE_KEYS.ORDERS, orders);
      return { ...state, orders };
    }
    case 'UPDATE_ORDER_STATUS': {
      const orders = state.orders.map(o =>
        o.id === action.id ? { ...o, status: action.status } : o
      );
      saveToStorage(STORAGE_KEYS.ORDERS, orders);
      return { ...state, orders };
    }
    case 'LOGIN_ADMIN':
      return { ...state, isAdmin: true };
    case 'LOGOUT_ADMIN':
      return { ...state, isAdmin: false };
    default:
      return state;
  }
}

export function StoreProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <StoreContext.Provider value={{ state, dispatch }}>
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  return useContext(StoreContext);
}

// ✏️ Change this to your WhatsApp number (country code + number, no + or spaces)
export const WHATSAPP_NUMBER = '919876543210';