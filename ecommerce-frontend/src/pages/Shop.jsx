import { useState, useEffect } from 'react';
import { api } from '../services/api';
import { ProductCard, ProductSkeleton } from '../components/ProductCard';
import { Filter, SlidersHorizontal, SearchX, ChevronDown } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

export const Shop = () => {
  const { state, dispatch } = useAppContext();
  const [products, setProducts] = useState([]);
  const [allFetchedProducts, setAllFetchedProducts] = useState([]); // Used to extract all categories
  const [loading, setLoading] = useState(true);
  
  // Local filter state synced with context query
  const [query, setQuery] = useState(state.searchQuery || '');
  const [category, setCategory] = useState('All');
  const [maxPrice, setMaxPrice] = useState(10500); // Increased max price for backend data
  const [sort, setSort] = useState(''); // '', 'price-asc', 'price-desc', 'rating-desc'

  // Categories computed dynamically from backend
  const [categories, setCategories] = useState(['All']);

  useEffect(() => {
    // If context search query changes (from navbar), update local
    if (state.searchQuery !== query) {
      setQuery(state.searchQuery);
    }
  }, [state.searchQuery]);

  // Initial fetch to get all products and derive unique categories
  useEffect(() => {
    const fetchAllForCategories = async () => {
      try {
        const results = await api.getProducts();
        setAllFetchedProducts(results);
        const uniqueCategories = ['All', ...new Set(results.map(p => p.category))];
        setCategories(uniqueCategories);
      } catch (err) {
        console.error(err);
      }
    };
    fetchAllForCategories();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const results = await api.searchProducts(query, { category, maxPrice, sort });
        setProducts(results);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    const timer = setTimeout(() => {
      fetchProducts();
    }, 300); // debounce

    return () => clearTimeout(timer);
  }, [query, category, maxPrice, sort]);

  const handleSearch = (e) => {
    setQuery(e.target.value);
    dispatch({ type: 'SET_SEARCH_QUERY', payload: e.target.value });
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-8 flex flex-col md:flex-row gap-8">
      {/* Sidebar Filters */}
      <aside className="w-full md:w-64 shrink-0">
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm sticky top-28">
          <div className="flex items-center gap-2 font-bold text-lg mb-6 pb-4 border-b border-gray-100">
            <SlidersHorizontal className="w-5 h-5" /> Filters
          </div>

          <div className="mb-6">
            <h3 className="font-semibold mb-3">Category</h3>
            <div className="space-y-2 max-h-60 overflow-y-auto custom-scrollbar pr-2">
              {categories.map(c => (
                <label key={c} className="flex items-center gap-3 cursor-pointer group">
                  <input 
                    type="radio" 
                    name="category" 
                    value={c}
                    checked={category === c}
                    onChange={(e) => {
                      setCategory(e.target.value);
                      dispatch({ type: 'LOG_ACTION', payload: { type: 'filter_category', value: e.target.value } });
                    }}
                    className="w-4 h-4 text-accent border-gray-300 focus:ring-accent"
                  />
                  <span className={`text-sm ${category === c ? 'font-medium text-primary' : 'text-gray-500 group-hover:text-primary'}`}>{c}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-semibold">Max Price</h3>
              <span className="text-sm font-bold text-accent">₹{maxPrice}</span>
            </div>
            <input 
              type="range" 
              min="0" 
              max="10500" 
              step="500"
              value={maxPrice}
              onChange={(e) => {
                setMaxPrice(Number(e.target.value));
              }}
              onMouseUp={() => dispatch({ type: 'LOG_ACTION', payload: { type: 'filter_price', value: maxPrice } })}
              className="w-full accent-accent"
            />
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1">
        <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold">All Products</h1>
            <p className="text-gray-500 mt-1">Showing {products.length} results</p>
          </div>
          
          <div className="flex gap-4 w-full sm:w-auto">
            {/* Mobile search is synced with this input */}
            <input 
              type="text"
              value={query}
              onChange={handleSearch}
              placeholder="Search products..."
              className="w-full sm:w-64 bg-white border border-gray-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-accent outline-none"
            />
            
            {/* Sort Dropdown */}
            <div className="relative shrink-0">
              <select 
                value={sort} 
                onChange={(e) => {
                  setSort(e.target.value);
                  dispatch({ type: 'LOG_ACTION', payload: { type: 'sort', value: e.target.value } });
                }}
                className="appearance-none bg-white border border-gray-200 rounded-lg px-4 py-2 pr-10 focus:ring-2 focus:ring-accent outline-none cursor-pointer text-gray-700 font-medium"
              >
                <option value="">Sort by: Featured</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating-desc">Highest Rated</option>
              </select>
              <ChevronDown className="w-4 h-4 text-gray-500 absolute right-3 top-3 pointer-events-none" />
            </div>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array(6).fill(0).map((_, i) => <ProductSkeleton key={i} />)}
          </div>
        ) : products.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-gray-100 flex flex-col items-center justify-center min-h-[400px]">
            <div className="bg-gray-50 p-4 rounded-full mb-4">
              <SearchX className="w-12 h-12 text-gray-400" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">No products found</h2>
            <p className="text-gray-500">Try adjusting your filters or search query.</p>
            <button 
              onClick={() => {
                setQuery('');
                setCategory('All');
                setMaxPrice(10500);
                setSort('');
              }}
              className="mt-6 text-accent font-medium hover:underline"
            >
              Clear all filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

