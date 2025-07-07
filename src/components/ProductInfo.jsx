const ProductInfo = ({ title, price, description, packageInfo }) => {
  return (
    <>
      <h1 className="text-[#141414] text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 text-left pb-3 pt-5">
        {title}
      </h1>
      <p className="text-[#757575] text-sm font-normal leading-normal pb-3 pt-1 px-4">
        {description}
      </p>
      <h1 className="text-[#141414] text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 text-left pb-3 pt-5">
        {price}
      </h1>
      {/* <p className="text-[#757575] text-sm font-normal leading-normal pb-3 pt-1 px-4">
        Package: {packageInfo}
      </p> */}
    </>
  );
};

export default ProductInfo;
