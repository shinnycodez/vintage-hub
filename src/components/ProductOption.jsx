const ProductOption = ({ options, name, title, selected, onSelect }) => {
  return (
    <>
      <h3 className="text-[#141414] text-lg font-bold leading-tight tracking-[-0.015em] px-4 pb-2 pt-4">
        {title}
      </h3>
      <div className="flex flex-wrap gap-3 p-4">
        {options.map((option) => (
          <label
            key={option}
            className={`text-sm font-medium leading-normal flex items-center justify-center rounded-xl border px-4 h-11 text-[#141414] relative cursor-pointer bg-[#FFF2EB] // Added background color here
              ${
                selected === option
                  ? 'border-[3px] border-black px-3.5'
                  : 'border-[#e0e0e0]' // Reverted border to ensure visibility against FFF2EB background
              }`}
          >
            {option}
            <input
              type="radio"
              className="invisible absolute"
              name={name}
              value={option}
              checked={selected === option}
              onChange={() => onSelect(option)}
            />
          </label>
        ))}
      </div>
    </>
  );
};

export default ProductOption;