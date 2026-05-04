import fs from 'fs';
import path from 'path';

const newProducts = Array.from({ length: 45 }).map((_, i) => {
  const id = `new-prod-${i}-${Date.now()}`;
  return {
    id,
    image: "images/products/athletic-cotton-socks-6-pairs.jpg", // Using existing placeholder image
    name: `Premium AI Generated Product ${i + 1}`,
    rating: {
      stars: (Math.random() * 2 + 3).toFixed(1), // 3.0 to 5.0
      count: Math.floor(Math.random() * 500) + 10
    },
    priceCents: Math.floor(Math.random() * 10000) + 500, // $5.00 to $105.00
    keywords: ["ai", "generated", "mock", "new"]
  };
});

const defaultProductsPath = path.join(process.cwd(), 'defaultData', 'defaultProducts.js');
let content = fs.readFileSync(defaultProductsPath, 'utf-8');

// Find the last index of '];'
const lastIndex = content.lastIndexOf('];');
if (lastIndex !== -1) {
  const before = content.slice(0, lastIndex);
  const productsString = newProducts.map(p => ',\n  ' + JSON.stringify(p, null, 2)).join('');
  
  const newContent = before + productsString + '\n];';
  fs.writeFileSync(defaultProductsPath, newContent, 'utf-8');
  console.log('Successfully appended 45 products to defaultProducts.js');
} else {
  console.error('Could not find the end of the array');
}

// Delete database.sqlite so it reseeds
const dbPath = path.join(process.cwd(), 'database.sqlite');
if (fs.existsSync(dbPath)) {
  fs.unlinkSync(dbPath);
  console.log('Deleted database.sqlite to trigger reseeding');
}
