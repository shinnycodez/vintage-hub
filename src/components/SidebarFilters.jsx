import React, { useState } from 'react';

function SidebarFilters({ onFilterChange }) {
  const [tempFilters, setTempFilters] = useState({
    category: [],
    available: [], // ✅ still using 'available'
    priceRange: [0, 500],
  });

  const options = {
    Category: ['Phone charm', 'Arm cuff', 'Bracelet' , 'Bookmarks' , 'Bag charms', 'Necklaces'],
    Availability: [true, false], // Boolean values
  };

  const handleCheckboxChange = (filterName, value) => {
    const key = filterName === 'Availability' ? 'available' : filterName.toLowerCase();
    setTempFilters((prev) => {
      const current = prev[key] || [];
      const updated = current.includes(value)
        ? current.filter((v) => v !== value)
        : [...current, value];
      return { ...prev, [key]: updated };
    });
  };

  const handlePriceChange = (index, value) => {
    const newRange = [...tempFilters.priceRange];
    newRange[index] = Number(value);
    setTempFilters((prev) => ({
      ...prev,
      priceRange: newRange,
    }));
  };

  const applyFilters = () => {
    onFilterChange?.(tempFilters);
  };

  return (
    <div className="hidden md:flex flex-col w-80">
      <h2 className="text-[#141414] text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">
        Filters
      </h2>
      <div className="flex flex-col p-4 gap-3">
        {Object.keys(options).map((filter) => (
          <details
            key={filter}
            className="flex flex-col rounded-lg border border-[#e0e0e0] bg-[#FFF2EB] px-[15px] py-[7px] group" // Changed background here
          >
            <summary className="flex cursor-pointer items-center justify-between gap-6 py-2">
              <p className="text-[#141414] text-sm font-medium leading-normal">{filter}</p>
              <div className="text-[#141414] group-open:rotate-180">
                <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" fill="currentColor" viewBox="0 0 256 256">
                  <path d="M213.66,101.66l-80,80a8,8,0,0,1-11.32,0l-80-80A8,8,0,0,1,53.66,90.34L128,164.69l74.34-74.35a8,8,0,0,1,11.32,11.32Z"></path>
                </svg>
              </div>
            </summary>
            <div className="flex flex-col gap-2 pb-2">
              {options[filter].map((option) => (
                <label key={option.toString()} className="flex items-center gap-2 text-[#757575] text-sm font-normal">
                  <input
                    type="checkbox"
                    checked={
                      filter === 'Availability'
                        ? tempFilters.available.includes(option)
                        : tempFilters[filter.toLowerCase()]?.includes(option)
                    }
                    onChange={() => handleCheckboxChange(filter, option)}
                    className="accent-[#141414]"
                  />
                  {filter === 'Availability'
                    ? option === true
                      ? 'In Stock'
                      : 'Out of Stock'
                    : option}
                </label>
              ))}
            </div>
          </details>
        ))}

        {/* Price Range */}
        <details
          open
          className="flex flex-col rounded-lg border border-[#e0e0e0] bg-[#FFF2EB] px-[15px] py-[7px] group" // Changed background here
        >
          <summary className="flex cursor-pointer items-center justify-between gap-6 py-2">
            <p className="text-[#141414] text-sm font-medium leading-normal">Price Range</p>
            <div className="text-[#141414] group-open:rotate-180">
              <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" fill="currentColor" viewBox="0 0 256 256">
                <path d="M213.66,101.66l-80,80a8,8,0,0,1-11.32,0l-80-80A8,8,0,0,1,53.66,90.34L128,164.69l74.34-74.35a8,8,0,0,1,11.32,11.32Z"></path>
              </svg>
            </div>
          </summary>
          <div className="pt-2 pb-4">
            <div className="flex items-center gap-3">
              <input
                type="number"
                min={0}
                value={tempFilters.priceRange[0]}
                onChange={(e) => handlePriceChange(0, e.target.value)}
                className="w-20 px-2 py-1 border border-[#ccc] rounded text-sm bg-[#FFF2EB]" // Changed input background
              />
              <span className="text-sm text-[#757575]">to</span>
              <input
                type="number"
                min={tempFilters.priceRange[0]}
                value={tempFilters.priceRange[1]}
                onChange={(e) => handlePriceChange(1, e.target.value)}
                className="w-20 px-2 py-1 border border-[#ccc] rounded text-sm bg-[#FFF2EB]" // Changed input background
              />
            </div>
          </div>
        </details>

        {/* Apply Button */}
        <button
          onClick={applyFilters}
          className="mt-2 bg-[#141414] text-white text-sm font-semibold py-2 px-4 rounded hover:opacity-90 transition"
        >
          Apply Filters
        </button>
      </div>
    </div>
  );
}

export default SidebarFilters;