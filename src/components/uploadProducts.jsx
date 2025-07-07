import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { db } from './firebase';
import { collection, getDocs } from "firebase/firestore"; 

function ProductGrid() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "products"));
        const productsData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setProducts(productsData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching products: ", error);
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return <div className="p-4">Loading products...</div>;
  }

  return (
    <>
      {/* Breadcrumb */}
      <div className="flex flex-wrap gap-2 p-4">
        <Link to="/" className="text-[#757575] text-base font-medium leading-normal hover:text-[#0c77f2] transition">Home</Link>
        <span className="text-[#757575] text-base font-medium leading-normal">/</span>
        <span className="text-[#141414] text-base font-medium leading-normal">Ready to Wear</span>
      </div>

      {/* Rest of your component remains the same */}
      {/* ... */}
    </>
  );
}

export default ProductGrid;