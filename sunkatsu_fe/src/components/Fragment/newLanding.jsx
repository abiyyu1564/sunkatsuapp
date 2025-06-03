import React from "react";
import Vector from "../../assets/NewLanding_vector.png";
import Katsu from "../../assets/NewLanding_Katsu.png";
import Masak from "../../assets/orangMasak.png";
import Vector_3 from "../../assets/Vector_3.png";
import { Link } from "react-router-dom";
import HeroBanner from "../../assets/heroBanner.png";
import AllMenus from "../../assets/allmenus.png";
import ArrowRight from "../../assets/arrow-right.png";
import Curry from "../../assets/curry.png";
import Drink from "../../assets/landingdrink.png";
import Dessert from "../../assets/landingdessert.png";

const NewLanding = () => {
  return (
    <div className="flex min-h-screen pt-10 bg-white">
      <section>
        <div className="flex flex-col md:flex-row justify-between items-center mt-6">
          {/* Section 1 - Banner*/}
          <img
            src={HeroBanner}
            alt="Sunkatsu banner"
            className='w-screen'
          />
        </div>

        {/* Section 2 - Items Selection */}
        <div className="flex flex-col items-center justify-center bg-white gap-5 w-full h-fit py-10">
        <h1 className="text-center text-black justify-center font-bold text-4xl py-5">
          Choose Your Picks
        </h1>

          <div className="flex flex-row  w-screen h-fit items-center justify-center gap-8">
            <div className="flex flex-col w-auto h-auto items-center justify-center">
              <img
                  src={AllMenus}
                  className='w-[300px] h-[300px] py-4'
              />
              <h1 className='text-3xl font-bold m-5'>
                All Menus
              </h1>
              <div className="flex rounded-lg flex-row bg-red-500 shadow-md items-center px-2.5">
                <a className='items-center justify-center py-2.5 text-white mx-2 font-thin'
                   href='http://localhost:3000/menu'>
                  Browse Now
                </a>
                <img
                    src={ArrowRight}
                    className='w-6 h-6 items-start'
                />
              </div>
            </div>

            <div className="flex flex-col w-auto h-auto items-center justify-center">
              <img
                  src={Curry}
                  className='w-[300px] h-[300px] p-4'
              />
              <h1 className='text-3xl font-bold m-5'>
                Foods
              </h1>
              <div className="flex rounded-lg flex-row bg-red-500 shadow-md items-center px-2.5">
                <a className='items-center justify-center py-2.5 text-white mx-2 font-thin'
                   href='http://localhost:3000/menu'>
                  Order Now
                </a>
                <img
                    src={ArrowRight}
                    className='w-6 h-6 items-start'
                />
              </div>
            </div>

            <div className="flex flex-col w-auto h-auto items-center justify-center">
              <img
                  src={Drink}
                  className='w-[300px] h-[300px] p-4'
              />
              <h1 className='text-3xl font-bold m-5'>
                Drinks
              </h1>
              <div className="flex rounded-lg flex-row bg-red-500 shadow-md items-center px-2.5">
                <a className='items-center justify-center py-2.5 text-white mx-2 font-thin'
                   href='http://localhost:3000/menu'>
                  Order Now
                </a>
                <img
                    src={ArrowRight}
                    className='w-6 h-6 items-start'
                />
              </div>
            </div>

            <div className="flex flex-col w-auto h-auto items-center justify-center">
              <img
                  src={Dessert}
                  className='w-[300px] h-[300px] p-4'
              />
              <h1 className='text-3xl font-bold m-5'>
                Dessert
              </h1>
              <div className="flex rounded-lg flex-row bg-red-500 shadow-md items-center px-2.5">
                <a className='items-center justify-center py-2.5 text-white mx-2 font-thin'
                   href='http://localhost:3000/menu'>
                  Order Now
                </a>
                <img
                    src={ArrowRight}
                    className='w-6 h-6 items-start'
                />
              </div>
            </div>

          </div>

        </div>

      </section>
    </div>
  );
};

export default NewLanding;
