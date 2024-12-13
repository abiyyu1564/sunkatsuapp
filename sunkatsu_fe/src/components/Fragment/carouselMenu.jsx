import React, { useState, useEffect } from "react";
import Food from "../../assets/Food_Carousel.png";
import Dessert from "../../assets/Dessert_Carousel.png";
import Drink from "../../assets/Drink_Carousel.png";

const Carousel = () => {
  const carouselImages = [
    { src: Food, alt: "Delicious Curry" },
    { src: Dessert, alt: "Tasty Dessert" },
    { src: Drink, alt: "Refreshing Drink" },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  // Automatically slide to the next image
  useEffect(() => {
    const interval = setInterval(() => {
      handleNext();
    }, 5000); 
    return () => clearInterval(interval); // Cleanup on unmount
  }, [currentIndex]);

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % carouselImages.length);
  };

  const handlePrev = () => {
    setCurrentIndex(
      (prevIndex) =>
        (prevIndex - 1 + carouselImages.length) % carouselImages.length
    );
  };

  return (
    <div className="relative w-[1200px] h-[300px] justify-center items-center overflow-hidden rounded-lg">
      {/* Image Slides */}
      <div
        className="relative flex w-full h-full transition-transform duration-700 ease-in-out"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {carouselImages.map((image, index) => (
          <div
            key={index}
            className="w-full flex-shrink-0" // Ensures each slide takes full width
          >
            <img
              src={image.src}
              alt={image.alt}
              className="block w-fit h-fit items-center justify-center"
            />
          </div>
        ))}
      </div>

      {/* Navigation Controls */}
      <button
        className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75"
        onClick={handlePrev}
      >
        ❮
      </button>
      <button
        className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75"
        onClick={handleNext}
      >
        ❯
      </button>

      {/* Dots for Navigation */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {carouselImages.map((_, index) => (
          <button
            key={index}
            className={`w-3 h-3 rounded-full ${
              currentIndex === index
                ? "bg-tertiary"
                : "bg-gray-400 hover:bg-gray-200"
            }`}
            onClick={() => setCurrentIndex(index)}
          ></button>
        ))}
      </div>
    </div>
  );
};

export default Carousel;
