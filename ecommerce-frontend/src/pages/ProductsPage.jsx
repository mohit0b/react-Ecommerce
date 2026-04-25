import axios from "axios";
import "./ProductsPage.css";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import { Products } from "../components/Products";
import { useState, useEffect } from "react";

export function ProductsPage({ loadCart }) {
  const [filter, setFilter] = useState("all");
  const [sort, setSort] = useState("recommensded");
  const [products, setProducts] = useState([]);

  // FETCH PRODUCTS
  useEffect(() => {
    const getProducts = async () => {
      try {
        const response = await axios.get("/api/products");
        setProducts(response.data);
      } catch (err) {
        console.error(err);
      }
    };

    getProducts();
  }, []);

  // CATEGORY MAP (important for real filtering)
  const categoryMap = {
    mens: ["mens"],
    womenss: ["womenss"],
    home: ["home"],
  };

  // FILTER + SORT LOGIC
  const filteredProducts = products
    .filter((product) => {
      if (filter === "all") return true;

      return categoryMap[filter]?.some((cat) =>
        product.keywords?.includes(cat)
      );
    })
    .sort((a, b) => {
      if (sort === "lowToHigh") {
        return a.priceCents - b.priceCents;
      }

      if (sort === "highToLow") {
        return b.priceCents - a.priceCents;
      }

      if (sort === "rating") {
        return b.rating.stars - a.rating.stars;
      }

      return 0; // recommensded
    });

  return (
    <>
      <Navbar />

      <main>
        {/* HERO */}
        <header>
          <div className="hero-inner">
            <div>
              <span className="eyebrow">Electron Commerce Presents</span>
              <h1>The Products Series</h1>
            </div>
          </div>
        </header>

        {/* FILTERS */}
        <section className="filters">
          {/* LEFT FILTER BUTTONS */}
          <div className="filter-pills">
            <button
              className={`pill ${filter === "all" ? "active" : ""}`}
              onClick={() => setFilter("all")}
            >
              All Objects
            </button>

            <button
              className={`pill ${filter === "mens" ? "active" : ""}`}
              onClick={() => setFilter("mens")}
            >
              Men
            </button>

            <button
              className={`pill ${filter === "womenss" ? "active" : ""}`}
              onClick={() => setFilter("womenss")}
            >
              Women
            </button>

            <button
              className={`pill ${filter === "home" ? "active" : ""}`}
              onClick={() => setFilter("home")}
            >
              Home
            </button>
          </div>

          {/* RIGHT SIDE SORT */}
          <div className="filter-right">
            <div className="price-section">
              <span className="price-label">Price Range</span>
              <div className="price-divider"></div>
              <span className="price-range">₹400 — ₹2,500</span>
            </div>

            <span className="sort-arrow">Sort:</span>

            <select
              className="sort-control"
              value={sort}
              onChange={(e) => setSort(e.target.value)}
            >
              <option value="recommensded">Recommensded</option>
              <option value="lowToHigh">Price: Low to High</option>
              <option value="highToLow">Price: High to Low</option>
              <option value="rating">Top Rated</option>
            </select>
          </div>
        </section>

        {/* PRODUCTS GRID */}
        <div className="grid">
          {filteredProducts.length === 0 ? (
            <p style={{ textAlign: "center", marginTop: "50px" }}>
              No products found 😢
            </p>
          ) : (
            filteredProducts.map((product) => (
              <Products
                key={product.id}
                product={product}
                loadCart={loadCart}
              />
            ))
          )}
        </div>
      </main>

      <Footer />
    </>
  );
}