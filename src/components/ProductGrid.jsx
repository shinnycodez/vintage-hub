import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

function ProductGrid({ filters = {} }) {
  const queryParams = useQuery();
  const categoryFromURL = queryParams.get('category');
  const searchFromURL = queryParams.get('search')?.toLowerCase().trim();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const {
    category = [],
    size = [],
    color = [],
    available = [],
    priceRange = [0, Infinity],
  } = filters;

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const snapshot = await getDocs(collection(db, 'products'));
        const items = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setProducts(items);
      } catch (err) {
        console.error('Error fetching products:', err);
      }
      setLoading(false);
    };

    fetchProducts();
  }, []);

  const filteredProducts = products.filter((product) => {
    const matchesCategory = categoryFromURL
      ? product.category === categoryFromURL
      : category.length
      ? category.includes(product.category)
      : true;

    const matchesSize = size.length ? size.includes(product.size) : true;
    const matchesColor = color.length ? color.includes(product.color) : true;
    const matchesAvailability = available.length
      ? available.includes(product.available)
      : true;
    const matchesPrice =
      product.price >= priceRange[0] && product.price <= priceRange[1];

    const matchesSearch = searchFromURL
      ? product.title?.toLowerCase().includes(searchFromURL) ||
        product.description?.toLowerCase().includes(searchFromURL)
      : true;

    return (
      matchesCategory &&
      matchesSize &&
      matchesColor &&
      matchesAvailability &&
      matchesPrice &&
      matchesSearch
    );
  });

  const title = categoryFromURL || (searchFromURL ? `Results for "${searchFromURL}"` : 'All Products');

  if (loading) {
    return <p className="text-center p-8">Loading products...</p>;
  }

  return (
    <>
      {/* Breadcrumb */}
      <div className="flex flex-wrap gap-2 p-4">
        <Link
          to="/"
          className="text-[#757575] text-base font-medium hover:text-[#0c77f2] transition"
        >
          Home
        </Link>
        <span className="text-[#757575] text-base font-medium">/</span>
        <span className="text-[#141414] text-base font-medium">{title}</span>
      </div>

      {/* Page Title */}
      <div className="flex justify-between p-4">
        <p className="text-[#141414] text-[32px] font-bold">{title}</p>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 p-4">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <Link to={`/product/${product.id}`} key={product.id}>
              <div className="flex flex-col gap-3 pb-3 group shadow-md rounded-lg overflow-hidden transition-transform duration-300 hover:shadow-lg bg-[#FFF2EB]"> {/* Changed background color here */}
                {/* Product image */}
                <div className="w-full aspect-[3/4] overflow-hidden">
                  <img
                    src={product.coverImage || product.imageUrl}
                    alt={product.title}
                    className="w-full h-full object-cover object-top transition-transform duration-300 group-hover:scale-105"
                  />
                </div>

                {/* Product info */}
                <div className="px-3 pb-4 flex flex-col justify-between h-full">
                  <div>
                    <p className="text-[#141414] text-base font-medium">
                      {product.title}
                    </p>
                    <p className="text-[#757575] text-sm font-normal">
                      PKR {product.price}
                    </p>
                  </div>
                  <button className="mt-3 w-full py-2 px-4 rounded-full bg-black text-white text-sm font-semibold shadow-md hover:bg-gray-900 transition-all duration-200">
                    Buy Now
                  </button>
                </div>
              </div>
            </Link>
          ))
        ) : (
          <p className="text-center col-span-full text-[#757575] text-lg font-medium">
            No products found.
          </p>
        )}
      </div>
    </>
  );
}

export default ProductGrid;