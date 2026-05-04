import { Routes, Route } from 'react-router-dom';
import { Home } from './pages/Home';
import { Shop } from './pages/Shop';
import { ProductDetail } from './pages/ProductDetail';
import { Checkout } from './pages/Checkout';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Navbar } from './components/Navbar';
import { CartDrawer } from './components/CartDrawer';
import { AIChatbot } from './components/AIChatbot';
import { DebugPanel } from './components/DebugPanel';
import { useAppContext } from './context/AppContext';

function App() {
  const { state } = useAppContext();

  return (
    <div className="min-h-screen bg-[#f5f5f7] text-gray-900 font-sans relative">
      <Navbar />
      
      <main className="pt-20 pb-16">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="*" element={<div className="p-20 text-center text-2xl font-bold">404 Not Found</div>} />
        </Routes>
      </main>

      <CartDrawer isOpen={state.isCartOpen} />
      <AIChatbot />
      <DebugPanel />
    </div>
  );
}

export default App;
