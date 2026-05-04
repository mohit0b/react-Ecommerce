import fs from 'fs';
import path from 'path';

const defaultProductsPath = path.join(process.cwd(), 'defaultData', 'defaultProducts.js');

async function run() {
  const { defaultProducts } = await import(`file://${defaultProductsPath}?update=${Date.now()}`);
  
  const updatedProducts = defaultProducts.map(p => {
    let name = p.name;
    let priceCents = p.priceCents;
    let keywords = p.keywords || [];

    // 1. Fix names that look like placeholders
    if (name.includes('AI Generated') || /Product \d+/.test(name) || name === 'Premium Item') {
      const imgName = p.image.toLowerCase();
      if (imgName.includes('shoe') || imgName.includes('sneaker')) name = "Pro-Flex Performance Sneakers";
      else if (imgName.includes('sandal') || imgName.includes('heel')) name = "Designer Evening Sandals";
      else if (imgName.includes('shirt') || imgName.includes('tshirt') || imgName.includes('polo')) name = "Premium Cotton Essential Tee";
      else if (imgName.includes('sweater') || imgName.includes('hoodie')) name = "Arctic Fleece Winter Hoodie";
      else if (imgName.includes('pants') || imgName.includes('chino')) name = "Classic Straight-Fit Chinos";
      else if (imgName.includes('toaster')) name = "Express Dual-Slot Toaster";
      else if (imgName.includes('kettle')) name = "Smart Stainless Steel Kettle";
      else if (imgName.includes('blender')) name = "Turbo-Mix Professional Blender";
      else if (imgName.includes('espresso')) name = "Barista Home Espresso Maker";
      else if (imgName.includes('towel')) name = "Egyptian Cotton Towel Set";
      else if (imgName.includes('curtain')) name = "Blackout Thermal Curtains";
      else if (imgName.includes('sunglass')) name = "UV400 Polarized Sunglasses";
      else if (imgName.includes('earring')) name = "Elegant Solitaire Studs";
      else name = "Luxury Lifestyle Collection Item";
      
      // Add a small unique suffix
      name += " " + p.id.substring(0, 4).toUpperCase();
    }

    // 2. Fix unrealistic prices (anything under ₹200 is too low for this catalog)
    // If price is very low, it might be stuck in USD-like numbers. Multiply by 80.
    if (priceCents < 20000) { 
        priceCents = priceCents * 80;
    }
    
    // Ensure a minimum floor for any product
    if (priceCents < 49900) priceCents = 89900; 

    // 3. Fix "Ai" categories
    keywords = keywords.map(k => k.toLowerCase() === 'ai' ? 'Featured' : k);
    if (keywords.length === 0) keywords = ['General'];

    return {
      ...p,
      name,
      priceCents,
      keywords
    };
  });

  const newContent = `export const defaultProducts = ${JSON.stringify(updatedProducts, null, 2)};`;
  fs.writeFileSync(defaultProductsPath, newContent, 'utf-8');
  console.log('Cleanup complete. Real names and prices applied.');

  // Trigger reseed via API
  try {
    await fetch('http://localhost:3000/api/reset', { method: 'POST' });
    console.log('Database reseeded via /api/reset');
  } catch (e) {
    console.error('Failed to trigger reset via API. You may need to restart the server manually.');
  }
}

run().catch(console.error);
