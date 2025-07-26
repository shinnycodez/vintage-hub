import React from 'react';

function HeroBanner() {
  const imageUrl =
    'https://scontent.flhe3-2.fna.fbcdn.net/v/t1.15752-9/524561365_1750213162539954_2704788425828681584_n.png?stp=dst-png_s720x720&_nc_cat=106&ccb=1-7&_nc_sid=0024fc&_nc_ohc=UvDvplssLjQQ7kNvwGsN6Sn&_nc_oc=AdnRNLCFhAQbW6Ng_4p6C_78Bb4RpfJCvegTJf3Jy5i2Of3QwLBsMno8l6AGh95WHVI&_nc_ad=z-m&_nc_cid=0&_nc_zt=23&_nc_ht=scontent.flhe3-2.fna&oh=03_Q7cD2wFOBFIbC4J1YlaujebVKEArxty6JWY05lCC7IVpBxW2_g&oe=68AC476E';

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
