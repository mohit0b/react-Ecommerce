import { Navbar } from '../components/Navbar'
import { Hero } from '../components/Hero'
import { Footer } from '../components/Footer'
import Obsidian from '../assets/images/obsidian.png'
import Monolith from '../assets/images/monolith-Keyboard.png'
import OrbitalSmart from '../assets/images/orbital-smart.png'
import VectraDesk from '../assets/images/vectra-deskLamp.png'
import Window from '../assets/images/window.png'
import './home.css'
export function HomePage () {
     return (
        <>
          <Navbar />
          <Hero />
          <>
            <section className="featured-section">
              <div className="featured-collections">
                <div className="featured-grid">
                  <div className="category-1 category">
                    <span>Category</span>
                    <h1>Fashion</h1>
                    <p>Explore trendy apparel, footwear, and accessories.</p>
                  </div>
    
                  <div className="category-2 category">
                    <h2>Appliances</h2>
                  </div>
    
                  <div className="category-3 category">
                    <h2>Hi-Fi Audio</h2>
                  </div>
                </div>
    
              </div>
            </section>
    
            <section className="new-arrivals">
              <div className="arrival-wrapper">
                <div className="arrival-header">
                  <div className="arrival-column1">
                    <span className="latest">THE LATEST</span>
                    <h2 className="arrival-heading">New Arrivals</h2>
                  </div>
                  <div>
                    <p className="arrival-para">Exhibiting the latest advancements in structural electronics and sensory
                      design.</p>
                  </div>
    
                </div>
              </div>
    
    
              <div className="products-cards">
                <article className="feature-card">
                  <div className="feature-image-box">
                    <img src={Obsidian} alt="Product Display" />
                  </div>
    
                  <div className="feature-info">
                    <div className="product-info">
                      <h4 className="product-name">The Obsidian Soundbar</h4>
                      <p className="special-feature">Pure Resonance</p>
                    </div>
    
                    <p className="price">&#8377;2,450</p>
                  </div>
                </article>
    
                <article className="feature-card">
                  <div className="feature-image-box">
                    <img src={Monolith} alt="Product Display" />
                  </div>
    
                  <div className="feature-info">
                    <div className="product-info">
                      <h4 className="product-name">Monolith Keyboard</h4>
                      <p className="special-feature">Tactile Precision</p>
                    </div>
    
                    <p className="price">&#8377;850</p>
                  </div>
                </article>
    
                <article className="feature-card">
                  <div className="feature-image-box">
                    <img src={OrbitalSmart} alt="Product Display" />
                  </div>
    
                  <div className="feature-info">
                    <div className="product-info">
                      <h4 className="product-name">Orbital Smart Hub</h4>
                      <p className="special-feature">Unified Control</p>
                    </div>
    
                    <p className="price">&#8377;1,100</p>
                  </div>
                </article>
    
                <article className="feature-card">
                  <div className="feature-image-box">
                    <img src={VectraDesk} alt="Product Display" />
                  </div>
    
                  <div className="feature-info">
                    <div className="product-info">
                      <h4 className="product-name">Vectra Desk Lamp</h4>
                      <p className="special-feature">Sculpted Light</p>
                    </div>
    
                    <p className="price">&#8377;620</p>
                  </div>
                </article>
    
    
              </div>
            </section>
    
            <section className="narrative-section">
              <div className="narrative-flex">
                <div className="narrative-img-side">
                  <div className="narrative-img-container">
                    <img alt="Minimalist modern office interior"
                      src={Window} />
                    <div className="narrative-overlay"></div>
                  </div>
                  <div className="narrative-badge">
                    Since Today: Simplifying the future of shopping.
                  </div>
                </div>
                <div className="narrative-text-side">
                  <span className="philosophy-tag">Our Philosophy</span>
                  <h2 className="narrative-title">Built for Smarter Online Shopping.</h2>
                  <div className="narrative-body">
                    <p>
                      At our platform, we focus on delivering a seamless and convenient shopping experience. We bring together a wide range of products across categories like electronics, fashion, home, and more—so you can find everything you need in one place.
                    </p>
                    <p>
                      Our goal is to make online shopping easy, transparent, and dependable with clear product information, smooth navigation, and user-friendly design. This project is built to demonstrate a scalable and modern eCommerce interface using real-world design practices.
                    </p>
                  </div>
                  <button className="learn-more">
                    LEARN ABOUT OUR PROCESS <span className="material-symbols-outlined">arrow_forward</span>
                  </button>
                </div>
              </div>
            </section>
            <section className="experience-section">
  <div className="experience-container">
    <h2 className="experience-title">Why Shop With Us</h2>
    
    <p className="experience-desc">
      Designed to provide a smooth and reliable online shopping journey with easy navigation, fast checkout, and secure transactions.
    </p>

    <div className="locations">
      <div className="location-item">
        <p className="location-tag">Fast Delivery</p>
        <p className="location-addr">Quick and reliable shipping options</p>
      </div>

      <div className="location-item">
        <p className="location-tag">Secure Payments</p>
        <p className="location-addr">Multiple safe and trusted payment methods</p>
      </div>

      <div className="location-item">
        <p className="location-tag">Easy Returns</p>
        <p className="location-addr">Hassle-free return and refund process</p>
      </div>
    </div>
  </div>
</section>
          </>
          <Footer />
        </>
        
      )
}