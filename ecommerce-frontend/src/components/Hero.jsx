import './hero.css';
export function Hero() {
    return (
        <>
        <section className="Hero-section">
        <div className="hero-components">
            <h1 className="hero-text">Shop <br /> Better</h1>
        <p className="hero-para">Explore products across electronics, fashion, and home essentials with competitive prices, fast delivery options, and trusted checkout experience.</p>
        <div className="hero-buttons">
            <button className="btn btn-explore">Explore Products</button>
            <button className="btn btn-monolith">View Deals</button>
        </div>
        </div>
        
    </section>
    </>
    );
}