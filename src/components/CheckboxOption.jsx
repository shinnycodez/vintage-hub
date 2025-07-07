const CheckboxOption = ({ label, price }) => {
  return (
    <div className="flex items-center gap-4 bg-white px-4 min-h-14 justify-between">
      <p className="text-[#141414] text-base font-normal leading-normal flex-1 truncate">
        {label} + {price}
      </p>
      <div className="shrink-0">
        <div className="flex size-7 items-center justify-center">
          <input
            type="checkbox"
            className="h-5 w-5 rounded border-[#e0e0e0] border-2 bg-transparent text-black checked:bg-black checked:border-black checked:bg-[image:--checkbox-tick-svg] focus:ring-0 focus:ring-offset-0 focus:border-[#e0e0e0] focus:outline-none"
          />
        </div>
      </div>
    </div>
  );
};

export default CheckboxOption;