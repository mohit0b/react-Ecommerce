import { useEffect, useState } from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ProductCard, ProductSkeleton } from '../components/ProductCard';
import { getDynamicRecommendations } from '../utils/ai';
import { useAppContext } from '../context/AppContext';
import { api } from '../services/api';

export const Home = () => {
  const { state } = useAppContext();
  const [recommendations, setRecommendations] = useState([]);
  const [trending, setTrending] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const allProducts = await api.getProducts();
        // Shuffle and take 4
        const shuffled = [...allProducts].sort(() => 0.5 - Math.random());
        setTrending(shuffled.slice(0, 4));
        
        // Dynamic Recommendations based on user actions
        const recs = await getDynamicRecommendations(state.userActions, state.cart);
        setRecommendations(recs);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [state.userActions, state.cart]);

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="relative px-6 py-20 lg:py-32 overflow-hidden bg-white">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-white to-purple-50/50"></div>
        <div className="max-w-7xl mx-auto relative z-10 flex flex-col items-center text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 text-accent font-medium text-sm mb-6 border border-blue-100 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <Sparkles className="w-4 h-4" />
            <span>AI-Powered Shopping Experience</span>
          </div>
          <h1 className="text-5xl lg:text-7xl font-extrabold tracking-tight text-primary mb-6 animate-in fade-in slide-in-from-bottom-6 duration-700">
            Future of Commerce is <br className="hidden md:block"/> 
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-purple-600">
              Intelligent.
            </span>
          </h1>
          <p className="text-lg lg:text-xl text-gray-500 max-w-2xl mb-10 animate-in fade-in slide-in-from-bottom-8 duration-700">
            Discover products curated specifically for you. Our AI analyzes your preferences to recommend exactly what you need.
          </p>
          <div className="flex gap-4 animate-in fade-in slide-in-from-bottom-10 duration-700">
            <Link to="/shop" className="bg-primary hover:bg-gray-800 text-white px-8 py-4 rounded-full font-bold transition-all shadow-lg hover:shadow-xl flex items-center gap-2 group">
              Shop Now <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      {/* AI Recommendations */}
      <section className="py-20 px-6 max-w-7xl mx-auto">
        <div className="flex items-end justify-between mb-10">
          <div>
            <h2 className="text-3xl font-bold flex items-center gap-2">
              <Sparkles className="text-purple-500" /> Curated For You
            </h2>
            <p className="text-gray-500 mt-2">Based on your recent activity</p>
          </div>
          <Link to="/shop" className="text-accent font-medium hover:underline hidden sm:block">View All</Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {loading 
            ? Array(4).fill(0).map((_, i) => <ProductSkeleton key={i} />)
            : recommendations.length > 0 
              ? recommendations.map(product => <ProductCard key={product.id} product={product} />)
              : trending.map(product => <ProductCard key={product.id} product={product} />)
          }
        </div>
      </section>

      {/* Recently Viewed */}
      {state.recentlyViewed.length > 0 && (
        <section className="py-12 px-6 max-w-7xl mx-auto border-t border-gray-100">
          <h2 className="text-2xl font-bold mb-8">Recently Viewed</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {state.recentlyViewed.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};