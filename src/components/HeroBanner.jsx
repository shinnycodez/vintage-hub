import React from 'react';

function HeroBanner() {
  const imageUrl = '/public/logo.png'; // path relative to the public folder

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
