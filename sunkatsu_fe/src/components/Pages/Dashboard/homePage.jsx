import React from "react";
import Navbar from "../../Fragment/Navbar";
import Vector from "../../../assets/Vector_3.png"
import Curry from "../../../assets/curry.png"

const Homepage = () => {
    return (
        <>
            <div>
                <Navbar />
                <section className="bg-primary py-16 px-6">
                    <div className="flex justify-between items-center">

                    <div className="w-1/2">
                        <img src={Curry} alt="Curry dish" className="w-full max-w-xl rounded-lg shadow-lg"/>
                    </div>

                    <div className="flex justify-between items-center">
                        <h1 className="text-5xl font-bold mb-4">THE DELIGHTNESS OF ORIENTAL KATSU.</h1>
                        <p className="text-lg text-black mb-8">
                        CLASSIC RECIPE SINCE 1998!
                        </p>
                        <button className="bg-secondary text-white px-6 py-3 rounded-lg hover:bg-red-400">
                        Order Now!
                        </button>
                    </div>
                    </div>
                </section>
            </div>
        </>
    );
}

export default Homepage;
