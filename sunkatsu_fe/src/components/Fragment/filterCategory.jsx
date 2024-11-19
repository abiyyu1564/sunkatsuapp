import React, { useState, useRef, useEffect } from "react";

const FilterCategory = (props) => {
  //ini buat transisi di filter kategori
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
  }, [activeIndex]);

  const menuItems = [props.menu1, props.menu2, props.menu3, props.menu4];
  //sampe sini
  return (
    <div className="relative flex items-center bg-white rounded-xl shadow-2xl justify-around w-3/4 h-fit py-1 mx-auto my-10 gap-10 overflow-hidden">
      {/* Latar belakang merah yang bergerak */}
      <div
        className="absolute bg-[#8E0808] rounded-xl h-14 transition-all duration-500 ease-in-out"
        style={{
          left: `${indicatorPosition.left}px`,
          width: `${indicatorPosition.width}px`,
        }}
      ></div>

      {menuItems.map((item, index) => (
        <button
          key={index}
          ref={(el) => (buttonRefs.current[index] = el)} // Simpan referensi tombol
          className={`relative z-10 flex items-center justify-center font-sans text-xl font-semibold w-96 py-2 px-4 rounded-xl transition-all duration-300 ${
            activeIndex === index ? "text-white" : "text-[#8E0808]"
          }`}
          onClick={() => setActiveIndex(index)}
        >
          {item}
        </button>
      ))}
    </div>
  );
};

export default FilterCategory;