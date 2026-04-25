import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import axios from "axios";
import './checkout.css';

export function CheckoutPage({ cart, loadCart,loadOrders }) {

  const total = cart.reduce((sum, item) => {
    return sum + (item.product.priceCents * item.quantity);
  }, 0);

 const placeOrder = async () => {
  try {
    await axios.post('/api/orders'); 

    await loadCart();
    await loadOrders();

    alert("✅ Order placed successfully!");
  } catch (err) {
    console.error(err);
    alert("❌ Order failed");
  }
};
console.log(cart)

  return (
    <>
      <Navbar />

      <main className="container">
        <div className="checkout-grid">

          {/* LEFT SIDE */}
          <div className="checkout-main">
            <h1 className="page-title">Checkout</h1>

            {/* SHIPPING */}
            <section className="checkout-section">
              <div className="section-header">
                <span className="step-number">01</span>
                <h2>Shipping Address</h2>
              </div>

              <div className="form-grid">
                <div className="form-group full-width">
                  <label>Full Name</label>
                  <input className="checkout-input" placeholder="John Doe" />
                </div>

                <div className="form-group full-width">
                  <label>Address</label>
                  <input className="checkout-input" placeholder="Street Address" />
                </div>

                <div className="form-group">
                  <label>City</label>
                  <input className="checkout-input" placeholder="City" />
                </div>

                <div className="form-group">
                  <label>Zip Code</label>
                  <input className="checkout-input" placeholder="000000" />
                </div>

                <div className="form-group full-width">
                  <label>Email</label>
                  <input className="checkout-input" placeholder="email@example.com" />
                </div>
              </div>
            </section>

            {/* PAYMENT */}
            <section className="checkout-section">
              <div className="section-header">
                <span className="step-number">02</span>
                <h2>Payment Details</h2>
              </div>

              <div className="form-grid payment-grid">
                <div className="form-group full-width-mobile">
                  <label>Card Number</label>
                  <input className="checkout-input" placeholder="0000 0000 0000 0000" />
                </div>

                <div className="form-group">
                  <label>Expiry</label>
                  <input className="checkout-input" placeholder="MM/YY" />
                </div>

                <div className="form-group">
                  <label>CVV</label>
                  <input className="checkout-input" placeholder="***" />
                </div>
              </div>
            </section>
          </div>

          {/* RIGHT SIDE */}
          <div className="checkout-sidebar">
            <div className="sticky-summary">

              <h3 className="summary-title">Order Summary</h3>

              <div className="summary-items">
                {cart.length === 0 ? (
                  <p>Your cart is empty</p>
                ) : (
                  cart.map((cartItem) => {

                    const deleteFromCart = async () => {
                      await axios.delete(`/api/cart-items/${cartItem.productId}`);
                      await loadCart();
                    };

                    const updateQuantity = async (newQty) => {
                      if (newQty < 1) return; // prevent going below 1
                      await axios.put(`/api/cart-items/${cartItem.productId}`, {
                        quantity: newQty,
                      });
                      await loadCart();
                    };

                    return (
                      <div className="summary-item" key={cartItem.productId}>
                        <div className="item-img">
                          <img src={cartItem.product.image} alt={cartItem.product.name} />
                        </div>

                        <div className="item-info">
                          <div>
                            <p className="item-name">{cartItem.product.name}</p>

                            {/* Quantity Controls */}
                            <div className="qty-controls">
                              <button
                                className="qty-btn"
                                onClick={() => updateQuantity(cartItem.quantity - 1)}
                                disabled={cartItem.quantity <= 1}
                              >
                                −
                              </button>
                              <span className="qty-display">{cartItem.quantity}</span>
                              <button
                                className="qty-btn"
                                onClick={() => updateQuantity(cartItem.quantity + 1)}
                              >
                                +
                              </button>
                            </div>
                          </div>

                          <p className="item-price">
                            ₹{(cartItem.product.priceCents * cartItem.quantity) / 100}
                          </p>
                          <button className="del-btn" onClick={() => deleteFromCart()}>Delete</button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {cart.length > 0 && (
                <div className="summary-total">
                  <span className="total-label">Total</span>
                  <div className="total-val-box">
                    <span className="est-label">Estimated Total</span>
                    <span className="total-price">₹{(total / 100).toFixed(2)}</span>
                  </div>
                </div>
              )}

              {cart.length > 0 && (
                <button className="purchase-btn" onClick={placeOrder} >
                  COMPLETE PURCHASE
                </button>
              )}

            </div>
          </div>

        </div>
      </main>

      <Footer />
    </>
  );
}