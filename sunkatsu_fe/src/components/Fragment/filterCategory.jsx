import React, { useState, useRef, useEffect } from "react";

const FilterCategory = ({ menuItems }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const buttonRefs = useRef([]); // Referensi ke tombol
  const [indicatorPosition, setIndicatorPosition] = useState({
    left: 0,
    width: 0,
  });

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
  }, [activeIndex, menuItems]); // Re-run jika menuItems berubah

  return (
    <div className="flex w-screen items-center justify-center h-24 lg:mt-16">
      <div className="relative flex w-fit justify-around items-center h-10 py-1 mx-10 gap-2 rounded-xl shadow-2xl overflow-hidden bg-white">
        {/* Latar belakang merah yang bergerak */}
        <div
          className="absolute bg-tertiary rounded-xl h-10 transition-all duration-300 ease-in-out"
          style={{
            left: `${indicatorPosition.left}px`,
            width: `${indicatorPosition.width}px`,
          }}
        ></div>

        {menuItems.map((item, index) => (
          <button
            key={index}
            ref={(el) => (buttonRefs.current[index] = el)} // Simpan referensi tombol
            className={`relative z-0 flex items-center justify-center font-sans w-56 sm:w-96 text-md sm:text-xl font-semibold rounded-xl transition-all duration-300 ${
              activeIndex === index ? "text-white" : "text-[#8E0808]"
            }`}
            onClick={() => setActiveIndex(index)}
          >
            {item}
          </button>
        ))}
      </div>
    </div>
  );
};

export default FilterCategory;
