const QuantitySelector = ({ quantity, setQuantity }) => {
  const handleDecrement = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const handleIncrement = () => {
    setQuantity(quantity + 1);
  };

  const handleChange = (e) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value > 0) {
      setQuantity(value);
    } else {
      setQuantity(1);
    }
  };

  return (
    <>
      <h3 className="text-[#141414] text-lg font-bold leading-tight tracking-[-0.015em] px-4 pb-2 pt-4">
        Quantity
      </h3>
      <div className="flex items-center gap-4 bg-white px-4 min-h-14 justify-between">
        <p className="text-[#141414] text-base font-normal leading-normal flex-1 truncate">
          Quantity:
        </p>
        <div className="shrink-0">
          <div className="flex items-center gap-2 text-[#141414]">
            <button
              onClick={handleDecrement}
              className="text-base font-medium leading-normal flex h-7 w-7 items-center justify-center rounded-full bg-[#f2f2f2] cursor-pointer"
            >
              −
            </button>
            <input
              className="text-base font-medium leading-normal w-12 text-center bg-transparent focus:outline-none border border-[#e0e0e0] rounded"
              type="number"
              value={quantity}
              onChange={handleChange}
              min="1"
            />
            <button
              onClick={handleIncrement}
              className="text-base font-medium leading-normal flex h-7 w-7 items-center justify-center rounded-full bg-[#f2f2f2] cursor-pointer"
            >
              +
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default QuantitySelector;
