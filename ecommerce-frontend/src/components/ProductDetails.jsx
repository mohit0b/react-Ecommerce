import "./productDetails.css";
import { useState } from "react";
import { getProductDetails } from "../utils/getProductDetails";
import { BASE_URL } from "../services/api";
import axios from "axios";

export function ProductDetail({ product ,loadCart}) {

  const details = getProductDetails(product);
  const price = (product.priceCents / 100).toFixed(2);

   const [quantity, setQuantity] = useState(1);
     const addToCart = async () => {
         await axios.post('/api/cart-items', {
             productId: product.id,
             quantity: quantity,
         });
 
         await loadCart();
     };
     
      const selectQuantity = (event) => {
         const quantitySelected = Number(event.target.value);
         setQuantity(quantitySelected);
     };
 

  return (
    <div className="product-container">

      <div className="product-main">

        {/* LEFT IMAGE */}
        <div className="product-left">
          <img src={`${BASE_URL}/${product.image}`} alt={product.name} />
        </div>

        {/* RIGHT DETAILS */}
        <div className="product-right">
          <h1 className="title">{product.name}</h1>

          {/* Rating */}
          <div className="rating">
            ⭐ {product.rating.stars} ({product.rating.count} reviews)
          </div>

          {/* Price */}
          <div className="price">₹{price}</div>

          {/* Description */}
          <p className="desc">{details.description}</p>

          {/* Quantity */}
          <div className="qty-box">
              <div className="select-wrapper">
                <label htmlFor={`qty-${product.id}`} className="qty-label">
                  Quantity:
                </label>

                <select className="qty-select" value={quantity} onChange={selectQuantity}>
                    {[...Array(10)].map((_, i) => (
                        <option key={i+1} value={i+1}>
                            {i+1}
                        </option>
                    ))}
                </select>
              </div>
            </div>

          {/* Buttons */}
          <div className="actions">
            <button className="add" onClick={() => addToCart()}>Add to Cart</button>
            <button className="buy">Buy Now</button>
          </div>
        </div>

      </div>

      {/* EXTRA DETAILS */}
      <div className="extra-section">

        <div className="extra-card">
          <h3>Detailed Features</h3>
          <ul>
            {details.features.map((f, i) => (
              <li key={i}>{f}</li>
            ))}
          </ul>
        </div>

        <div className="extra-card">
          <h3>Materials</h3>
          <p>{details.materials}</p>
        </div>

        <div className="extra-card">
          <h3>Dimensions</h3>

          <p><strong>Fit:</strong> {details.dimensions.width}</p>

          {details.dimensions.depth !== '-' && (
            <p><strong>Depth:</strong> {details.dimensions.depth}</p>
          )}

          {details.dimensions.height !== '-' && (
            <p><strong>Height:</strong> {details.dimensions.height}</p>
          )}

        </div>

      </div>

    </div>
  );
}