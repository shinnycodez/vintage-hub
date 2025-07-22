import React from 'react';
import { Link } from 'react-router-dom';

const categories = [
  {
    id: 1,
    title: "Phone charm",
    imageUrl: "https://scontent.flhe3-1.fna.fbcdn.net/v/t1.15752-9/519894911_714475251579504_5877990080543201547_n.jpg?_nc_cat=108&ccb=1-7&_nc_sid=0024fc&_nc_ohc=FzDbnPd79yQQ7kNvwFpPz_C&_nc_oc=AdmOh1fQU9BVFva2LTNObtj6iUBqaxQQuEYTJZE8li5X-uzXkp34dHTk5KxBFFQX3Zg&_nc_ad=z-m&_nc_cid=0&_nc_zt=23&_nc_ht=scontent.flhe3-1.fna&oh=03_Q7cD2wFz1s0zTWn6h3XKqIGQV9xCTyOvNe5iy2BSIgXXs89U0Q&oe=68A473AB"
  },
    {
    id: 2,
    title: "Arm cuff",
    imageUrl: "https://scontent.flhe7-2.fna.fbcdn.net/v/t1.15752-9/518872764_2112236285933772_3598642941186150970_n.jpg?stp=dst-jpg_s640x640_tt6&_nc_cat=109&ccb=1-7&_nc_sid=0024fc&_nc_ohc=zw5gAhXJyb0Q7kNvwFuIW-U&_nc_oc=AdkPMfheZp8eN1CmI169itorL0wsq9qVdF3V9Zv4XQOfY5u8It4VKMFSiCDeh9zo6C0&_nc_ad=z-m&_nc_cid=0&_nc_zt=23&_nc_ht=scontent.flhe7-2.fna&oh=03_Q7cD2wH84NMdygljraS0kAusoEbroghPVl9Wwv9b6B-ete1tmw&oe=68A46713"
  },
  {
    id: 3,
    title: "Bracelet",
    imageUrl: "https://scontent.flhe7-2.fna.fbcdn.net/v/t1.15752-9/519448546_1180836197138410_8348523087325743602_n.jpg?_nc_cat=105&ccb=1-7&_nc_sid=0024fc&_nc_ohc=tmCm8-pV1skQ7kNvwF4Bk3l&_nc_oc=AdmnczHm9mjGrIaMnqrS56Pg7GDvkJiS6VBHH86BqAn3jZxJ786uE5T5-yo-G456-pU&_nc_ad=z-m&_nc_cid=0&_nc_zt=23&_nc_ht=scontent.flhe7-2.fna&oh=03_Q7cD2wGLOsk6i15SAqG2_5Yy2gUzUtMpXrlMB2sBo_r4OAvpYg&oe=68A47547"
  },
    {
    id: 4,
    title: "Bookmarks",
    imageUrl: "https://scontent.flhe3-2.fna.fbcdn.net/v/t1.15752-9/523296752_1458911468463243_3121384784033634617_n.png?stp=dst-png_s640x640&_nc_cat=110&ccb=1-7&_nc_sid=0024fc&_nc_ohc=jwDncDVNFPwQ7kNvwFv_EXZ&_nc_oc=AdlQdGe2JNijLLcf6BfGOOBUpdhlXmt2SHLwip-bFU4J9ueZVvPzn18184w5YEaqkMQ&_nc_ad=z-m&_nc_cid=0&_nc_zt=23&_nc_ht=scontent.flhe3-2.fna&oh=03_Q7cD2wFyIzu5mfNgU7TQQ4lmPvuCBLHASkew_I4QBXQjpzjrMA&oe=68A6F448"
  },
      {
    id: 5,
    title: "Necklaces",
    imageUrl: "https://scontent.flhe7-2.fna.fbcdn.net/v/t1.15752-9/518732106_1432521157784810_4236191864935155782_n.png?stp=dst-png_s640x640&_nc_cat=103&ccb=1-7&_nc_sid=0024fc&_nc_ohc=tY23y7RcPVkQ7kNvwETTd99&_nc_oc=AdmAXxY14GwijR5SdLdd6qPinAVyun4ZG-uc7RDRU-HfXsE9_FD8cpSQZJduIrXt7jI&_nc_ad=z-m&_nc_cid=0&_nc_zt=23&_nc_ht=scontent.flhe7-2.fna&oh=03_Q7cD2wEWRYBQWTSS5xeTFUQ2tTi3cPdddpe_k1FiKeBoftMdkg&oe=68A6EDAB"
  },
        {
    id: 6,
    title: "Bag charms",
    imageUrl: "https://scontent.flhe3-2.fna.fbcdn.net/v/t1.15752-9/520244288_1267810474939004_9048492148598199566_n.png?stp=dst-png_s640x640&_nc_cat=106&ccb=1-7&_nc_sid=0024fc&_nc_ohc=neIk5TZGFm4Q7kNvwEuXfQ_&_nc_oc=AdmxJ4KDwZ-uqPdqouvocGIJ_PMCJuOMaF7ERpOXqSlLAudbRPv9J7oqkY8r3siKLZI&_nc_ad=z-m&_nc_cid=0&_nc_zt=23&_nc_ht=scontent.flhe3-2.fna&oh=03_Q7cD2wFMPcWh2mt2rXhc_FNIMeleWIzjCbZQawAV-wDep1F7MQ&oe=68A70F62"
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
