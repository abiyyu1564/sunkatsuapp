import React from "react";
import Vector from "../../assets/NewLanding_vector.png";
import Katsu from "../../assets/NewLanding_Katsu.png";
import Masak from "../../assets/orangMasak.png";
import Vector_3 from "../../assets/Vector_3.png";
import { Link } from "react-router-dom";

const NewLanding = () => {
  return (
    <div className="flex flex-col min-h-screen pt-10 bg-primary">
      <section className="flex-grow">
        <div className="flex flex-col md:flex-row justify-between items-center my-10 px-5 md:px-10">
          {/* Left Side - Image Section */}
          <div className="relative w-full md:w-1/2 h-96 md:h-screen flex-shrink-0">
            <img
              src={Vector}
              className="w-3/4 h-3/4 md:w-3/4 md:h-11/12 absolute top-20 left-[-50px]"
              alt="Decorative vector design related to Katsu"
            />
            <img
              src={Katsu}
              className="w-64 h-64 md:w-96 md:h-96 absolute left-15 md:left-20 md:top-0 top-10"
              alt="Delicious Katsu dish"
            />
          </div>

          {/* Right Side - Text Section */}
          <div className="pt-10 md:pt-10 flex flex-col w-full md:w-1/2 h-auto justify-start md:items-start items-center leading-8 md:leading-10 text-center md:text-left">
            <h1 className="text-3xl md:text-5xl font-semibold">
              THE DELIGHTNESS OF ORIENTAL KATSU.
            </h1>
            <h2 className="text-xl md:text-2xl mt-2 font-semibold text-[#FF0000]">
              CLASSIC RECIPE SINCE 1998!
            </h2>
            <button className="bg-[#8E0808] flex items-center justify-center mt-5 text-white font-bold py-2 px-6 md:px-4 w-36 h-10 rounded-md">
              <Link to="/login">Order Now!</Link>
            </button>
          </div>
        </div>

        {/* Section 2 - About the Chef */}
        <div className="bg-[#8E0808] h-auto flex flex-col md:flex-row justify-between items-center px-5 md:px-10 py-10 md:py-16">
          <div className="w-full md:w-1/2 text-center md:text-left">
            <h1 className="text-3xl md:text-5xl font-bold font-sans text-white">
              MAN BEHIND
            </h1>
            <h1 className="text-3xl md:text-5xl font-bold font-sans text-white">
              THE MASTERPIECE.
            </h1>
            <h3 className="text-xl md:text-2xl font-bold font-sans text-[#FFE100] mt-2">
              CHARLES LECLERC
            </h3>
          </div>
          <img
            src={Masak}
            alt="A chef cooking"
            className="w-full md:w-1/2 h-auto object-cover mt-6 md:mt-0"
          />
        </div>

        {/* Section 3 - Decorative Vector */}
        <div className="relative flex-grow flex justify-end mt-16 md:mt-48">
          <img
            src={Vector_3}
            className="w-7/12 md:w-5/12 h-auto md:h-4/6 top-0 right-0"
            alt="Decorative vector design"
          />
        </div>
      </section>
    </div>
  );
};

export default NewLanding;
