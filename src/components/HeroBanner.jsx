import React from 'react';

function HeroBanner() {
  const imageUrl =
    'https://i.pinimg.com/736x/0f/1a/4b/0f1a4b59be2631957536b051ca735c5f.jpg';

  return (
    <div className="relative">
<div
  className="min-h-[240px] md:min-h-[480px] bg-cover lg:bg-contain bg-center bg-no-repeat transition-all duration-500 ease-in-out"
  style={{
    backgroundImage: `url("${imageUrl}")`,
  }}
/>

    </div>
  );
}

export default HeroBanner;
