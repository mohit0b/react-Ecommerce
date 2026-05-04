import { api } from '../services/api';

// Helper to extract intents/entities from text
function parseQuery(text, products) {
  const query = text.toLowerCase();
  let maxPrice = null;
  let category = null;

  // Extremely basic "NLP" entity extraction
  const priceMatch = query.match(/under\s*[$€£₹]?\s*(\d+)/) || query.match(/less than\s*[$€£₹]?\s*(\d+)/);
  if (priceMatch) {
    maxPrice = parseInt(priceMatch[1], 10);
  }

  const categories = [...new Set(products.map(p => p.category.toLowerCase()))];
  for (const c of categories) {
    if (query.includes(c)) {
      category = c;
      break;
    }
  }
  
  if (query.includes('shoe') || query.includes('sneaker')) category = 'footwear';
  if (query.includes('computer') || query.includes('laptop')) category = 'computers';
  if (query.includes('headphone') || query.includes('earbud')) category = 'electronics';

  return { maxPrice, category, original: query };
}

// Simulates an LLM recommendation call
export const simulateAIRecommendation = async (query, userContext = {}) => {
  const products = await api.getProducts();

  return new Promise((resolve) => {
    setTimeout(() => {
      const intent = parseQuery(query, products);
      let results = products;

      if (intent.category) {
        results = results.filter(p => p.category.toLowerCase() === intent.category);
      }
      
      if (intent.maxPrice) {
        results = results.filter(p => p.price <= intent.maxPrice);
      } else if (query.includes('best') || query.includes('top')) {
         // Sort by rating if asking for "best"
         results.sort((a,b) => b.rating - a.rating);
      }

      // If user context exists (e.g. recently viewed), we could boost related items, but let's keep it simple
      const recommended = results.slice(0, 3);
      
      let reasoning = `Based on your request for "${query}"`;
      if (intent.category) reasoning += ` in the ${intent.category} category`;
      if (intent.maxPrice) reasoning += ` under ₹${intent.maxPrice}`;
      reasoning += `. I found ${recommended.length} great option(s) for you.`;

      resolve({
        response: reasoning,
        products: recommended,
        filtersApplied: intent
      });
    }, 1200); // Simulate "thinking" time
  });
};

// Generates dynamic homepage recommendations based on user actions
export const getDynamicRecommendations = async (userActions, currentCart) => {
    const products = await api.getProducts();
    const categoriesInteracted = new Set();
    
    userActions.forEach(action => {
        const p = products.find(prod => prod.name === action.item);
        if (p) categoriesInteracted.add(p.category);
    });
    
    currentCart.forEach(item => categoriesInteracted.add(item.category));
    
    if (categoriesInteracted.size === 0) return products.slice(0, 4); // Default trending

    // Recommend products in the categories they interacted with but aren't in their cart
    const cartIds = new Set(currentCart.map(i => i.id));
    const recommendations = products.filter(p => 
        categoriesInteracted.has(p.category) && !cartIds.has(p.id)
    );

    return recommendations.slice(0, 4);
};

