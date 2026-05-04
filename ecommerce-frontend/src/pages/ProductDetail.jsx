import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../services/api';
import { useAppContext } from '../context/AppContext';
import { Star, ShieldCheck, Truck, ArrowLeft, Heart, ShoppingBag } from 'lucide-react';

export const ProductDetail = () => {
  const { id } = useParams();
  const { state, dispatch } = useAppContext();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const data = await api.getProductById(id);
        setProduct(data);
        dispatch({ type: 'ADD_RECENTLY_VIEWED', payload: data });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id, dispatch]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-12 animate-pulse flex flex-col md:flex-row gap-12">
        <div className="w-full md:w-1/2 aspect-square bg-gray-200 rounded-3xl"></div>
        <div className="w-full md:w-1/2 space-y-6 pt-8">
          <div className="w-24 h-4 bg-gray-200 rounded"></div>
          <div className="w-3/4 h-10 bg-gray-200 rounded"></div>
          <div className="w-32 h-8 bg-gray-200 rounded"></div>
          <div className="w-full h-24 bg-gray-200 rounded"></div>
          <div className="w-48 h-12 bg-gray-200 rounded-full mt-8"></div>
        </div>
      </div>
    );
  }

  if (!product) {
    return <div className="text-center py-20 text-2xl font-bold">Product not found</div>;
  }

  const isWishlisted = state.wishlist.some(item => item.id === product.id);

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <Link to="/shop" className="inline-flex items-center gap-2 text-gray-500 hover:text-primary mb-8 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to Shop
      </Link>

      <div className="flex flex-col md:flex-row gap-12 lg:gap-20">
        {/* Image Gallery */}
        <div className="w-full md:w-1/2">
          <div className="aspect-square rounded-3xl overflow-hidden bg-gray-100 relative group">
            <img 
              src={product.image} 
              alt={product.name} 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <button 
              onClick={() => dispatch({ type: 'TOGGLE_WISHLIST', payload: product })}
              className="absolute top-6 right-6 p-4 rounded-full bg-white/80 backdrop-blur shadow-sm hover:bg-white text-gray-600 hover:text-red-500 transition-colors"
            >
              <Heart className={`w-6 h-6 ${isWishlisted ? 'fill-red-500 text-red-500' : ''}`} />
            </button>
          </div>
        </div>

        {/* Product Info */}
        <div className="w-full md:w-1/2 pt-4">
          <p className="text-accent font-semibold tracking-wider text-sm uppercase mb-3">{product.category}</p>
          <h1 className="text-4xl lg:text-5xl font-extrabold text-primary mb-4 leading-tight">{product.name}</h1>
          
          <div className="flex items-center gap-4 mb-6">
            <div className="flex items-center gap-1 text-yellow-500">
              <Star className="w-5 h-5 fill-current" />
              <span className="font-bold text-gray-900">{product.rating}</span>
            </div>
            <span className="text-gray-400">|</span>
            <span className="text-gray-600 underline cursor-pointer">{product.reviews} Reviews</span>
          </div>

          <div className="text-4xl font-black text-gray-900 mb-8">₹{product.price.toFixed(2)}</div>
          
          <p className="text-lg text-gray-600 leading-relaxed mb-8">{product.description}</p>

          <div className="space-y-4 mb-10">
            <h3 className="font-bold text-gray-900">Key Features:</h3>
            <ul className="list-disc pl-5 space-y-2 text-gray-600">
              {product.features.map((feature, idx) => (
                <li key={idx}>{feature}</li>
              ))}
            </ul>
          </div>

          <button 
            onClick={() => dispatch({ type: 'ADD_TO_CART', payload: product })}
            className="w-full sm:w-auto bg-primary hover:bg-gray-800 text-white px-10 py-5 rounded-full font-bold text-lg transition-all shadow-xl hover:shadow-2xl flex items-center justify-center gap-3"
          >
            <ShoppingBag className="w-6 h-6" /> Add to Cart
          </button>

          <div className="grid grid-cols-2 gap-4 mt-12 pt-8 border-t border-gray-100">
            <div className="flex items-center gap-3 text-gray-600">
              <Truck className="w-6 h-6 text-accent" />
              <span className="font-medium">Free Shipping</span>
            </div>
            <div className="flex items-center gap-3 text-gray-600">
              <ShieldCheck className="w-6 h-6 text-accent" />
              <span className="font-medium">2 Year Warranty</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
