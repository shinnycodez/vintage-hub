import React from 'react';
import { Link } from 'react-router-dom';

const categories = [
    {
    id: 3,
    title: "Bracelets ˚⊹♡",
    imageUrl: "https://scontent.flhe3-2.fna.fbcdn.net/v/t1.15752-9/521349181_737084372371080_7694854766131764488_n.jpg?stp=dst-jpg_p480x480_tt6&_nc_cat=106&ccb=1-7&_nc_sid=0024fc&_nc_ohc=Fsv5uGhELl4Q7kNvwG_lAdO&_nc_oc=AdlYcUu20aZCwgodBLHx-MwgDblAqI5nnRiz5bmELqfX8JeL2d0ddTzNf9cA1x1jgv4&_nc_ad=z-m&_nc_cid=0&_nc_zt=23&_nc_ht=scontent.flhe3-2.fna&oh=03_Q7cD2wHPdHHYuUKWZMnyDNGfJmoIh-195cqknxDBQhvyKSMC3A&oe=68AC0C82",
    link: "Bracelets"
  },
  {
    id: 1,
    title: "Phone charms ⋆｡𖦹°",
    imageUrl: "https://scontent.flhe7-1.fna.fbcdn.net/v/t1.15752-9/520909658_1678087256927900_4817397154280147514_n.jpg?stp=dst-jpg_s2048x2048_tt6&_nc_cat=101&ccb=1-7&_nc_sid=0024fc&_nc_ohc=-cJamvM0wWoQ7kNvwHjic2W&_nc_oc=AdnGYSG0N4xGE4ybxYKUmZoZaAmTl8C9MNh-ZMSB5zXBe7lCtxIBwzfkg97-6AXqces&_nc_ad=z-m&_nc_cid=0&_nc_zt=23&_nc_ht=scontent.flhe7-1.fna&oh=03_Q7cD2wGwZvJHpstnpnrNbDdtQrq6BD6DgSYoi2l9j3Ow040fmQ&oe=68AC3F8B",
      link: "Phone charms",
  },


  //   {
  //   id: 4,
  //   title: "Bookmarks",
  //   imageUrl: "https://scontent.flhe7-2.fna.fbcdn.net/v/t1.15752-9/520429125_1334742338219253_2531984894124566733_n.jpg?stp=dst-jpg_s480x480_tt6&_nc_cat=103&ccb=1-7&_nc_sid=0024fc&_nc_ohc=j7XYMWWmVY8Q7kNvwFYLOQX&_nc_oc=Adkef7qEPDIiflArvyMlAj0FTg2JoPnp6bRd6DV5GSZcJB7m97b8m8ZRWL8id8lVe1k&_nc_ad=z-m&_nc_cid=0&_nc_zt=23&_nc_ht=scontent.flhe7-2.fna&oh=03_Q7cD2wF-rY8Fqy79pbeR3ML53F8zqAW-4GruhgPAjdrVNB5Twg&oe=68AC16BF"
  // },
      {
    id: 2,
    title: "keychains ˚⋆𐙚｡",
    imageUrl: "https://scontent.flhe3-1.fna.fbcdn.net/v/t1.15752-9/521166975_734660132863062_8344427397155527878_n.jpg?stp=dst-jpg_p480x480_tt6&_nc_cat=108&ccb=1-7&_nc_sid=0024fc&_nc_ohc=_3dWxXDTf2AQ7kNvwH1m5H-&_nc_oc=AdkrOOuB66lOze65nVBUxtzwc30t81Apdwep51coHvlLCe3bNHXBtq_j8SyG158Us5Y&_nc_ad=z-m&_nc_cid=0&_nc_zt=23&_nc_ht=scontent.flhe3-1.fna&oh=03_Q7cD2wEBc-JVrARW0JcO0ob47QmdjD5VNbxweJm9gTI_uFcHdQ&oe=68AC460B",
      link: "keychains"
  },
      {
    id: 5,
    title: "Necklaces ｡°✩",
    imageUrl:"https://scontent.flhe7-2.fna.fbcdn.net/v/t1.15752-9/520429125_1334742338219253_2531984894124566733_n.jpg?stp=dst-jpg_s480x480_tt6&_nc_cat=103&ccb=1-7&_nc_sid=0024fc&_nc_ohc=j7XYMWWmVY8Q7kNvwFYLOQX&_nc_oc=Adkef7qEPDIiflArvyMlAj0FTg2JoPnp6bRd6DV5GSZcJB7m97b8m8ZRWL8id8lVe1k&_nc_ad=z-m&_nc_cid=0&_nc_zt=23&_nc_ht=scontent.flhe7-2.fna&oh=03_Q7cD2wF-rY8Fqy79pbeR3ML53F8zqAW-4GruhgPAjdrVNB5Twg&oe=68AC16BF",
     link: "Necklaces"
  },
  //       {
  //   id: 6,
  //   title: "Bag charms",
  //   imageUrl: "https://scontent.flhe3-2.fna.fbcdn.net/v/t1.15752-9/520244288_1267810474939004_9048492148598199566_n.png?stp=dst-png_s640x640&_nc_cat=106&ccb=1-7&_nc_sid=0024fc&_nc_ohc=neIk5TZGFm4Q7kNvwEuXfQ_&_nc_oc=AdmxJ4KDwZ-uqPdqouvocGIJ_PMCJuOMaF7ERpOXqSlLAudbRPv9J7oqkY8r3siKLZI&_nc_ad=z-m&_nc_cid=0&_nc_zt=23&_nc_ht=scontent.flhe3-2.fna&oh=03_Q7cD2wFMPcWh2mt2rXhc_FNIMeleWIzjCbZQawAV-wDep1F7MQ&oe=68A70F62"
  // },

];

function FeaturedCategories() {
  return (
<div>
  <h2 className="text-[#141414] text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">
    Featured Categories
  </h2>

  <div className="grid grid-cols-2 gap-4 p-4 md:grid-cols-3">
    {categories.map(category => (
      <Link
        to={`/products?category=${encodeURIComponent(category.link)}`}
        key={category.id}
        className="flex flex-col gap-2 group bg-white rounded-lg overflow-hidden shadow-sm transition-transform duration-300 group-hover:scale-[1.03]"
      >
        <div
          className="w-full aspect-[1/1] bg-center bg-no-repeat bg-cover"
          style={{ backgroundImage: `url(${category.imageUrl})` }}
        ></div>
        <p className="text-[#141414] text-base font-medium leading-normal text-center px-2 pb-3">
          {category.title}
        </p>
      </Link>
    ))}
  </div>
</div>

  );
}

export default FeaturedCategories;
