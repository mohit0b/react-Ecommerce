import axios from 'axios';

// Simulate network delay for non-backend methods if needed
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const api = {
  getProducts: async () => {
    const response = await axios.get('/api/products');
    // The backend uses priceCents, but our UI uses price (dollars). Let's map it.
    return response.data.map(p => ({
      ...p,
      image: '/' + p.image,
      price: p.priceCents ? p.priceCents / 100 : p.price,
      // Map properties if needed to match frontend expectations
      category: p.keywords && p.keywords.length > 0 ? p.keywords[0] : 'General',
      rating: p.rating ? p.rating.stars : 4.0,
      reviews: p.rating ? p.rating.count : Math.floor(Math.random() * 500),
      features: ["Quality product", "Highly rated"],
      description: "A great product from our catalog."
    }));
  },
  
  getProductById: async (id) => {
    const products = await api.getProducts();
    const product = products.find(p => p.id === id || p.id === parseInt(id));
    if (!product) throw new Error('Product not found');
    return product;
  },

  searchProducts: async (query, filters = {}) => {
    // We can fetch all and filter in frontend, or use backend ?search=
    let url = '/api/products';
    if (query) url += `?search=${encodeURIComponent(query)}`;
    
    const response = await axios.get(url);
    let results = response.data.map(p => ({
      ...p,
      image: '/' + p.image,
      price: p.priceCents ? p.priceCents / 100 : p.price,
      category: p.keywords && p.keywords.length > 0 ? p.keywords[0].charAt(0).toUpperCase() + p.keywords[0].slice(1) : 'General',
      rating: p.rating ? p.rating.stars : 4.0,
      reviews: p.rating ? p.rating.count : Math.floor(Math.random() * 500),
      features: ["Quality product", "Highly rated"],
      description: "A great product from our catalog."
    }));

    if (filters.category && filters.category !== 'All') {
      const cat = filters.category.toLowerCase();
      results = results.filter(p => p.keywords && p.keywords.some(k => k.toLowerCase() === cat));
    }

    if (filters.maxPrice) {
      results = results.filter(p => p.price <= filters.maxPrice);
    }

    if (filters.sort) {
      switch (filters.sort) {
        case 'price-asc':
          results.sort((a, b) => a.price - b.price);
          break;
        case 'price-desc':
          results.sort((a, b) => b.price - a.price);
          break;
        case 'rating-desc':
          results.sort((a, b) => b.rating - a.rating);
          break;
        default:
          break;
      }
    }

    return results;
  },

  submitOrder: async (orderData) => {
    await delay(1500);
    return { success: true, orderId: Math.random().toString(36).substring(7) };
  },

  login: async (email, password) => {
    const response = await axios.post('/api/auth/login', { email, password });
    return response.data;
  },

  register: async (name, email, password) => {
    const response = await axios.post('/api/auth/register', { name, email, password });
    return response.data;
  }
};

