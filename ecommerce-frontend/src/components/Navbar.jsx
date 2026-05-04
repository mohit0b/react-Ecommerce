import { Search, ShoppingCart, Heart, User } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';

export const Navbar = () => {
  const { state, dispatch } = useAppContext();
  const navigate = useNavigate();

  const handleSearch = (e) => {
    if (e.key === 'Enter') {
      dispatch({ type: 'SET_SEARCH_QUERY', payload: e.target.value });
      navigate('/shop');
    }
  };

  const cartCount = state.cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <nav className="fixed top-0 w-full z-50 glass px-6 py-4 flex items-center justify-between border-b border-gray-200">
      <Link to="/" className="text-2xl font-bold tracking-tighter text-primary">
        NeuroCart
      </Link>
      
      <div className="hidden md:flex flex-1 max-w-xl mx-8 relative">
        <Search className="absolute left-3 top-2.5 text-gray-400 w-5 h-5" />
        <input 
          type="text" 
          placeholder="Search for 'gaming mouse under ₹2000'..."
          className="w-full bg-white/50 border border-gray-200 rounded-full py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-accent/50 transition-all"
          onKeyDown={handleSearch}
        />
      </div>

      <div className="flex items-center space-x-6">
        <Link to="/shop" className="text-gray-600 hover:text-primary font-medium transition-colors">Shop</Link>
        <button className="text-gray-600 hover:text-primary relative group">
          <Heart className="w-6 h-6 transition-transform group-hover:scale-110" />
          {state.wishlist.length > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
              {state.wishlist.length}
            </span>
          )}
        </button>
        <button 
          className="text-gray-600 hover:text-primary relative group"
          onClick={() => dispatch({ type: 'TOGGLE_CART' })}
        >
          <ShoppingCart className="w-6 h-6 transition-transform group-hover:scale-110" />
          {cartCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-accent text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
              {cartCount}
            </span>
          )}
        </button>
        {state.user ? (
          <div className="flex items-center gap-3 bg-gray-50 border border-gray-100 py-1 pl-3 pr-1 rounded-full hover:bg-gray-100 transition-colors cursor-pointer group relative">
             <div className="flex flex-col items-start leading-none">
               <span className="text-[11px] font-bold text-gray-900 truncate max-w-[80px]">{state.user.name}</span>
               <button 
                 onClick={() => dispatch({ type: 'LOGOUT' })}
                 className="text-[9px] text-accent font-bold hover:text-accent/80 transition-colors"
               >
                 Logout
               </button>
             </div>
             <div className="w-8 h-8 rounded-full bg-accent text-white flex items-center justify-center text-sm font-bold shadow-sm">
               {state.user.name.charAt(0)}
             </div>
          </div>
        ) : (
          <Link to="/login" className="text-gray-600 hover:text-primary transition-colors flex items-center gap-2 group">
            <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center group-hover:bg-accent group-hover:text-white transition-all">
              <User className="w-5 h-5" />
            </div>
            <span className="font-semibold text-sm hidden sm:block">Login</span>
          </Link>
        )}
      </div>
    </nav>
  );
};