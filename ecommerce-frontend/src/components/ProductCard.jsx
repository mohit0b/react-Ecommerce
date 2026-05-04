import { Link } from 'react-router-dom';
import { Heart, ShoppingBag, Star } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

export const ProductCard = ({ product }) => {
  const { state, dispatch } = useAppContext();
  
  const isWishlisted = state.wishlist.some(item => item.id === product.id);

  const handleAddToCart = (e) => {
    e.preventDefault();
    dispatch({ type: 'ADD_TO_CART', payload: product });
  };

  const handleWishlist = (e) => {
    e.preventDefault();
    dispatch({ type: 'TOGGLE_WISHLIST', payload: product });
  };

  return (
    <Link 
      to={`/product/${product.id}`} 
      onClick={() => dispatch({ type: 'ADD_RECENTLY_VIEWED', payload: product })}
      className="group relative bg-white rounded-3xl p-4 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl border border-gray-100 flex flex-col"
    >
      <div className="relative aspect-square rounded-2xl overflow-hidden bg-gray-100 mb-4">
        <img 
          src={product.image} 
          alt={product.name} 
          loading="lazy"
          className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
        />
        <button 
          onClick={handleWishlist}
          className="absolute top-3 right-3 p-2.5 rounded-full bg-white/80 backdrop-blur hover:bg-white text-gray-600 hover:text-red-500 transition-colors shadow-sm"
        >
          <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-red-500 text-red-500' : ''}`} />
        </button>
      </div>

      <div className="flex flex-col flex-1">
        <div className="flex items-center gap-1 text-sm text-yellow-500 mb-2">
          <Star className="w-4 h-4 fill-current" />
          <span className="font-medium text-gray-700">{product.rating}</span>
          <span className="text-gray-400 ml-1">({product.reviews})</span>
        </div>
        
        <h3 className="font-semibold text-lg text-gray-900 line-clamp-2 mb-1 group-hover:text-accent transition-colors">
          {product.name}
        </h3>
        <p className="text-sm text-gray-500 mb-4">{product.category}</p>
        
        <div className="mt-auto flex items-center justify-between">
          <span className="text-xl font-bold text-gray-900">₹{product.price.toFixed(2)}</span>
          <button 
            onClick={handleAddToCart}
            className="bg-gray-900 hover:bg-accent text-white p-3 rounded-full transition-colors shadow-md"
          >
            <ShoppingBag className="w-5 h-5" />
          </button>
        </div>
      </div>
    </Link>
  );
};

export const ProductSkeleton = () => (
  <div className="bg-white rounded-3xl p-4 border border-gray-100 animate-pulse">
    <div className="aspect-square bg-gray-200 rounded-2xl mb-4"></div>
    <div className="w-16 h-4 bg-gray-200 rounded mb-3"></div>
    <div className="w-full h-6 bg-gray-200 rounded mb-2"></div>
    <div className="w-2/3 h-6 bg-gray-200 rounded mb-4"></div>
    <div className="flex justify-between items-center mt-auto">
      <div className="w-20 h-6 bg-gray-200 rounded"></div>
      <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
    </div>
  </div>
);
