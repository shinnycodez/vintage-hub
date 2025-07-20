import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; // Keep this import

function HeroBanner() {
  const slides = [
    {
      id: 1,
      imageUrl:
        'https://scontent.flhe3-1.fna.fbcdn.net/v/t1.15752-9/518477205_597348533178382_1085206324374393956_n.jpg?stp=dst-jpg_s640x640_tt6&_nc_cat=108&ccb=1-7&_nc_sid=0024fc&_nc_ohc=Pb7hVYa8aPsQ7kNvwF2EDa4&_nc_oc=Adl5WiaX6kaj905nP5PdU7idDODWDAHJ--hOlwXUalIl2VuyGQvjOlNlkTc749QufOQ&_nc_ad=z-m&_nc_cid=0&_nc_zt=23&_nc_ht=scontent.flhe3-1.fna&oh=03_Q7cD2wG5CO-bTx7RYMkrlurEF9Xo7wrcSMSwnqlDaePxrBlYZA&oe=68A48A55',
      title: 'Discover the New Collection',
      subtitle: 'Explore the latest styles and trends in high fashion.',
    },
    {
      id: 2,
      imageUrl:
        'https://scontent.flhe3-1.fna.fbcdn.net/v/t1.15752-9/520250629_1078276907743783_5894156676471813187_n.jpg?stp=dst-jpg_s640x640_tt6&_nc_cat=111&ccb=1-7&_nc_sid=0024fc&_nc_ohc=NeLMPC4k-jUQ7kNvwEd-iB9&_nc_oc=Adk5FFWnLZMvrKNWkADI-A_WeVtPKVrBKFkpQnRDbJDrV68EP4CZ41MbdpSgnVIffP0&_nc_ad=z-m&_nc_cid=0&_nc_zt=23&_nc_ht=scontent.flhe3-1.fna&oh=03_Q7cD2wEhJnnhs98dRTyUe0PPIzmdnT1oGHSAULz7mscgMKTroQ&oe=68A48BFC',
      title: 'Unveiling Our Latest Designs',
      subtitle: 'Experience elegance and comfort with our new arrivals.',
    },
    {
      id: 3,
      imageUrl:
        'https://scontent.flhe7-1.fna.fbcdn.net/v/t1.15752-9/518981308_4116077575347762_429374228166904827_n.jpg?stp=dst-jpg_s640x640_tt6&_nc_cat=104&ccb=1-7&_nc_sid=0024fc&_nc_ohc=Ef_DgRWa9tUQ7kNvwEjp_0P&_nc_oc=AdkxyNOtXMfllh9CPH1lIYh9CNWf8e1oyh4ht3bmopoU1al04ksJqYN7Ol8HENXam7k&_nc_ad=z-m&_nc_cid=0&_nc_zt=23&_nc_ht=scontent.flhe7-1.fna&oh=03_Q7cD2wFJlZn7oKo3KWt8Uu21xTXHtqtA0Mkh9ItHuJSWUBBbDA&oe=68A47E9C',
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
          // MODIFIED LINE: Changed min-h-[320px] to min-h-[240px]
          className="flex min-h-[240px] md:min-h-[480px] flex-col gap-6 bg-cover bg-center bg-no-repeat @[480px]:gap-8 @[480px]:rounded-lg items-center justify-center p-4 transition-all duration-500 ease-in-out"
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