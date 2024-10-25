import React, { useEffect, useState } from "react";
import Katsu from "../../assets/katsu.png";
import Nasgor from "../../assets/nasigoreng.png";

const Hero = () => {
  // State untuk melacak index slide yang sedang aktif
  const [currentIndex, setCurrentIndex] = useState(0);

  // Total jumlah slide
  const totalSlides = 5;

  useEffect(() => {
    const items = document.querySelectorAll("[data-carousel-item]");

    function showSlide(index) {
      items.forEach((item, i) => {
        item.classList.toggle("hidden", i !== index);
      });
    }

    showSlide(currentIndex); // Tampilkan slide berdasarkan currentIndex
  }, [currentIndex]); // Jalankan setiap kali currentIndex berubah

  // Fungsi untuk berpindah ke slide sebelumnya
  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + totalSlides) % totalSlides);
  };

  // Fungsi untuk berpindah ke slide berikutnya
  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % totalSlides);
  };

  // Fungsi untuk berpindah ke slide berdasarkan indikator
  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  return (
    <div
      id="indicators-carousel"
      className="relative w-11/12 mx-auto mt-5"
      data-carousel="static"
    >
      {/* Carousel wrapper */}
      <div className="relative h-56 overflow-hidden bg-red-600  rounded-lg md:h-96">
        {/* Item 1 */}
        <div className="duration-700 ease-in-out" data-carousel-item>
          <img
            src={Katsu}
            className="absolute block w-24 -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2"
            alt="Slide 1"
          />
          <h1 className="text-3xl font-bold relative top-20 left-20">Katsu</h1>
        </div>
        {/* Item 2 */}
        <div className="hidden duration-700 ease-in-out" data-carousel-item>
          <img
            src={Nasgor}
            className="absolute block w-full -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2"
            alt="Slide 2"
          />
        </div>
        {/* Tambahkan slide lainnya */}
      </div>

      {/* Slider indicators */}
      <div className="absolute z-30 flex -translate-x-1/2 space-x-3 bottom-5 left-1/2">
        {Array.from({ length: totalSlides }).map((_, index) => (
          <button
            key={index}
            type="button"
            className={`w-3 h-3 rounded-full ${
              currentIndex === index ? "bg-blue-600" : "bg-white"
            }`}
            aria-current={currentIndex === index ? "true" : "false"}
            aria-label={`Slide ${index + 1}`}
            onClick={() => goToSlide(index)} // Fungsi untuk pindah ke slide sesuai indikator
          />
        ))}
      </div>

      {/* Slider controls */}
      <button
        type="button"
        className="absolute top-0 start-0 z-30 flex items-center justify-center h-full px-4 cursor-pointer group focus:outline-none"
        onClick={prevSlide} // Fungsi untuk slide sebelumnya
      >
        <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/30 dark:bg-gray-800/30 group-hover:bg-white/50 dark:group-hover:bg-gray-800/60 group-focus:ring-4 group-focus:ring-white dark:group-focus:ring-gray-800/70 group-focus:outline-none">
          <svg
            className="w-4 h-4 text-white dark:text-gray-800 rtl:rotate-180"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 6 10"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 1 1 5l4 4"
            />
          </svg>
          <span className="sr-only">Previous</span>
        </span>
      </button>

      <button
        type="button"
        className="absolute top-0 end-0 z-30 flex items-center justify-center h-full px-4 cursor-pointer group focus:outline-none"
        onClick={nextSlide} // Fungsi untuk slide berikutnya
      >
        <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/30 dark:bg-gray-800/30 group-hover:bg-white/50 dark:group-hover:bg-gray-800/60 group-focus:ring-4 group-focus:ring-white dark:group-focus:ring-gray-800/70 group-focus:outline-none">
          <svg
            className="w-4 h-4 text-white dark:text-gray-800 rtl:rotate-180"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 6 10"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="m1 9 4-4-4-4"
            />
          </svg>
          <span className="sr-only">Next</span>
        </span>
      </button>
    </div>
  );
};

export default Hero;
