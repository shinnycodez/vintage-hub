import { useState } from 'react';

const ProductImageGrid = ({ images }) => {
  const [mainImage, setMainImage] = useState(images[0]);

  return (
    <div className="w-full bg-white rounded-xl">
      {/* Main Image - Responsive display */}
      <div 
        className="w-full bg-center bg-no-repeat bg-contain bg-white rounded-t-xl mb-4 flex justify-center items-center"
        style={{ backgroundImage: `url("${mainImage}")` }}
      >
        <div className="aspect-video w-full max-h-[600px] h-[50vh] sm:h-[70vh] md:h-[500px]"></div>
      </div>

      {/* Centered Thumbnail Gallery */}
      <div className="w-full overflow-x-auto px-4 pb-2">
        <div className="flex justify-center gap-3 mx-auto w-fit">
          {images.map((image, index) => (
            <div
              key={index}
              className={`flex-shrink-0 w-16 h-16 md:w-20 md:h-20 rounded-md overflow-hidden cursor-pointer transition-all border-2 ${
                image === mainImage ? 'border-black' : 'border-transparent hover:border-gray-300'
              }`}
              onClick={() => setMainImage(image)}
            >
              <img
                src={image}
                alt={`Thumbnail ${index + 1}`}
                className="w-full h-full object-contain bg-white"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductImageGrid;