import React, { createContext, useContext, useReducer, useEffect } from 'react';

const AppContext = createContext();

// Migration logic for localized Rupee version
const VERSION = '2.0';
const savedVersion = localStorage.getItem('nc_version');
if (savedVersion !== VERSION) {
  localStorage.clear();
  localStorage.setItem('nc_version', VERSION);
}

const initialState = {
  user: JSON.parse(localStorage.getItem('user')) || null,
  token: localStorage.getItem('token') || null,
  cart: JSON.parse(localStorage.getItem('cart')) || [],
  wishlist: JSON.parse(localStorage.getItem('wishlist')) || [],
  recentlyViewed: JSON.parse(localStorage.getItem('recentlyViewed')) || [],
  userActions: [], // Track clicks, searches for AI
  searchQuery: '',
  isCartOpen: false,
};

function appReducer(state, action) {
  switch (action.type) {
    case 'LOGIN':
      return { ...state, user: action.payload.user, token: action.payload.token };
    case 'LOGOUT':
      return { ...state, user: null, token: null, cart: [], wishlist: [] };
    case 'ADD_TO_CART': {
      const existingItem = state.cart.find(item => item.id === action.payload.id);
      let newCart;
      if (existingItem) {
        newCart = state.cart.map(item =>
          item.id === action.payload.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      } else {
        newCart = [...state.cart, { ...action.payload, quantity: 1 }];
      }
      return { ...state, cart: newCart, userActions: [...state.userActions, { type: 'cart_add', item: action.payload.name, time: new Date().toISOString() }] };
    }
    case 'REMOVE_FROM_CART': {
      return { ...state, cart: state.cart.filter(item => item.id !== action.payload) };
    }
    case 'UPDATE_QUANTITY': {
      return {
        ...state,
        cart: state.cart.map(item =>
          item.id === action.payload.id ? { ...item, quantity: action.payload.quantity } : item
        ),
      };
    }
    case 'TOGGLE_WISHLIST': {
      const exists = state.wishlist.some(item => item.id === action.payload.id);
      const newWishlist = exists
        ? state.wishlist.filter(item => item.id !== action.payload.id)
        : [...state.wishlist, action.payload];
      return { ...state, wishlist: newWishlist, userActions: [...state.userActions, { type: exists ? 'wishlist_remove' : 'wishlist_add', item: action.payload.name, time: new Date().toISOString() }] };
    }
    case 'ADD_RECENTLY_VIEWED': {
      const filtered = state.recentlyViewed.filter(item => item.id !== action.payload.id);
      const newRecent = [action.payload, ...filtered].slice(0, 5); // Keep last 5
      return { ...state, recentlyViewed: newRecent, userActions: [...state.userActions, { type: 'view_product', item: action.payload.name, time: new Date().toISOString() }] };
    }
    case 'SET_SEARCH_QUERY':
      return { ...state, searchQuery: action.payload, userActions: [...state.userActions, { type: 'search', query: action.payload, time: new Date().toISOString() }] };
    case 'TOGGLE_CART':
      return { ...state, isCartOpen: !state.isCartOpen };
    case 'LOG_ACTION':
      return { ...state, userActions: [...state.userActions, { ...action.payload, time: new Date().toISOString() }] };
    default:
      return state;
  }
}

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Persist to localStorage
  useEffect(() => {
    localStorage.setItem('user', JSON.stringify(state.user));
    localStorage.setItem('token', state.token || '');
    localStorage.setItem('cart', JSON.stringify(state.cart));
    localStorage.setItem('wishlist', JSON.stringify(state.wishlist));
    localStorage.setItem('recentlyViewed', JSON.stringify(state.recentlyViewed));
  }, [state.user, state.token, state.cart, state.wishlist, state.recentlyViewed]);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  return useContext(AppContext);
}
