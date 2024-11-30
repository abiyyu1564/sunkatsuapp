import React from "react";
import gambarHero from "../../assets/heroLanding.png";

const HeroLanding = () => {
  return (
    <div className="flex my-10 mx-10 justify-between">
      <div className="w-5/12 p-10">
        <h1 className="text-5xl font-bold text-[#FF0000] my-5">
          Eat Katsu Every Day To Win Every Day!!
        </h1>
        <p className="text-3xl">
          Feast with us with our high quality katsu coupled with your choice of
          our many high quality sauces!
        </p>
      </div>
      <img src={gambarHero} alt="Hero Landing" />
    </div>
  );
};

export default HeroLanding;
