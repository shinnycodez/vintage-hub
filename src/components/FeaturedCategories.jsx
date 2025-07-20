import React from 'react';
import { Link } from 'react-router-dom';

const categories = [
  {
    id: 1,
    title: "Phone charm",
    imageUrl: "https://scontent.flhe3-1.fna.fbcdn.net/v/t1.15752-9/519894911_714475251579504_5877990080543201547_n.jpg?_nc_cat=108&ccb=1-7&_nc_sid=0024fc&_nc_ohc=FzDbnPd79yQQ7kNvwFpPz_C&_nc_oc=AdmOh1fQU9BVFva2LTNObtj6iUBqaxQQuEYTJZE8li5X-uzXkp34dHTk5KxBFFQX3Zg&_nc_ad=z-m&_nc_cid=0&_nc_zt=23&_nc_ht=scontent.flhe3-1.fna&oh=03_Q7cD2wFz1s0zTWn6h3XKqIGQV9xCTyOvNe5iy2BSIgXXs89U0Q&oe=68A473AB"
  },
    {
    id: 3,
    title: "Arm cuff",
    imageUrl: "https://scontent.flhe7-2.fna.fbcdn.net/v/t1.15752-9/518872764_2112236285933772_3598642941186150970_n.jpg?stp=dst-jpg_s640x640_tt6&_nc_cat=109&ccb=1-7&_nc_sid=0024fc&_nc_ohc=zw5gAhXJyb0Q7kNvwFuIW-U&_nc_oc=AdkPMfheZp8eN1CmI169itorL0wsq9qVdF3V9Zv4XQOfY5u8It4VKMFSiCDeh9zo6C0&_nc_ad=z-m&_nc_cid=0&_nc_zt=23&_nc_ht=scontent.flhe7-2.fna&oh=03_Q7cD2wH84NMdygljraS0kAusoEbroghPVl9Wwv9b6B-ete1tmw&oe=68A46713"
  },
  {
    id: 2,
    title: "Bracelet",
    imageUrl: "https://scontent.flhe7-2.fna.fbcdn.net/v/t1.15752-9/519448546_1180836197138410_8348523087325743602_n.jpg?_nc_cat=105&ccb=1-7&_nc_sid=0024fc&_nc_ohc=tmCm8-pV1skQ7kNvwF4Bk3l&_nc_oc=AdmnczHm9mjGrIaMnqrS56Pg7GDvkJiS6VBHH86BqAn3jZxJ786uE5T5-yo-G456-pU&_nc_ad=z-m&_nc_cid=0&_nc_zt=23&_nc_ht=scontent.flhe7-2.fna&oh=03_Q7cD2wGLOsk6i15SAqG2_5Yy2gUzUtMpXrlMB2sBo_r4OAvpYg&oe=68A47547"
  },

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
