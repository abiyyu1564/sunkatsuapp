import React, { useState } from 'react';

const Dropdown = ({ items, buttonLabel, onSelect }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(buttonLabel); // Store the selected item

  const toggleDropdown = () => {
    setIsOpen((prevState) => !prevState); // Toggle open/close state
  };

  const handleItemClick = (item) => {
    setSelectedItem(item.label); // Update selected item
    if (onSelect) onSelect(item); // Optional callback when an item is selected
    setIsOpen(false); // Close dropdown after selection
  };

  return (
    <div className="relative inline-block text-left">
      {/* Button to toggle dropdown */}
      <button
        onClick={toggleDropdown}
        className="w-40 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center justify-center inline-flex items-center text-white bg-tertiary hover:bg-red-600 "
        type="button"
      >
        {selectedItem} {/* Display selected item */}
        <svg
          className="w-2.5 h-2.5 ms-3"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 10 6"
        >
          <path
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="m1 1 4 4 4-4"
          />
        </svg>
      </button>

      {/* Dropdown menu */}
      {isOpen && (
        <div
          className="absolute z-10 bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700 mt-2"
        >
          <ul className="py-2 text-sm text-gray-700 dark:text-gray-200">
            {items.map((item, index) => (
              <li key={index}>
                <a
                  href="#"
                  onClick={() => handleItemClick(item)}
                  className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Dropdown;
