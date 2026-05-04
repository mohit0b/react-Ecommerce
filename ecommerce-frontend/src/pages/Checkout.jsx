import { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { api } from '../services/api';
import { CheckCircle2, Loader2, Tag } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Checkout = () => {
  const { state, dispatch } = useAppContext();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [coupon, setCoupon] = useState('');
  const [discount, setDiscount] = useState(0);

  const subtotal = state.cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const total = subtotal - (subtotal * discount);

  const applyCoupon = () => {
    if (coupon.toUpperCase() === 'NEURO20') {
      setDiscount(0.20);
      dispatch({ type: 'LOG_ACTION', payload: { type: 'apply_coupon', value: 'NEURO20' } });
    } else {
      alert('Invalid coupon code. Try NEURO20.');
    }
  };

  const handleCheckout = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.submitOrder(state.cart);
      setSuccess(true);
      // Empty cart in real app, here we just show success state
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
        <CheckCircle2 className="w-24 h-24 text-green-500 mb-6" />
        <h1 className="text-4xl font-bold mb-4">Order Confirmed!</h1>
        <p className="text-gray-500 mb-8 max-w-md">Thank you for your purchase. Your AI-curated items will be shipped shortly.</p>
        <Link to="/" className="bg-primary text-white px-8 py-3 rounded-full font-bold hover:bg-gray-800 transition-colors">
          Return Home
        </Link>
      </div>
    );
  }

  if (state.cart.length === 0) {
    return (
      <div className="text-center py-32">
        <h1 className="text-3xl font-bold mb-4">Your cart is empty</h1>
        <Link to="/shop" className="text-accent hover:underline">Continue Shopping</Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 flex flex-col lg:flex-row gap-12">
      <div className="w-full lg:w-2/3">
        <h1 className="text-3xl font-bold mb-8">Checkout</h1>
        
        <form onSubmit={handleCheckout} className="space-y-8">
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <h2 className="text-xl font-bold mb-4">Shipping Information</h2>
            <div className="grid grid-cols-2 gap-4">
              <input required type="text" placeholder="First Name" className="w-full border border-gray-200 rounded-lg p-3" />
              <input required type="text" placeholder="Last Name" className="w-full border border-gray-200 rounded-lg p-3" />
              <input required type="text" placeholder="Address" className="w-full border border-gray-200 rounded-lg p-3 col-span-2" />
              <input required type="text" placeholder="City" className="w-full border border-gray-200 rounded-lg p-3" />
              <input required type="text" placeholder="Postal Code" className="w-full border border-gray-200 rounded-lg p-3" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <h2 className="text-xl font-bold mb-4">Payment Method (Fake)</h2>
            <div className="space-y-4">
              <input required type="text" placeholder="Card Number" className="w-full border border-gray-200 rounded-lg p-3" />
              <div className="grid grid-cols-2 gap-4">
                <input required type="text" placeholder="MM/YY" className="w-full border border-gray-200 rounded-lg p-3" />
                <input required type="text" placeholder="CVC" className="w-full border border-gray-200 rounded-lg p-3" />
              </div>
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-primary hover:bg-gray-800 text-white py-4 rounded-xl font-bold text-lg shadow-xl flex justify-center items-center gap-2"
          >
            {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : `Pay ₹${total.toFixed(2)}`}
          </button>
        </form>
      </div>

      <div className="w-full lg:w-1/3">
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm sticky top-28">
          <h2 className="text-xl font-bold mb-6">Order Summary</h2>
          
          <div className="space-y-4 mb-6 max-h-64 overflow-y-auto pr-2 custom-scrollbar">
            {state.cart.map(item => (
              <div key={item.id} className="flex gap-4">
                <img src={item.image} className="w-16 h-16 rounded-lg object-cover" alt={item.name} />
                <div>
                  <h4 className="font-semibold text-sm line-clamp-2">{item.name}</h4>
                  <p className="text-gray-500 text-sm mt-1">Qty: {item.quantity}</p>
                  <p className="font-bold">₹{(item.price * item.quantity).toFixed(2)}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="border-t border-gray-100 pt-6 mb-6">
            <div className="flex gap-2 mb-6">
              <div className="relative flex-1">
                <Tag className="w-4 h-4 absolute left-3 top-3.5 text-gray-400" />
                <input 
                  type="text" 
                  value={coupon}
                  onChange={e => setCoupon(e.target.value)}
                  placeholder="Coupon code (Try NEURO20)" 
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg py-2.5 pl-9 pr-4 text-sm"
                />
              </div>
              <button onClick={applyCoupon} className="bg-gray-900 text-white px-4 rounded-lg text-sm font-medium hover:bg-black">Apply</button>
            </div>

            <div className="space-y-2 text-sm text-gray-600 mb-4">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>₹{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span className="text-green-500">Free</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-green-500 font-medium">
                  <span>Discount (20%)</span>
                  <span>-₹{(subtotal * discount).toFixed(2)}</span>
                </div>
              )}
            </div>
            
            <div className="flex justify-between items-center text-xl font-bold text-gray-900 pt-4 border-t border-gray-100">
              <span>Total</span>
              <span>₹{total.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
