import React from 'react';
import { Link } from 'react-router-dom';

const categories = [
  {
    id: 1,
    title: "Suits",
    imageUrl: "https://i.pinimg.com/736x/d0/1a/34/d01a34a90a1fd62fd27e0e6ade960d03.jpg"
  },
  {
    id: 2,
    title: "Old Money",
    imageUrl: "https://i.pinimg.com/736x/48/b8/10/48b8101bf681dca624173b045c67047d.jpg"
  },
  {
    id: 3,
    title: "Baggy",
    imageUrl: "https://i.pinimg.com/736x/12/2b/f9/122bf934d2cc75798aaa14463c17e509.jpg"
  }
];

function FeaturedCategories() {
  return (
    <div>
      <h2 className="text-[#141414] text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">
        Featured Categories
      </h2>
      
      <div className="flex flex-col gap-5 p-4 md:grid md:grid-cols-3 md:gap-4">
        {categories.map(category => (
          <Link
            to={`/products?category=${encodeURIComponent(category.title)}`}
            key={category.id}
            className="flex flex-col gap-2 group"
          >
            <div
              className="w-full bg-center bg-no-repeat aspect-video bg-cover rounded-lg transition-transform duration-300 group-hover:scale-[1.03]"
              style={{ backgroundImage: `url(${category.imageUrl})` }}
            ></div>
            <p className="text-[#141414] text-base font-medium leading-normal">{category.title}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default FeaturedCategories;
