import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { Product, Order } from '../types';

// Define the shape of our application state
interface AppState {
  products: Product[];
  currentOrder: Order | null;
  orders: Order[];
  isLoading: boolean;
  error: string | null;
}

// Define action types
type AppAction =
  | { type: 'SET_PRODUCTS'; payload: Product[] }
  | { type: 'ADD_TO_ORDER'; payload: { product: Product; quantity: number } }
  | { type: 'UPDATE_ORDER_ITEM'; payload: { id: string; quantity: number } }
  | { type: 'REMOVE_FROM_ORDER'; payload: string }
  | { type: 'CLEAR_ORDER' }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'COMPLETE_ORDER'; payload: Order }
  | { type: 'SET_ORDERS'; payload: Order[] };

// Initial state
const initialState: AppState = {
  products: [],
  currentOrder: null,
  orders: [],
  isLoading: false,
  error: null
};

// Create context
const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
}>({
  state: initialState,
  dispatch: () => null
});

// Reducer function
const appReducer = (state: AppState, action: AppAction): AppState => {
  switch (action.type) {
    case 'SET_PRODUCTS':
      return {
        ...state,
        products: action.payload
      };
    case 'ADD_TO_ORDER':
      // Implementation will be added later
      return state;
    case 'UPDATE_ORDER_ITEM':
      // Implementation will be added later
      return state;
    case 'REMOVE_FROM_ORDER':
      // Implementation will be added later
      return state;
    case 'CLEAR_ORDER':
      return {
        ...state,
        currentOrder: null
      };
    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload
      };
    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload
      };
    case 'COMPLETE_ORDER':
      return {
        ...state,
        orders: [...state.orders, action.payload],
        currentOrder: null
      };
    case 'SET_ORDERS':
      return {
        ...state,
        orders: action.payload
      };
    default:
      return state;
  }
};

// Provider component
interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
};

// Custom hook to use the context
export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
}; 