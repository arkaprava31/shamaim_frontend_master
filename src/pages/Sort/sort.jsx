import React, { useState } from 'react';

const SortSidebar = ({ onSortChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState('');

  const toggleSortOptions = () => {
    setIsOpen(!isOpen);
  };

  const handleSortChange = (event) => {
    const value = event.target.value;
    setSelectedOption(value);
    onSortChange(value);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        className="bg-gray-200 px-4 py-2 rounded-md shadow-md"
        onClick={toggleSortOptions}
      >
        Sort
      </button>
      {isOpen && (
        <div className="absolute bg-white border border-gray-300 rounded-md shadow-md mt-2 w-full z-10">
          <label className="block p-2">
            <input
              type="radio"
              name="sort"
              value="popularity"
              checked={selectedOption === 'popularity'}
              onChange={handleSortChange}
              className="mr-2"
            />
            Popularity
          </label>
          <label className="block p-2">
            <input
              type="radio"
              name="sort"
              value="price-low-to-high"
              checked={selectedOption === 'price-low-to-high'}
              onChange={handleSortChange}
              className="mr-2"
            />
            Price - Low to High
          </label>
          <label className="block p-2">
            <input
              type="radio"
              name="sort"
              value="price-high-to-low"
              checked={selectedOption === 'price-high-to-low'}
              onChange={handleSortChange}
              className="mr-2"
            />
            Price - High to Low
          </label>
          <label className="block p-2">
            <input
              type="radio"
              name="sort"
              value="newest-first"
              checked={selectedOption === 'newest-first'}
              onChange={handleSortChange}
              className="mr-2"
            />
            Newest First
          </label>
        </div>
      )}
    </div>
  );
};

export default SortSidebar;
