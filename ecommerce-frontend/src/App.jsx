import './App.css'
import { HomePage } from './pages/Home'
import { ProductsPage } from './pages/ProductsPage'
import { Routes, Route } from 'react-router-dom'
import { OrdersPage } from './pages/OrdersPage'
import { CheckoutPage } from './pages/CheckoutPage'
import { NotFoundPage } from './pages/NotFoundPage'
import { AuthPage } from './pages/AuthPage'
import { AccountPage } from './pages/AccountPage'
import { useState,useEffect } from 'react'
import axios from 'axios'
import { TrackingPage } from './pages/TrackingPage'
import {ProductInfoPage} from './pages/ProductInfoPage'

function App() {
  const [cart, setCart] = useState([]);
    
      const loadCart = async () => {
        const response = await axios.get('/api/cart-items?expand=product')
        setCart(response.data)
  
      }
    useEffect(() => {
  
      loadCart();
    }, [])
    const [orders, setOrders] = useState([]);
        
          const loadOrders = async () => {
            const response = await axios.get('/api/orders?expand=product')
            setOrders(response.data)
      
          }
        useEffect(() => {
      
          loadOrders();
        }, [])
    

  return (
     <Routes>
          <Route index element={<HomePage  />} />
          <Route path="products" element={<ProductsPage loadCart={loadCart} />} />
          <Route path="orders" element={<OrdersPage orders={orders}/>} />
          <Route path="checkout" element={<CheckoutPage cart={cart} loadCart={loadCart} loadOrders={loadOrders}/>} />
          <Route path='tracking' element={<TrackingPage />}/>
          <Route path="login" element={<AuthPage />} />
          <Route path="account" element={<AccountPage />} />
          <Route path="*" element={<NotFoundPage />} />
          <Route path="/product/:id" element={<ProductInfoPage loadCart={loadCart} />} />
        </Routes>
  )
}

export default App
