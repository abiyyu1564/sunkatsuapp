import React, { useState, useRef, useEffect } from "react";

const FilterCategory = ({ menuItems, onFilterChange }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const buttonRefs = useRef([]); // Referensi ke tombol
  const [indicatorPosition, setIndicatorPosition] = useState({
    left: 0,
    width: 0,
  });

  const handleButtonClick = (index) => {
    setActiveIndex(index);
    onFilterChange(menuItems[index]); // Kirim kategori yang dipilih ke parent
  };

  useEffect(() => {
    if (buttonRefs.current[activeIndex]) {
      const activeButton =
        buttonRefs.current[activeIndex].getBoundingClientRect();
      const parent = buttonRefs.current[0].parentNode.getBoundingClientRect();
      setIndicatorPosition({
        left: activeButton.left - parent.left,
        width: activeButton.width,
      });
    }
  }, [activeIndex, menuItems]);

  const handleKeyDown = (e) => {
    if (e.key === "ArrowRight") {
      setActiveIndex((prev) => (prev + 1) % menuItems.length);
    } else if (e.key === "ArrowLeft") {
      setActiveIndex((prev) =>
        prev - 1 < 0 ? menuItems.length - 1 : prev - 1
      );
    }
  };

  return (
    <div className="flex items-center justify-center py-6">
      <div className="flex gap-8">
        {menuItems.map((item, index) => (
          <button
            key={index}
            className={`px-9 py-1 rounded-lg border-2 transition-all duration-200 font-medium text-base min-w-[200px] ${
              activeIndex === index
                ? "border-red-700 text-gray-500 bg-white hover:bg-red-800 hover:text-white"
                : "border-red-700 text-gray-500 bg-white hover:bg-red-800 hover:text-white"
            }`}
            onClick={() => handleButtonClick(index)}
          >
            {item}
          </button>
        ))}
      </div>
    </div>
    // <div
    //   className="flex w-[1280px] items-center justify-center h-24"
    //   onKeyDown={handleKeyDown}
    //   tabIndex={0} // Make the container focusable for keyboard navigation
    // >
    //   <div className="relative flex w-fit justify-around items-center h-10 py-1 mx-10 gap-2 rounded-xl shadow-2xl overflow-hidden bg-white">
    //     {/* Moving Background Indicator */}
    //     <div
    //       className="absolute bg-tertiary rounded-xl h-10 transition-all duration-300 ease-in-out"
    //       style={{
    //         left: `${indicatorPosition.left}px`,
    //         width: `${indicatorPosition.width}px`,
    //       }}
    //     ></div>

    //     {menuItems.map((item, index) => (
    //       <button
    //         key={index}
    //         ref={(el) => (buttonRefs.current[index] = el)}
    //         className={`relative z-0 flex items-center justify-center font-sans w-56 sm:w-96 text-md sm:text-xl font-semibold rounded-xl transition-all duration-300 ${
    //           activeIndex === index ? "text-white" : "text-[#8E0808]"
    //         }`}
    //         onClick={() => handleButtonClick(index)}
    //       >
    //         {item}
    //       </button>
    //     ))}
    //   </div>
    // </div>
  );
};

export default FilterCategory;
