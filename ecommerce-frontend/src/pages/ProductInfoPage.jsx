import { useParams } from "react-router-dom";
import { ProductDetail } from "../components/ProductDetails";
import axios from "axios";
import { Navbar } from "../components/Navbar";
import { useEffect, useState } from "react";

export function ProductInfoPage({loadCart}) {
  
  const { id } = useParams();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`/api/products`);
        
        // find product by id
        const foundProduct = response.data.find(p => p.id === id);

        setProduct(foundProduct);
      } catch (err) {
        console.error(err);
      }
    };

    fetchProduct();
  }, [id]);

  if (!product) {
    return <h2>Loading or Product Not Found...</h2>;
  }

  return (
    
    <>
    <Navbar />
    
  <ProductDetail product={product} loadCart={loadCart} />
  </>
);
}