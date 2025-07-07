import React, { useEffect, useState } from 'react';
import Header from './Header';
import SidebarFilters from './SidebarFilters';
import ProductGrid from './ProductGrid';
import Newsletter from './Newsletter';
import Footer from './Footer';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';


function Products() {
  const [filters, setFilters] = useState({});
  const [allProducts, setAllProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'products'));
        const productList = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setAllProducts(productList);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div
      className="relative flex size-full min-h-screen flex-col bg-white group/design-root overflow-x-hidden"
      style={{ fontFamily: '"Noto Serif", "Noto Sans", sans-serif' }}
    >
      <div className="layout-container flex h-full grow flex-col">
        <Header />
        <div className="gap-1 px-4 md:px-6 flex flex-1 justify-center py-5">
          <SidebarFilters onFilterChange={setFilters} />
          <div className="layout-content-container flex flex-col max-w-[960px] flex-1">
            <ProductGrid products={allProducts} filters={filters} />
            <Newsletter />
            <Footer />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Products;
