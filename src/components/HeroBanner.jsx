import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; // Keep this import

function HeroBanner() {
  const slides = [
    {
      id: 1,
      imageUrl:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuALZr48m4erJhCVTUh_qPAfJuQaUrdBpcPFlFLHo-mukjQDc0z3kUmS-A8YyF9rY70HJXx8Yz0eM7Tse9pI2ck3bpA59HzKpzm_3J3iF4xYSNPY7a2SeVS5S_c0RwaMf7Z7w4rktCF0e49oUxWihupwJOCMRjNIxJC4k5rA6naTcwMU-GvZyW1WBcMiYKJSvgfrxpG8HsdVt0WeMJgVyTuj7e-fut_IjUsqB-Xw3_586Dq3IOhJc9PspFdApv7ucinYXhaLS3DHXTE',
      title: 'Discover the New Collection',
      subtitle: 'Explore the latest styles and trends in high fashion.',
    },
    {
      id: 2,
      imageUrl:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuCx0_SSqgCb88QUrH9huwg13mHJQ1QqmtYo-SPeXzYbPXnzk2yjCBUsd06JAVwohqeGPb5HyfsQIjabMoy0h9SulrvwT60pi725Uwt8OCI6wlieHk8n5qm_VZKbj-gsrOZYlfLRWLrbF2vzxAWZ9ggCSSfAjLr0UVhNy-Go30SPer32b-Xbdp-ZQmWQzaAG5h67Fy5b3rQXuup4pOd5ffuZKtJS2sbgBI3OTiTgpzD_2LGgKDztzOVmK-rXtNfZemOkVikmd18pPa4',
      title: 'Unveiling Our Latest Designs',
      subtitle: 'Experience elegance and comfort with our new arrivals.',
    },
    {
      id: 3,
      imageUrl:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuAq4gG1YR-FsXw9FuQF8caIMWRQHMChRQwPCaiWF1ig4cu_nyqGFiaJwfwvUaMhS3NiIwDzIextqUziJOB_2bmpoYOKJb76NvZqacrUAyDhKUfTPv1pAJKetZi2Li8YXlLAMtl9eE7n6BlUT-a7NREKvR3MN_w2a7z97nnZpTii5_LzzrrRNWpOwlget8S0JumT1iZNvL9PJrNI2OWOUWAU7R-QM2kljflCpsoBc_w_l_TpEXNmi1q6cgGwVeLb41Kg7OTpuwiARGg',
      title: 'Timeless Fashion, Modern Appeal',
      subtitle: 'Find your perfect ensemble for every occasion.',
    },
  ];

  const [currentSlide, setCurrentSlide] = useState(0);

  const goToNextSlide = () => {
    setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  };

  const goToPrevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  const goToSlide = (index) => setCurrentSlide(index);

  useEffect(() => {
    const interval = setInterval(goToNextSlide, 5000);
    return () => clearInterval(interval);
  }, [currentSlide]);

  const currentSlideData = slides[currentSlide];

  return (
    <div className="@container relative">
      <div className="@[480px]:p-4">
        <div
          className="flex min-h-[320px] md:min-h-[480px] flex-col gap-6 bg-cover bg-center bg-no-repeat @[480px]:gap-8 @[480px]:rounded-lg items-center justify-center p-4 transition-all duration-500 ease-in-out"
          style={{
            backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.4)), url("${currentSlideData.imageUrl}")`,
          }}
        >
          <div className="flex flex-col gap-2 text-center">
            <h1 className="text-white text-3xl md:text-4xl font-black leading-tight tracking-[-0.033em] @[480px]:text-5xl @[480px]:font-black @[480px]:leading-tight @[480px]:tracking-[-0.033em]">
              {currentSlideData.title}
            </h1>
            <h2 className="text-white text-sm md:text-base font-normal leading-normal @[480px]:text-base @[480px]:font-normal @[480px]:leading-normal">
              {currentSlideData.subtitle}
            </h2>
          </div>

          {/* "Shop Now" as a Link */}
          <Link
            to="/products"
            className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 @[480px]:h-12 @[480px]:px-5 bg-[#141414] text-neutral-50 text-sm font-bold leading-normal tracking-[0.015em] @[480px]:text-base @[480px]:font-bold @[480px]:leading-normal @[480px]:tracking-[0.015em]"
          >
            <span className="truncate">Shop Now</span>
          </Link>
        </div>
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={goToPrevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-transparent text-white p-2 rounded-full z-10 hidden md:block"
        aria-label="Previous slide"
      >
        &#10094;
      </button>
      <button
        onClick={goToNextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-transparent text-white p-2 rounded-full z-10 hidden md:block"
        aria-label="Next slide"
      >
        &#10095;
      </button>

      {/* Pagination Dots */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2 z-10">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`h-3 w-3 rounded-full ${
              index === currentSlide ? 'bg-white' : 'bg-gray-400'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          ></button>
        ))}
      </div>
    </div>
  );
}

export default HeroBanner;
