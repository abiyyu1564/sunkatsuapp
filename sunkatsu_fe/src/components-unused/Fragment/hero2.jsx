import React, { useState } from "react";
import Katsu from "../../assets/katsu.png";
import Nasgor from "../../assets/nasigoreng.png";
import KatsuAM from "../../assets/katsu_am.png";
import { useEffect } from "react";

const Hero2 = () => {
  // State untuk melacak slide yang aktif
  const [activeIndex, setActiveIndex] = useState(0);

  // Data carousel (bisa ditambah dengan data lain seperti src gambar berbeda)
  const carouselData = [
    { src: Katsu, alt: "Katsu", label: "Katsu" },
    { src: Nasgor, alt: "Nasi Goreng", label: "Nasgor" },
    { src: KatsuAM, alt: "Katsu AM", label: "Katsu AM" },
    // Tambah lebih banyak item carousel di sini jika diperlukan
  ];

  useEffect(() => {
    const interval = setInterval(handleNext, 3000); // 2000ms = 2 seconds
    return () => clearInterval(interval); // Clear interval when component unmounts
  }, []);

  // Fungsi untuk menangani perubahan slide
  const handlePrev = () => {
    setActiveIndex((prevIndex) =>
      prevIndex === 0 ? carouselData.length - 1 : prevIndex - 1
    );
  };

  const handleNext = () => {
    setActiveIndex((prevIndex) =>
      prevIndex === carouselData.length - 1 ? 0 : prevIndex + 1
    );
  };

  return (
    <div className="m-10 mx-auto px-8 py-4 sm:p-24 lg:px-24 lg:py-8 bg-red-200">
      {/* Carousel Body */}
      <div
        className="relative rounded-lg block md:flex items-center bg-gray-100 shadow-xl"
        style={{ minHeight: "19rem" }}
      >
        <div
          className="relative w-full md:w-2/5 h-full overflow-hidden ease-in-out rounded-t-lg md:rounded-t-none md:rounded-l-lg"
          style={{ minHeight: "19rem" }}
        >
          <img
            className="absolute inset-0 w-full h-full object-cover object-center"
            src={carouselData[activeIndex].src}
            alt={carouselData[activeIndex].alt}
          />
        </div>
        <div className="w-full md:w-3/5 h-full flex items-center bg-gray-100 rounded-lg">
          <div className="p-12 md:pr-24 md:pl-16 md:py-12">
            <p className="text-gray-600">
              <span className="text-gray-900">
                {carouselData[activeIndex].label}
              </span>{" "}
              is a UK-based fashion retailer that has nearly doubled in size
              since last year. They integrated Stripe to deliver seamless
              checkout across mobile and web for customers in 100+ countries,
              all while automatically combating fraud.
            </p>
            <a
              className="flex items-baseline mt-3 text-indigo-600 hover:text-indigo-900 focus:text-indigo-900"
              href="#"
            >
              <span>Learn more about our users</span>
              <span className="text-xs ml-1">➜</span>
            </a>
          </div>
          <svg
            className="hidden md:block absolute inset-y-0 h-full w-24 fill-current text-gray-100 -ml-12"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
          >
            <polygon points="50,0 100,0 50,100 0,100" />
          </svg>
        </div>
        {/* Tombol Carousel */}
        <button
          className="absolute top-0 mt-32 left-0 bg-white rounded-full shadow-md h-12 w-12 text-2xl text-indigo-600 hover:text-indigo-400 focus:text-indigo-400 -ml-6 focus:outline-none focus:shadow-outline"
          onClick={handlePrev}
        >
          <span className="block" style={{ transform: "scale(-1)" }}>
            ➜
          </span>
        </button>
        <button
          className="absolute top-0 mt-32 right-0 bg-white rounded-full shadow-md h-12 w-12 text-2xl text-indigo-600 hover:text-indigo-400 focus:text-indigo-400 -mr-6 focus:outline-none focus:shadow-outline"
          onClick={handleNext}
        >
          <span className="block" style={{ transform: "scale(1)" }}>
            ➜
          </span>
        </button>
      </div>
      {/* Carousel Tabs */}
      {/* <div className="flex items-center pt-5 justify-between">
        {carouselData.map((item, index) => (
          <button
            key={index}
            className={`px-2 ${
              index === activeIndex ? "opacity-100" : "opacity-50"
            } hover:opacity-100 focus:opacity-100`}
            onClick={() => setActiveIndex(index)}
          >
            <img
              className="w-full"
              src={item.src} // Gambar bisa diubah sesuai kebutuhan
              alt={item.alt}
              style={{ maxHeight: "60px" }}
            />
          </button>
        ))}
      </div> */}
    </div>
  );
};

export default Hero2;
