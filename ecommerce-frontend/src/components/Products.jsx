import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router";
export function Products({product,loadCart}) {
  

 const [quantity, setQuantity] = useState(1);
 const navigate = useNavigate();
 
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
    <>
     
        <article className="col-4-flex">
          
          <div className="img-wrap img-4-5">
            <img src={product.image} alt={product.name} />
          </div>

          <div className="product-info">
            <div className="product-name-sm">{product.name}</div>
            
            <div className="product-rating-container">
                <img
                    className="product-rating-stars"
                    src={`images/ratings/rating-${product.rating.stars * 10}.png`}
                />
                <div className="product-rating-count link-primary">
                    {product.rating.count}
                </div>
            </div>

            <span className="product-price">
              ₹ {product.priceCents}
            </span>
            

            {/* ✅ Unique quantity selector */}
            <div className="quantity-select">
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

            {/* ✅ Proper button click */}
            <button className="view-product-button" onClick={() => navigate(`/product/${product.id}`)}>
        View Product
      </button>
            
            <button
              className="add-to-cart-btn"
              onClick={() => addToCart()}
            >
              Add to Cart
            </button>

          </div>
        </article>
      
    </>
  );
}