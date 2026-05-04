import fs from 'fs';
import path from 'path';

const defaultProductsPath = path.join(process.cwd(), 'defaultData', 'defaultProducts.js');

async function run() {
  const { defaultProducts } = await import(`file://${defaultProductsPath}?update=${Date.now()}`);
  
  const updatedProducts = defaultProducts.map(p => {
    if (p.name.startsWith('Premium AI Generated Product')) {
      const imgName = p.image.toLowerCase();
      let realName = "Premium Item";
      let realCategory = "General";
      let priceBase = 500;
      
      if (imgName.includes('shoe') || imgName.includes('sneaker')) {
        realName = "Classic Comfort Sneakers";
        if (imgName.includes('athletic')) realName = "Pro Athletic Running Shoes";
        else if (imgName.includes('flat')) realName = "Casual Flat Sneakers";
        else if (imgName.includes('skateboard')) realName = "Urban Skateboard Shoes";
        realCategory = "Footwear";
        priceBase = 2500;
      } else if (imgName.includes('sandal') || imgName.includes('heel')) {
        realName = "Elegant Women's Sandals";
        realCategory = "Footwear";
        priceBase = 1800;
      } else if (imgName.includes('shirt') || imgName.includes('tshirt') || imgName.includes('polo')) {
        realName = "Premium Cotton T-Shirt";
        if (imgName.includes('golf')) realName = "Performance Golf Polo";
        realCategory = "Apparel";
        priceBase = 900;
      } else if (imgName.includes('sweater') || imgName.includes('hoodie')) {
        realName = "Cozy Fleece Winter Hoodie";
        if (imgName.includes('wool')) realName = "Merino Wool Blend Sweater";
        realCategory = "Apparel";
        priceBase = 2200;
      } else if (imgName.includes('pants') || imgName.includes('shorts') || imgName.includes('chino')) {
        realName = "Classic Fit Chino Pants";
        if (imgName.includes('lounge')) realName = "Relaxed Lounge Pants";
        if (imgName.includes('jean')) realName = "Summer Denim Shorts";
        realCategory = "Apparel";
        priceBase = 1500;
      } else if (imgName.includes('dress') || imgName.includes('robe')) {
        realName = "Striped Summer Beach Dress";
        realCategory = "Apparel";
        priceBase = 1800;
      } else if (imgName.includes('hat') || imgName.includes('beanie')) {
        realName = "Classic Straw Sun Hat";
        if (imgName.includes('beanie')) realName = "Winter Knit Pom Beanie";
        realCategory = "Accessories";
        priceBase = 600;
      } else if (imgName.includes('sunglass') || imgName.includes('earring')) {
        realName = "Vintage Round Sunglasses";
        if (imgName.includes('earring')) realName = "Crystal Zirconia Stud Earrings";
        realCategory = "Accessories";
        priceBase = 1200;
      } else if (imgName.includes('toaster') || imgName.includes('kettle') || imgName.includes('blender') || imgName.includes('espresso')) {
        realName = "Smart Electric Toaster";
        if (imgName.includes('kettle')) realName = "Steel Hot Water Kettle";
        if (imgName.includes('blender')) realName = "High-Speed Countertop Blender";
        if (imgName.includes('espresso')) realName = "Premium Espresso Maker";
        realCategory = "Kitchen";
        priceBase = 4500;
      } else if (imgName.includes('bowl') || imgName.includes('plate') || imgName.includes('cooking')) {
        realName = "Ceramic Dining Plate Set";
        if (imgName.includes('bowl')) realName = "Artistic Ceramic Bowl Set";
        if (imgName.includes('cooking')) realName = "Non-Stick Cooking Pot Set";
        realCategory = "Kitchen";
        priceBase = 3200;
      } else if (imgName.includes('towel') || imgName.includes('mat') || imgName.includes('curtain') || imgName.includes('duvet')) {
        realName = "Luxury Cotton Bath Towel Set";
        if (imgName.includes('mat')) realName = "Plush Bathroom Bath Mat";
        if (imgName.includes('curtain')) realName = "Premium Blackout Curtains";
        if (imgName.includes('duvet')) realName = "Diamond Pattern Duvet Cover";
        realCategory = "Home";
        priceBase = 2000;
      } else if (imgName.includes('sock')) {
        realName = "Athletic Cotton Socks - 6 Pairs";
        realCategory = "Apparel";
        priceBase = 800;
      } else if (imgName.includes('tissue') || imgName.includes('detergent')) {
        realName = "Ultra Soft Facial Tissues";
        if (imgName.includes('detergent')) realName = "Advanced Laundry Detergent Tabs";
        realCategory = "Household";
        priceBase = 500;
      } else if (imgName.includes('basketball')) {
        realName = "Pro Indoor/Outdoor Basketball";
        realCategory = "Sports";
        priceBase = 1600;
      }
      
      // Slightly randomize price around base
      const finalPrice = Math.floor(priceBase + (Math.random() * priceBase * 0.4) - (priceBase * 0.2));

      return {
        ...p,
        name: realName + ` ${Math.floor(Math.random() * 100)}`, // Just to make them somewhat unique if duplicated
        keywords: [realCategory],
        priceCents: finalPrice * 100 // Scale to cents
      };
    }
    
    // For original products, we need to update price to be more realistic for Rupees
    return {
      ...p,
      priceCents: p.priceCents * 80 // Convert original USD cents to INR cents approx (x80)
    };
  });

  const newContent = `export const defaultProducts = ${JSON.stringify(updatedProducts, null, 2)};`;
  fs.writeFileSync(defaultProductsPath, newContent, 'utf-8');
  console.log('Successfully updated product names and converted prices to Rupees.');

  // Delete database.sqlite so it reseeds
  const dbPath = path.join(process.cwd(), 'database.sqlite');
  if (fs.existsSync(dbPath)) {
    fs.unlinkSync(dbPath);
    console.log('Deleted database.sqlite to trigger reseeding');
  }
}

run().catch(console.error);
