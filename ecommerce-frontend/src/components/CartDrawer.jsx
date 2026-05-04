import { X, Trash2, Plus, Minus, CreditCard } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';

export const CartDrawer = ({ isOpen }) => {
  const { state, dispatch } = useAppContext();
  const navigate = useNavigate();

  if (!isOpen) return null;

  const total = state.cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="fixed inset-0 z-[60] flex justify-end">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
        onClick={() => dispatch({ type: 'TOGGLE_CART' })}
      />
      
      {/* Drawer */}
      <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="text-2xl font-bold">Your Cart</h2>
          <button 
            onClick={() => dispatch({ type: 'TOGGLE_CART' })}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {state.cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-gray-500 space-y-4">
              <ShoppingCart className="w-16 h-16 opacity-20" />
              <p className="text-lg">Your cart is empty</p>
            </div>
          ) : (
            state.cart.map(item => (
              <div key={item.id} className="flex gap-4 items-center bg-gray-50 p-4 rounded-2xl">
                <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded-xl" />
                <div className="flex-1">
                  <h3 className="font-semibold text-sm line-clamp-2">{item.name}</h3>
                  <p className="text-accent font-bold mt-1">₹{item.price.toFixed(2)}</p>
                  <div className="flex items-center gap-3 mt-2">
                    <div className="flex items-center bg-white rounded-lg border border-gray-200">
                      <button 
                        onClick={() => item.quantity > 1 ? dispatch({ type: 'UPDATE_QUANTITY', payload: { id: item.id, quantity: item.quantity - 1 } }) : dispatch({ type: 'REMOVE_FROM_CART', payload: item.id })}
                        className="p-1 hover:text-accent"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="px-2 text-sm font-medium">{item.quantity}</span>
                      <button 
                        onClick={() => dispatch({ type: 'UPDATE_QUANTITY', payload: { id: item.id, quantity: item.quantity + 1 } })}
                        className="p-1 hover:text-accent"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                    <button 
                      onClick={() => dispatch({ type: 'REMOVE_FROM_CART', payload: item.id })}
                      className="text-red-400 hover:text-red-600 ml-auto"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {state.cart.length > 0 && (
          <div className="p-6 border-t border-gray-100 bg-gray-50">
            <div className="flex justify-between mb-4">
              <span className="text-gray-600 font-medium">Subtotal</span>
              <span className="text-xl font-bold">₹{total.toFixed(2)}</span>
            </div>
            <button 
              onClick={() => {
                dispatch({ type: 'TOGGLE_CART' });
                navigate('/checkout');
              }}
              className="w-full bg-primary hover:bg-gray-800 text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
            >
              <CreditCard className="w-5 h-5" /> Checkout
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

// Also import ShoppingCart at the top since we use it for empty state
import { ShoppingCart } from 'lucide-react';
