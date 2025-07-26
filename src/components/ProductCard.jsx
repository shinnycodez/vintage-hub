import React from 'react';

function ProductCard({ title, description, imageUrl, price }) {
  return (
    <div className="flex h-full flex-1 flex-col gap-4 rounded-lg bg-white shadow-[0_0_6px_rgba(0,0,0,0.08)] min-w-[240px] md:min-w-60">
      {/* Image */}
      <div className="w-full h-64 md:h-80 rounded-t-lg overflow-hidden">
        <img
          src={imageUrl}
          alt={title}
          className="w-full h-full object-cover object-top"
        />
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 justify-between p-4 pt-0 gap-4">
        <div className="flex flex-col gap-1">
          <p className="text-[#141414] text-base font-medium leading-normal">{title}</p>
          {/* <p className="text-[#5a5a5a] text-sm font-normal leading-normal line-clamp-4">
            {description}
          </p> */}
        </div>

        {/* Price + Button */}
        <div className="flex flex-col gap-2">
          <span className="text-[#141414] font-bold text-sm">{price}</span>
          <button
            className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-white text-[#141414] text-sm font-bold leading-normal tracking-[0.015em] hover:bg-[#FFDCDC] transition"
          >
            <span className="truncate">View Product</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;