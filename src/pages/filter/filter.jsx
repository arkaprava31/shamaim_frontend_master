import React from 'react';

const FilterSidebar = () => {
  return (
    <div className="bg-gray-100 h-screen">
      <header className="flex items-center justify-between px-4 py-2 bg-white shadow sticky top-0">
        <button className="text-xl">&#x2190;</button>
        <h1 className="text-lg font-bold">Filters</h1>
        <div></div>
      </header>
      <div className="p-4">
        <div className="bg-white p-4 mb-4 rounded shadow">
          <h3 className="text-md font-semibold mb-2">Price</h3>
          <div className="space-y-2">
            <label className="flex items-center">
              <input type="checkbox" className="mr-2" />
              Rs. 20000 - Rs. 40000
            </label>
            <label className="flex items-center">
              <input type="checkbox" className="mr-2" />
              Rs. 40000 - Rs. 50000
            </label>
            <label className="flex items-center">
              <input type="checkbox" className="mr-2" />
              Rs. 50000 - Rs. 60000
            </label>
            <label className="flex items-center">
              <input type="checkbox" className="mr-2" />
              Rs. 60000 - Rs. 75000
            </label>
            <label className="flex items-center">
              <input type="checkbox" className="mr-2" />
              Rs. 75000 and Above
            </label>
          </div>
        </div>
        <div className="bg-white p-4 mb-4 rounded shadow">
          <h3 className="text-md font-semibold mb-2">Color</h3>
          <div className="space-y-2">
            <label className="flex items-center">
              <input type="checkbox" className="mr-2" />
              Red
            </label>
            <label className="flex items-center">
              <input type="checkbox" className="mr-2" />
              Blue
            </label>
            <label className="flex items-center">
              <input type="checkbox" className="mr-2" />
              Green
            </label>
            <label className="flex items-center">
              <input type="checkbox" className="mr-2" />
              Yellow
            </label>
            <label className="flex items-center">
              <input type="checkbox" className="mr-2" />
              Black
            </label>
          </div>
        </div>
        <button className="w-full bg-orange-500 text-white py-2 rounded">Apply</button>
      </div>
    </div>
  );
};

export default FilterSidebar;
