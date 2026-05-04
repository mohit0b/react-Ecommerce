import fs from 'fs';
import path from 'path';

const imagesDir = path.join(process.cwd(), 'images', 'products');
const allFiles = fs.readdirSync(imagesDir);
const validImages = allFiles.filter(file => file.endsWith('.jpg') || file.endsWith('.png'));

const defaultProductsPath = path.join(process.cwd(), 'defaultData', 'defaultProducts.js');

async function run() {
  const { defaultProducts } = await import(`file://${defaultProductsPath}?update=${Date.now()}`);
  
  // The first 40 are the originals.
  const originals = defaultProducts.slice(0, 40);
  
  // Re-generate the 45 new products
  const newProducts = Array.from({ length: 45 }).map((_, i) => {
    const id = `new-prod-${i}-${Date.now()}`;
    const randomImage = validImages[Math.floor(Math.random() * validImages.length)];
    
    // Assign a proper category based on image name to make it look realistic
    const imgName = randomImage.toLowerCase();
    let category = ["ai", "generated"];
    if(imgName.includes('shoe') || imgName.includes('sneaker') || imgName.includes('sandal')) category = ['footwear', 'shoes'];
    else if(imgName.includes('shirt') || imgName.includes('sweater') || imgName.includes('pants') || imgName.includes('shorts') || imgName.includes('hoodie')) category = ['apparel', 'clothing'];
    else if(imgName.includes('toaster') || imgName.includes('kettle') || imgName.includes('blender') || imgName.includes('espresso')) category = ['kitchen', 'appliances'];
    
    return {
      id,
      image: `images/products/${randomImage}`,
      name: `Premium AI Generated Product ${i + 1}`,
      rating: {
        stars: Number((Math.random() * 2 + 3).toFixed(1)), // 3.0 to 5.0
        count: Math.floor(Math.random() * 500) + 10
      },
      priceCents: Math.floor(Math.random() * 10000) + 500, // $5.00 to $105.00
      keywords: category
    };
  });

  const allProducts = [...originals, ...newProducts];
  const newContent = `export const defaultProducts = ${JSON.stringify(allProducts, null, 2)};`;
  
  fs.writeFileSync(defaultProductsPath, newContent, 'utf-8');
  console.log('Successfully updated defaultProducts.js with random images');

  // Delete database.sqlite so it reseeds
  const dbPath = path.join(process.cwd(), 'database.sqlite');
  if (fs.existsSync(dbPath)) {
    fs.unlinkSync(dbPath);
    console.log('Deleted database.sqlite to trigger reseeding');
  }
}

run().catch(console.error);
