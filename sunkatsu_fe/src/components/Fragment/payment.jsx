import React, { useState } from "react";
import Katsu from "../../assets/curry.png";
import { FaCirclePlus } from "react-icons/fa6";
import { FaCircleMinus } from "react-icons/fa6";
import { FaSquareCheck } from "react-icons/fa6";
import qrcode from "../../assets/qrcode.png";

import Navbar from "./Navbar";

const Payment = () => {
  const [counter, setCounter] = useState(1);
  const increaseCounter = () => {
    setCounter(counter + 1);
  };

  const decreaseCounter = () => {
    if (counter > 1) {
      setCounter(counter - 1);
    } else {
      alert("Remove Menu from Cart?");
    }
  };

  return (
    <>
      <Navbar />
      <div className="pt-16">
        <div className="w-5/6 h-12 mb-5 px-5 rounded-t-xl flex items-center mx-auto bg-[#B70000] z-20 relative">
          <p className="font-sans text-lg text-white">Your Cart</p>
        </div> 

        {/* QR Code Layer */}
        <div className="absolute top-[100px] w-full flex justify-center z-10">
          <div
            className="w-5/6 bg-white p-5 rounded-lg shadow-md opacity-95"
            style={{ height: "530px" }}
          >
            <div className="flex h-full">
              {/* QR Code */}
              <div className="w-1/2 flex justify-center items-center">
                <img
                  src={qrcode}
                  alt="QR Code"
                  className="w-[420px] h-[320px] object-contain"
                />
              </div>

              {/* Text Section */}
              <div className="w-1/2 flex items-center">
                <p className="text-lg font-medium leading-7">
                  Silahkan lakukan pembayaran <br />
                  Sesuai dengan nominal dibawah ini: <br />
                  <span className="text-2xl font-bold text-[#B70000]">
                    Rp. 33.000
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="relative z-0 pt-[200px]">
          <div className="flex w-5/6 mb-2 bg-white p-5 mx-auto items-center justify-between">
            <FaSquareCheck size={50} color="red" />
            <img src={Katsu} alt="katsu" className="w-24 h-24" />
            <h1 className="text-3xl w-7/12 text-center font-semibold">
              Chicken Katsu Curry
            </h1>
            <div>
              <h2 className="text-xl font-semibold my-2">Rp. 15.000</h2>
              <div className="flex w-fit h-fit gap-4 border-black border-2 rounded-2xl p-2">
                <button onClick={decreaseCounter}>
                  <FaCircleMinus size={30} color="red" />
                </button>
                <h2 className="text-2xl text-center font-semibold">{counter}</h2>
                <button onClick={increaseCounter}>
                  <FaCirclePlus size={30} color="red" />
                </button>
              </div>
            </div>
          </div>

          <div className="flex w-5/6 mb-2 bg-white p-5 mx-auto items-center justify-between">
            <FaSquareCheck size={50} color="red" />
            <img src={Katsu} alt="katsu" className="w-24 h-24" />
            <h1 className="text-3xl w-7/12 text-center font-semibold">
              Chicken Katsu Curry
            </h1>
            <div>
              <h2 className="text-xl font-semibold my-2">Rp. 15.000</h2>
              <div className="flex w-fit h-fit gap-4 border-black border-2 rounded-2xl p-2">
                <button onClick={decreaseCounter}>
                  <FaCircleMinus size={30} color="red" />
                </button>
                <h2 className="text-2xl text-center font-semibold">{counter}</h2>
                <button onClick={increaseCounter}>
                  <FaCirclePlus size={30} color="red" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center w-5/6 mx-auto bg-[#B70000] mt-5 p-5 rounded-b-xl">
          <div>
            <p className="font-sans text-white text-lg">Total Items: 3 items</p>
            <h2 className="font-sans text-white text-2xl">Total price: 33.000</h2>
          </div>
          <button className="text-white bg-secondary rounded-md h-10 w-32">
            Done
          </button>
        </div>
      </div>
    </>
  );
};

export default Payment;
