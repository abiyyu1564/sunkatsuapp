import React from "react";
import Vector from "../../assets/NewLanding_vector.png";
import Katsu from "../../assets/NewLanding_Katsu.png";
import Masak from "../../assets/orangMasak.png";
import Vector_3 from "../../assets/Vector_3.png";
import { Link } from "react-router-dom";

const NewLanding = () => {
  return (
    <div className="flex flex-col min-h-screen">
      {" "}
      {/* Make the parent a flex container */}
      <section className="flex-grow">
        {" "}
        {/* Allow the section to grow and take available space */}
        <div className="flex flex-col md:flex-row justify-between items-center my-10">
          <div className="relative w-1/2 h-screen flex-shrink-0">
            <img
              src={Vector}
              className="w-3/4 h-11/12 absolute top-20 left-0"
              alt="Decorative vector design related to Katsu"
            />
            <img
              src={Katsu}
              className="w-96 h-96 absolute left-48"
              alt="Delicious Katsu dish"
            />
          </div>
          <div className="pt-20 flex flex-col w-1/2 h-screen justify-start items-start leading-10">
            <h1 className="text-5xl font-semibold">
              THE DELIGHTNESS OF ORIENTAL KATSU.
            </h1>
            <h2 className="text-2xl mt-2 font-semibold text-[#FF0000]">
              CLASSIC RECIPE SINCE 1998!
            </h2>
            <button className="bg-[#8E0808] flex items-center justify-center mt-5 text-white font-bold py-2 px-4 w-36 h-8 rounded-md">
              <Link to="/login">Order Now!</Link>
            </button>
          </div>
        </div>
        <div className="w-full h-svh">
          <div className="bg-[#8E0808] h-full flex justify-between items-center px-10">
            <div className="w-1/2">
              <h1 className="text-5xl font-bold font-sans text-white">
                MAN BEHIND
              </h1>
              <h1 className="text-5xl font-bold font-sans text-white">
                THE MASTERPIECE.
              </h1>
              <h3 className="text-2xl font-bold font-sans text-[#FFE100]">
                CHARLES LECLERC
              </h3>
            </div>
            <img src={Masak} alt="a chef cooking" />
          </div>
        </div>
        <div className="w-full min-h-screen flex flex-col justify-between">
          <div className="relative flex-grow">
            <img
              src={Vector_3}
              className="w-5/12 h-4/6 mt-48 absolute top-0 right-0"
              alt="decorative vector design"
            />
          </div>
        </div>
      </section>
    </div>
  );
};

export default NewLanding;
