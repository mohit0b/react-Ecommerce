export function getProductDetails(product) {
  const keywords = product.keywords;

  if (keywords.includes("apparel") || keywords.includes("womens") || keywords.includes("mens")) {
    return {
      description: "Comfortable and stylish apparel designed for everyday wear with premium quality fabric.",
      features: [
        "Soft and breathable fabric for all-day comfort.",
        "Modern fit designed for style and flexibility.",
        "Durable stitching for long-lasting use."
      ],
      materials: "Made with high-quality fabric ensuring comfort, durability, and long-lasting performance.",
      dimensions: {
        width: "Standard Fit",
        depth: "-",
        height: "-"
      }
    };
  }

  if (keywords.includes("kitchen") || keywords.includes("appliances")) {
    return {
      description: "High-performance kitchen product built for efficiency and durability.",
      features: [
        "Heat-resistant and durable construction.",
        "Ergonomic design for ease of use.",
        "Premium quality finish."
      ],
      materials: "Crafted using high-grade materials ensuring long-term durability and safety.",
      dimensions: {
        width: "Varies",
        depth: "Varies",
        height: "Varies"
      }
    };
  }

  return {
    description: "Premium quality product designed for everyday usage.",
    features: [
      "Reliable and durable design.",
      "User-friendly functionality.",
      "High-quality materials."
    ],
    materials: "Made using premium-grade materials.",
    dimensions: {
      width: "Standard",
      depth: "Standard",
      height: "Standard"
    }
  };
}